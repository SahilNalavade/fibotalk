// EditForm.jsx
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Box,
  useColorModeValue,
  Switch,
  Grid,
  GridItem,
  Heading,
  Button,
  Text,
  Icon,
  Tooltip,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { FiUpload } from 'react-icons/fi';
import { InfoOutlineIcon } from '@chakra-ui/icons';

const EditForm = ({ formData, setFormData }) => {
  const boxBgColor = useColorModeValue('white', 'gray.800');
  const toast = useToast();

  // State for selected JSON file
  const [selectedFile, setSelectedFile] = useState(null);

  // Colors for concise display of non-editable fields
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Fields that should be displayed as non-editable info boxes
  const fieldsToDisplay = ['Project ID', 'Client Email', 'Client ID', 'Private Key ID'];

  // Handle text input changes
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Handle toggle switch changes for boolean values
  const handleToggleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value ? 'Active' : 'Inactive',
    });
  };

  // Fields that should be editable
  const editableFields = ['Client Email', 'Private Key ID'];
  const isFieldEditable = (field) => editableFields.includes(field);

  // Handle file change and JSON parsing
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);

        // Validate required fields in JSON
        if (!json.project_id || !json.client_email || !json.client_id || !json.private_key_id) {
          throw new Error('JSON file is missing required fields.');
        }

        setFormData((prev) => ({
          ...prev,
          serviceAccountKey: file,
          'Project ID': json.project_id,
          'Client Email': json.client_email,
          'Client ID': json.client_id,
          'Private Key ID': json.private_key_id,
          'Private Key': json.private_key,
        }));

        toast({
          title: 'File Uploaded',
          description: 'The service account JSON file has been successfully parsed.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      } catch (error) {
        toast({
          title: 'File Upload Error',
          description:
            error.message ||
            'Failed to parse the JSON file. Please ensure it is a valid BigQuery service account key.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    };

    reader.onerror = () => {
      toast({
        title: 'File Read Error',
        description: 'There was an error reading the file. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    };

    reader.readAsText(file);
  };

  // Function to render non-editable fields concisely
  const renderNonEditableField = (label, value) => (
    <Box
      p={3}
      borderWidth="1px"
      borderRadius="md"
      bg={bgColor}
      borderColor={borderColor}
      mb={2}
      flex="1"
    >
      <HStack justifyContent="space-between">
        <Text fontSize="sm" fontWeight="medium" color="gray.600">
          {label}
        </Text>
        <Text fontSize="sm" fontWeight="bold" color="gray.800">
          {value || 'N/A'}
        </Text>
      </HStack>
    </Box>
  );

  return (
    <Box p={6} borderRadius="md" boxShadow="md" bg={boxBgColor}>
      <VStack spacing={6} align="stretch">
        {/* Heading */}
        <Heading size="md" mb={4}>
          Edit Database Configuration
        </Heading>

        {/* File Upload for JSON */}
        <FormControl id="service-account-key" isRequired>
          <FormLabel mb={2}>
            BigQuery Service Account Key (JSON)
            <Tooltip label="Upload your BigQuery service account key in JSON format" fontSize="sm">
              <InfoOutlineIcon ml={2} boxSize={3} />
            </Tooltip>
          </FormLabel>
          <Box
            borderWidth={2}
            borderRadius="md"
            borderStyle="dashed"
            borderColor="gray.300"
            p={4}
            textAlign="center"
            transition="all 0.3s"
            _hover={{ borderColor: 'blue.500' }}
          >
            <Input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              display="none"
              id="service-account-key-upload"
            />
            <Button
              as="label"
              htmlFor="service-account-key-upload"
              variant="ghost"
              colorScheme="blue"
              size="md"
              leftIcon={<Icon as={FiUpload} />}
              mb={2}
            >
              {selectedFile ? 'Change File' : 'Select JSON File'}
            </Button>
            <Text fontSize="sm" color="gray.500">
              {selectedFile ? selectedFile.name : 'No file selected'}
            </Text>
          </Box>
        </FormControl>

        {/* Render Project ID and Client ID on one line */}
        <HStack spacing={4}>
          {renderNonEditableField('Project ID', formData['Project ID'])}
          {renderNonEditableField('Client ID', formData['Client ID'])}
        </HStack>

        {/* Render other editable and non-editable fields */}
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {Object.entries(formData).map(([key, value]) =>
            isFieldEditable(key) ? (
              <GridItem key={key} colSpan={1}>
                <FormControl id={key.toLowerCase().replace(/\s/g, '-')}>
                  <FormLabel>{key.replace(/_/g, ' ')}</FormLabel>
                  <Input
                    value={value || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    placeholder={`Enter ${key}`}
                  />
                </FormControl>
              </GridItem>
            ) : fieldsToDisplay.includes(key) && key !== 'Project ID' && key !== 'Client ID' ? (
              // Render only necessary non-editable fields
              <GridItem key={key} colSpan={2}>
                {renderNonEditableField(key.replace(/_/g, ' '), value)}
              </GridItem>
            ) : null
          )}
        </Grid>

        {/* Status Field at the Bottom */}
        {formData['State'] && (
          <Box>
            <FormControl id="state">
              <FormLabel>Status</FormLabel>
              <Switch
                isChecked={formData['State'] === 'Active'}
                onChange={(e) => handleToggleChange('State', e.target.checked)}
                colorScheme="teal"
                size="lg"
              />
            </FormControl>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default EditForm;
