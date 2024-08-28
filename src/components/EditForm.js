import React from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';

const EditForm = ({ formData, setFormData, databaseType }) => {
  const boxBgColor = useColorModeValue('white', 'gray.800');

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <Box p={4} borderRadius="md" boxShadow="md" bg={boxBgColor}>
      <VStack spacing={3} align="stretch">
        <FormControl id="database-server" isRequired>
          <FormLabel>Database Server</FormLabel>
          <Input value={databaseType} isReadOnly />
        </FormControl>

        {databaseType === 'BigQuery' && (
          <>
            <FormControl id="project-id">
              <FormLabel>Project ID</FormLabel>
              <Input
                value={formData['Project ID'] || ''}
                onChange={(e) => handleInputChange('Project ID', e.target.value)}
              />
            </FormControl>

            <FormControl id="client-email">
              <FormLabel>Client Email</FormLabel>
              <Input
                value={formData['Client Email'] || ''}
                onChange={(e) => handleInputChange('Client Email', e.target.value)}
              />
            </FormControl>

            <FormControl id="client-id">
              <FormLabel>Client ID</FormLabel>
              <Input
                value={formData['Client ID'] || ''}
                onChange={(e) => handleInputChange('Client ID', e.target.value)}
              />
            </FormControl>

            <FormControl id="private-key-id">
              <FormLabel>Private Key ID</FormLabel>
              <Input
                value={formData['Private Key ID'] || ''}
                onChange={(e) => handleInputChange('Private Key ID', e.target.value)}
              />
            </FormControl>
          </>
        )}

        {databaseType === 'SnowFlake' && (
          <>
            <HStack spacing={3}>
              <FormControl id="username">
                <FormLabel>Username</FormLabel>
                <Input
                  value={formData['Username'] || ''}
                  onChange={(e) => handleInputChange('Username', e.target.value)}
                />
              </FormControl>

              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={formData['Password'] || ''}
                  onChange={(e) => handleInputChange('Password', e.target.value)}
                />
              </FormControl>
            </HStack>

            <HStack spacing={3}>
              <FormControl id="account">
                <FormLabel>Account</FormLabel>
                <Input
                  value={formData['Account'] || ''}
                  onChange={(e) => handleInputChange('Account', e.target.value)}
                />
              </FormControl>

              <FormControl id="warehouse">
                <FormLabel>Warehouse</FormLabel>
                <Input
                  value={formData['Warehouse'] || ''}
                  onChange={(e) => handleInputChange('Warehouse', e.target.value)}
                />
              </FormControl>
            </HStack>

            <FormControl id="role">
              <FormLabel>Role</FormLabel>
              <Input
                value={formData['Role'] || ''}
                onChange={(e) => handleInputChange('Role', e.target.value)}
              />
            </FormControl>
          </>
        )}

        <FormControl id="description">
          <FormLabel>Description</FormLabel>
          <Input
            value={formData['Description'] || ''}
            onChange={(e) => handleInputChange('Description', e.target.value)}
          />
        </FormControl>

        <HStack spacing={3}>
          <FormControl id="state">
            <FormLabel>Status</FormLabel>
            <Input
              value={formData['State'] || ''}
              onChange={(e) => handleInputChange('State', e.target.value)}
            />
          </FormControl>

          <FormControl id="date-created">
            <FormLabel>Date Created</FormLabel>
            <Input
              value={formData['CreatedAt'] || ''}
              isReadOnly
            />
          </FormControl>

          <FormControl id="date-modified">
            <FormLabel>Date Modified</FormLabel>
            <Input
              value={formData['UpdatedAt'] || ''}
              isReadOnly
            />
          </FormControl>
        </HStack>
      </VStack>
    </Box>
  );
};

export default EditForm;
