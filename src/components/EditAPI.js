import React, { useState, useRef, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Switch,
  Button,
  VStack,
  HStack,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Text,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import axios from 'axios';
import { ArrowBackIcon, ChevronDownIcon } from '@chakra-ui/icons';

const EditAPI = ({ onBack, onDelete, initialData, addNewApiKey }) => {
  const [isEnabled, setIsEnabled] = useState(initialData?.status === 'Active');
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    service: initialData?.service || '',
    apiKeyName: initialData?.apiKeyName || '',
    apiKey: initialData?.apiKey || ''
  });

  const menuButtonRef = useRef();
  const [menuListWidth, setMenuListWidth] = useState('auto');

  useEffect(() => {
    if (menuButtonRef.current) {
      setMenuListWidth(`${menuButtonRef.current.offsetWidth}px`);
    }
  }, [menuButtonRef.current]);

  const toast = useToast();
  const boxBgColor = useColorModeValue('white', 'gray.800');

  const handleSave = async () => {
    if (!formData.service || !formData.apiKeyName || !formData.apiKey) {
      toast({
        title: 'Form Incomplete',
        description: 'Please fill out all required fields.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      return;
    }

    try {
      const AIRTABLE_PAT = 'pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89';
      const AIRTABLE_BASE_ID = 'app4ZQ9jav2XzNIv9';
      const AIRTABLE_TABLE_NAME = 'trial';

      const updatedApiData = {
        "Organisation ID": formData.id || new Date().getTime().toString(), // Ensure this matches the field name in Airtable
        "AI Model": formData.service, // Ensure this matches the field name in Airtable
        KeyName: formData.apiKeyName, // Ensure this matches the field name in Airtable
        "API Key": formData.apiKey, // Ensure this matches the field name in Airtable
        State: isEnabled ? 'Active' : 'Inactive',
        CreatedAt: initialData?.dateCreated || new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      };

      const response = await axios.post(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
        { fields: updatedApiData },
        {
          headers: {
            Authorization: `Bearer ${AIRTABLE_PAT}`,
            'Content-Type': 'application/json',
          },
        }
      );

      addNewApiKey({
        id: formData.id,
        name: formData.apiKeyName,
        status: isEnabled ? 'Active' : 'Inactive',
        dateCreated: initialData?.dateCreated || new Date().toISOString(),
        dateModified: new Date().toISOString(),
        service: formData.service,
        apiKeyName: formData.apiKeyName,
        apiKey: formData.apiKey
      });

      toast({
        title: 'Form Saved',
        description: 'Your API configuration has been saved.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      onBack();
    } catch (error) {
      console.error('Error updating Airtable:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.error?.message || 'There was an error saving your data. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    }
  };

  const handleDelete = async () => {
    try {
      const AIRTABLE_PAT = 'pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89';
      const AIRTABLE_BASE_ID = 'app4ZQ9jav2XzNIv9';
      const AIRTABLE_TABLE_NAME = 'trial';

      const response = await axios.post(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
        {
          fields: {
            "Organisation ID": formData.id,
            "AI Model": formData.service,
            KeyName: formData.apiKeyName,
            "API Key": formData.apiKey,
            State: 'Deleted',
            CreatedAt: initialData?.dateCreated || new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
          }
        },
        {
          headers: {
            Authorization: `Bearer ${AIRTABLE_PAT}`,
            'Content-Type': 'application/json',
          },
        }
      );

      onDelete({
        id: formData.id,
        name: formData.apiKeyName,
        status: 'Deleted',
        dateCreated: initialData?.dateCreated || new Date().toISOString(),
        dateModified: new Date().toISOString(),
        service: formData.service,
        apiKeyName: formData.apiKeyName,
        apiKey: formData.apiKey
      });

      toast({
        title: 'API Key Deleted',
        description: 'The API key has been marked as deleted.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      onBack();
    } catch (error) {
      console.error('Error updating Airtable:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.error?.message || 'There was an error deleting the API key. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    }
  };

  const handleCancel = () => {
    onBack();
  };

  const handleMenuClick = (service) => {
    setFormData({ ...formData, service });
  };

  const services = ['ChatGPT4'];

  return (
    <Box width="70%" margin="auto" padding="6" pt={10} borderRadius="lg" boxShadow="xl" bg={boxBgColor} mt={10}>
      <VStack spacing={8} align="stretch">
        <HStack justify="flex-start" spacing={4}>
          <IconButton
            icon={<ArrowBackIcon />}
            aria-label="Go back"
            onClick={onBack}
            variant="ghost"
          />
          <Text fontSize="lg" fontWeight="bold">API Configuration</Text>
        </HStack>

        <FormControl id="service" isRequired>
          <FormLabel>Service</FormLabel>
          <Menu>
            <MenuButton
              as={Button}
              size="lg"
              width="100%"
              rightIcon={<ChevronDownIcon />}
              textAlign="left"
              variant="outline"
              bg="white"
              _hover={{ bg: 'white' }}
              _focus={{ boxShadow: 'outline', bg: 'white' }}
              ref={menuButtonRef}
              fontSize="md"
              fontWeight="normal"
              padding="0.875rem 1rem"
            >
              {formData.service || 'Select a service'}
            </MenuButton>
            <MenuList width={menuListWidth} bg="white">
              {services.map((service) => (
                <MenuItem
                  key={service}
                  onClick={() => handleMenuClick(service)}
                  _hover={{ bg: 'gray.100' }}
                >
                  {service}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </FormControl>

        <FormControl id="api-key-name" isRequired>
          <FormLabel>API Key Name</FormLabel>
          <Input
            placeholder="Enter API key name"
            size="lg"
            value={formData.apiKeyName}
            onChange={(e) => setFormData({ ...formData, apiKeyName: e.target.value })}
          />
        </FormControl>

        <FormControl id="api-key" isRequired>
          <FormLabel>API Key</FormLabel>
          <Input
            placeholder="Enter API key"
            size="lg"
            value={formData.apiKey}
            onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
          />
        </FormControl>

        <HStack spacing={6}>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="enable-api-key" mb="0">
              Activate API Key
            </FormLabel>
            <Switch
              id="enable-api-key"
              isChecked={isEnabled}
              onChange={() => setIsEnabled(!isEnabled)}
            />
          </FormControl>
        </HStack>

        <HStack spacing={6} justify="space-between">
          <Button colorScheme="red" size="md" onClick={handleDelete}>
            Delete
          </Button>
          <HStack spacing={6}>
            <Button bg={'transparent'} _hover={{ bg: 'transparent' }} size="md" onClick={handleCancel}>
              Cancel
            </Button>
            <Button colorScheme="blue" size="md" onClick={handleSave}>
              Save
            </Button>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default EditAPI;
