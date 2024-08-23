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
import { ArrowBackIcon, ChevronDownIcon } from '@chakra-ui/icons';

const EditAPI = ({ onBack, onDelete }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    apiKeyName: '',
    apiKey: ''
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

  const handleSave = () => {
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

    // Reset the form after saving
    setFormData({
      service: '',
      apiKeyName: '',
      apiKey: ''
    });
    setIsEnabled(false); // Reset the switch

    toast({
      title: 'Form Saved',
      description: 'Your API configuration has been saved.',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right'
    });
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  const handleDelete = () => {
    onDelete();
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
            <Button bg={'transparent'} _hover={{bg:'transparent'}} size="md" onClick={handleCancel}>
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
