import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
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
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { ArrowBackIcon, ChevronDownIcon } from '@chakra-ui/icons';

const APIForm = ({ onBack, onSave }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    apiKeyName: '',
    apiKey: '',
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const cancelRef = useRef();
  const menuButtonRef = useRef();
  const [menuListWidth, setMenuListWidth] = useState('auto');

  const toast = useToast();
  const boxBgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    if (menuButtonRef.current) {
      setMenuListWidth(`${menuButtonRef.current.offsetWidth}px`);
    }
  }, [menuButtonRef.current]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSave = async () => {
    const uniqueId = new Date().getTime().toString();
    const currentTime = formatDate(new Date());
    const state = isEnabled ? 'Active' : 'Inactive';

    try {
      const AIRTABLE_PAT = 'pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89';
      const AIRTABLE_BASE_ID = 'app4ZQ9jav2XzNIv9';
      const AIRTABLE_TABLE_NAME = 'trial';

      // If the new API key is set to Active, update other API keys to Inactive
      if (isEnabled) {
        const existingKeysResponse = await axios.get(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?filterByFormula=NOT({State}='Deleted')`,
          {
            headers: {
              Authorization: `Bearer ${AIRTABLE_PAT}`,
            },
          }
        );

        // Set all existing active keys to inactive
        const updatePromises = existingKeysResponse.data.records.map((record) =>
          axios.patch(
            `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}/${record.id}`,
            {
              fields: {
                State: 'Inactive',
                UpdatedAt: formatDate(new Date()),
              },
            },
            {
              headers: {
                Authorization: `Bearer ${AIRTABLE_PAT}`,
                'Content-Type': 'application/json',
              },
            }
          )
        );

        await Promise.all(updatePromises);
      }

      // Save the new API key
      await axios.post(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
        {
          fields: {
            'Organisation ID': uniqueId,
            'AI Model': formData.service,
            KeyName: formData.apiKeyName,
            'API Key': formData.apiKey,
            State: state,
            CreatedAt: currentTime,
            UpdatedAt: currentTime,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${AIRTABLE_PAT}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const newApiKey = {
        id: uniqueId,
        name: formData.apiKeyName,
        status: state,
        dateCreated: currentTime,
        dateModified: currentTime,
        service: formData.service,
        apiKeyName: formData.apiKeyName,
        apiKey: formData.apiKey,
      };

      onSave?.(newApiKey);

      setFormData({
        service: '',
        apiKeyName: '',
        apiKey: '',
      });
      setIsEnabled(false);

      toast({
        title: 'Form Saved',
        description: 'Your API configuration has been saved.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      console.error('Error saving to Airtable:', error.response ? error.response.data : error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.error?.message || 'There was an error saving your data. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setIsConfirmOpen(false);
    }
  };

  const handleConfirmSave = () => {
    if (!formData.service || !formData.apiKeyName || !formData.apiKey) {
      toast({
        title: 'Form Incomplete',
        description: 'Please fill out all required fields.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleCancel = () => {
    onBack();
  };

  const handleMenuClick = (service) => {
    setFormData({ ...formData, service });
  };

  const services = ['ChatGPT4'];

  return (
    <Box
      width="70%"
      margin="auto"
      padding="6"
      pt={10}
      borderRadius="lg"
      boxShadow="xl"
      bg={boxBgColor}
      mt={10}
    >
      <VStack spacing={8} align="stretch">
        <HStack justify="flex-start" spacing={4}>
          <IconButton
            icon={<ArrowBackIcon />}
            aria-label="Go back"
            onClick={onBack}
            variant="ghost"
          />
          <Text fontSize="lg" fontWeight="bold">
            API Configuration
          </Text>
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
            onChange={(e) =>
              setFormData({ ...formData, apiKeyName: e.target.value })
            }
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

        <HStack spacing={6} justify="flex-end">
          <Button
            bg={'transparent'}
            _hover={{ bg: 'transparent' }}
            size="md"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            size="md"
            onClick={handleConfirmSave}
          >
            Save
          </Button>
        </HStack>
      </VStack>

      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={isConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Save
            </AlertDialogHeader>

            <AlertDialogBody>
              Creating a new API key will make the current one inactive. Do you
              want to proceed?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsConfirmOpen(false)}
                bg="white"
                border="1px solid"
                borderColor="#32343A"
                color="#32343A"
                _hover={{ bg: '#f7f7f7' }}
                _active={{ bg: '#e2e2e2' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                ml={3}
                bg="#32343A"
                color="white"
                _hover={{ bg: '#2b2d33' }}
                _active={{ bg: '#232529' }}
              >
                Yes, Save
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default APIForm;
