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

const EditAPI = ({ onBack, onDelete, initialData, addNewApiKey }) => {
  const [isEnabled, setIsEnabled] = useState(initialData?.status === 'Active');
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    service: initialData?.service || '',
    apiKeyName: initialData?.apiKeyName || '',
    apiKey: initialData?.apiKey || '',
  });

  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
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

  const handleSave = async () => {
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

    try {
      const AIRTABLE_PAT =
        'pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89';
      const AIRTABLE_BASE_ID = 'app4ZQ9jav2XzNIv9';
      const AIRTABLE_TABLE_NAME = 'trial';

      // Fetch the record ID of the current API key
      const response = await axios.get(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?filterByFormula={Organisation ID}="${formData.id}"`,
        {
          headers: {
            Authorization: `Bearer ${AIRTABLE_PAT}`,
          },
        }
      );

      const recordId = response.data.records[0]?.id;

      if (!recordId) {
        throw new Error('Record not found for updating.');
      }

      // If setting this API key to active, deactivate others
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
                UpdatedAt: new Date().toISOString(),
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

      const updatedApiData = {
        fields: {
          'Organisation ID': formData.id,
          'AI Model': formData.service,
          KeyName: formData.apiKeyName,
          'API Key': formData.apiKey,
          State: isEnabled ? 'Active' : 'Inactive',
          CreatedAt: initialData?.dateCreated || new Date().toISOString(),
          UpdatedAt: new Date().toISOString(),
        },
      };

      await axios.patch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}/${recordId}`,
        updatedApiData,
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
        apiKey: formData.apiKey,
      });

      toast({
        title: 'Form Saved',
        description: 'Your API configuration has been updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      onBack();
    } catch (error) {
      console.error('Error updating Airtable:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description:
          error.response?.data?.error?.message || 'There was an error saving your data. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setIsConfirmSaveOpen(false); // Close confirmation dialog after attempting to save
    }
  };

  const handleDelete = async () => {
    try {
      const AIRTABLE_PAT =
        'pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89';
      const AIRTABLE_BASE_ID = 'app4ZQ9jav2XzNIv9';
      const AIRTABLE_TABLE_NAME = 'trial';

      // Find the record ID based on Organisation ID
      const response = await axios.get(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?filterByFormula={Organisation ID}="${formData.id}"`,
        {
          headers: {
            Authorization: `Bearer ${AIRTABLE_PAT}`,
          },
        }
      );

      const recordId = response.data.records[0]?.id; // Get the record ID of the first match

      if (!recordId) {
        throw new Error('Record not found for deletion.');
      }

      await axios.patch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}/${recordId}`,
        {
          fields: {
            State: 'Deleted',
            UpdatedAt: new Date().toISOString(),
          },
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
        apiKey: formData.apiKey,
      });

      toast({
        title: 'API Key Deleted',
        description: 'The API key has been marked as deleted.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      onBack();
    } catch (error) {
      console.error('Error deleting from Airtable:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description:
          error.response?.data?.error?.message || 'There was an error deleting the API key. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setIsConfirmDeleteOpen(false); // Close confirmation dialog after attempting to delete
      setDeleteConfirmation(''); // Clear the delete confirmation input
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
                <MenuItem key={service} onClick={() => handleMenuClick(service)} _hover={{ bg: 'gray.100' }}>
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
            <Switch id="enable-api-key" isChecked={isEnabled} onChange={() => setIsEnabled(!isEnabled)} />
          </FormControl>
        </HStack>

        <HStack spacing={6} justify="space-between">
          <Button colorScheme="red" size="md" onClick={() => setIsConfirmDeleteOpen(true)}>
            Delete
          </Button>
          <HStack spacing={6}>
            <Button bg={'transparent'} _hover={{ bg: 'transparent' }} size="md" onClick={handleCancel}>
              Cancel
            </Button>
            <Button colorScheme="blue" size="md" onClick={() => setIsConfirmSaveOpen(true)}>
              Save
            </Button>
          </HStack>
        </HStack>
      </VStack>

      {/* Confirmation Dialog for Save */}
      <AlertDialog
        isOpen={isConfirmSaveOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsConfirmSaveOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Save
            </AlertDialogHeader>
            <AlertDialogBody>
              Saving changes will update the API key details. Do you want to proceed?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsConfirmSaveOpen(false)}
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

      {/* Confirmation Dialog for Delete */}
      <AlertDialog
        isOpen={isConfirmDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsConfirmDeleteOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
  {`Delete API Key: ${formData.apiKeyName}`}
</AlertDialogHeader>
<AlertDialogBody>
  Are you sure you want to delete this {isEnabled ? 'active ' : ''}API key? Please type <b>delete</b> to confirm.
  <Input
    mt={4}
    placeholder="Type delete"
    value={deleteConfirmation}
    onChange={(e) => setDeleteConfirmation(e.target.value)}
  />
</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsConfirmDeleteOpen(false)}
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
                onClick={handleDelete}
                ml={3}
                bg="#32343A"
                color="white"
                _hover={{ bg: '#2b2d33' }}
                _active={{ bg: '#232529' }}
                isDisabled={deleteConfirmation.toLowerCase() !== 'delete'}
              >
                Confirm Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default EditAPI;
