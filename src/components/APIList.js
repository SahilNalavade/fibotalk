import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Flex,
  useToast,
  Button,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
} from '@chakra-ui/react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import APIForm from './APIForm';
import EditAPI from './EditAPI';

const APIList = () => {
  const [apiKeys, setApiKeys] = useState([
    { name: 'PrimeAPI', status: 'Inactive', dateCreated: '01/07/2024 10:00 AM', dateModified: '29/07/2024 2:07 PM' },
    { name: 'AuraAPI', status: 'Inactive', dateCreated: '01/07/2024 10:00 AM', dateModified: '29/07/2024 2:07 PM' },
    { name: 'BreezeAPI', status: 'Inactive', dateCreated: '01/07/2024 10:00 AM', dateModified: '29/07/2024 2:07 PM' },
    { name: 'MyAPI', status: 'Inactive', dateCreated: '01/07/2024 10:00 AM', dateModified: '29/07/2024 2:07 PM' },
    { name: 'NewAPI', status: 'Active', dateCreated: '01/07/2024 10:00 AM', dateModified: '29/07/2024 2:07 PM' },
  ]);

  const [view, setView] = useState('list');
  const [selectedApi, setSelectedApi] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const handleToggle = (index) => {
    const updatedKeys = apiKeys.map((key, i) => ({
      ...key,
      status: i === index ? (key.status === 'Active' ? 'Inactive' : 'Active') : key.status,
      dateModified: i === index ? new Date().toLocaleString() : key.dateModified,
    }));
    setApiKeys(updatedKeys);

    const toggledKey = updatedKeys[index];
    toast({
      title: 'API Key Status Updated',
      description: `Status has been ${toggledKey.status === 'Active' ? 'activated' : 'deactivated'} for ${toggledKey.name}.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  };

  const handleNameClick = (api) => {
    setSelectedApi(api);
    setView('edit');
  };

  const handleBack = () => {
    setSelectedApi(null);
    setView('list');
  };

  const handleDelete = () => {
    setApiKeys(apiKeys.filter((key) => key.name !== selectedApi.name));
    setView('list');
    toast({
      title: 'API Key Deleted',
      description: `${selectedApi.name} has been deleted.`,
      status: 'warning',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  };

  const handleNewAPIKey = () => {
    setSelectedApi(null);
    setView('form');
  };

  if (view === 'form') {
    return <APIForm onBack={handleBack} />;
  }

  if (view === 'edit') {
    return <EditAPI onBack={handleBack} onDelete={handleDelete} initialData={selectedApi} />;
  }

  return (
    <Box boxShadow="lg" borderRadius="lg" p={4}>
      <Flex justifyContent="right" mb={4}>
        <Box mr={3}>
          <InputGroup width="400px">
            <InputLeftElement pointerEvents="none" color="gray.400">
              <FaSearch />
            </InputLeftElement>
            <Input
              placeholder="Search API Keys"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Box>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="blue"
          onClick={handleNewAPIKey}
        >
          New API Key
        </Button>
      </Flex>
      <TableContainer>
        <Table variant="simple" size="md">
          <Thead bg="gray.100">
            <Tr>
              <Th fontSize="md" pr={'100px'}>NAME</Th>
              <Th fontSize="md">STATUS</Th>
              <Th fontSize="md">DATE CREATED</Th>
              <Th fontSize="md">DATE MODIFIED</Th>
            </Tr>
          </Thead>
          <Tbody>
            {apiKeys
              .filter((key) =>
                key.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((key, index) => (
                <Tr
                  key={index}
                  _hover={{ bg: 'gray.50' }}
                  transition="all 0.2s"
                >
                  <Td
                    fontWeight="medium"
                    onClick={() => handleNameClick(key)}
                    _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {key.name}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Box
                        as="span"
                        h="10px"
                        w="10px"
                        borderRadius="full"
                        bg={key.status === 'Active' ? 'green.400' : 'red.400'}
                      />
                      <Text>{key.status}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <Text fontSize="sm" color="gray.600">
                      {key.dateCreated}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm" color="gray.600">
                      {key.dateModified}
                    </Text>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default APIList;
