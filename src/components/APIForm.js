import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Switch,
  Button,
  VStack,
  HStack,
  Box,
  Select,
  useColorModeValue,
  Center,
  Text,
  useToast
} from '@chakra-ui/react';

const APIForm = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    apiKeyName: '',
    apiKey: ''
  });

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

    // Handle form submission logic here
    console.log('Form saved:', formData);
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
    // Handle form reset or navigation here
    console.log('Form cancelled');
  };

  return (
    <Box width="70%" margin="auto" padding="6" pt={10} borderRadius="lg" boxShadow="xl" bg={boxBgColor} mt={10}>
      <VStack spacing={8} align="stretch">
        <HStack spacing={6}>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="enable-api-key" mb="0">
              Enable API Key
            </FormLabel>
            <Switch
              id="enable-api-key"
              isChecked={isEnabled}
              onChange={() => setIsEnabled(!isEnabled)}
            />
            
          </FormControl>
          
        </HStack>
        {/* <Text fontSize="md" color="gray.600">
              Enable API Key to access the selected service.
            </Text> */}

        {isEnabled && (
          <>

            <FormControl id="service" isRequired>
              <FormLabel>Service</FormLabel>
              <Select
                placeholder="Select a service"
                size="lg"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              >
                <option value="ChatGPT4">ChatGPT4</option>
                {/* Add more options if needed */}
              </Select>
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
          </>
        )}

        <HStack spacing={6} justify="center">
          <Button colorScheme="gray" size="md" onClick={handleCancel}>
            Cancel
          </Button>
          <Button colorScheme="blue" size="md" onClick={handleSave}>
            Save
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default APIForm;