// EditForm.jsx
import React from 'react';
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
  Divider,
  Heading,
} from '@chakra-ui/react';

const EditForm = ({ formData, setFormData }) => {
  const boxBgColor = useColorModeValue('white', 'gray.800');

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

  // Fields to exclude from rendering
  const excludedFields = [
    'CreatedAt',        // Exclude Created At
    'UpdatedAt',        // Exclude Updated At
    'Database Server',  // Non-editable field
    'Organisation ID',
    'Database',
    'Project ID',
    'Client ID'
  ];

  // Editable fields grouped logically
  const connectionFields = ['Project ID', 'Account', 'Warehouse'];
  const authenticationFields = ['Username', 'Password', 'Client Email', 'Client ID', 'Private Key ID'];

  return (
    <Box p={6} borderRadius="md" boxShadow="md" bg={boxBgColor}>
      <VStack spacing={6} align="stretch">
        {/* Heading */}
        <Heading size="md" mb={4}>
          Edit Database Configuration
        </Heading>

        {/* Render editable fields in a logically ordered grid layout */}
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {/* Connection Fields */}
          {connectionFields.map(
            (field) =>
              formData[field] && !excludedFields.includes(field) && (
                <GridItem key={field} colSpan={1}>
                  <FormControl id={field.toLowerCase().replace(/\s/g, '-')}>
                    <FormLabel>{field}</FormLabel>
                    <Input
                      value={formData[field] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      placeholder={`Enter ${field}`}
                    />
                  </FormControl>
                </GridItem>
              )
          )}

          {/* Authentication Fields */}
          {authenticationFields.map(
            (field) =>
              formData[field] && !excludedFields.includes(field) && (
                <GridItem key={field} colSpan={1}>
                  <FormControl id={field.toLowerCase().replace(/\s/g, '-')}>
                    <FormLabel>{field}</FormLabel>
                    <Input
                      type={field === 'Password' ? 'password' : 'text'}
                      value={formData[field] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      placeholder={`Enter ${field}`}
                    />
                  </FormControl>
                </GridItem>
              )
          )}

          {/* Additional Editable Fields */}
          {Object.entries(formData)
            .filter(
              ([key]) => !excludedFields.includes(key) && ![...connectionFields, ...authenticationFields, 'State'].includes(key)
            )
            .map(([key, value]) => (
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
            ))}
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
