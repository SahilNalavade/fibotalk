import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
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
  Center,
  VStack,
  Icon,
  Spinner,
  ButtonGroup,
} from '@chakra-ui/react';
import { FaPlus, FaSearch, FaKey, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import APIForm from './APIForm';
import EditAPI from './EditAPI';

const APIList = ({ onSave }) => {
  const [apiKeys, setApiKeys] = useState([]);
  const [view, setView] = useState('list');
  const [selectedApi, setSelectedApi] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const toast = useToast();

  const AIRTABLE_PAT = 'pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89';
  const AIRTABLE_BASE_ID = 'app4ZQ9jav2XzNIv9';
  const AIRTABLE_TABLE_NAME = 'Apilist';

  // Function to fetch API keys
  const fetchApiKeys = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?fields[]=Organisation ID&fields[]=KeyName&fields[]=State&fields[]=CreatedAt&fields[]=UpdatedAt&fields[]=AI Model&fields[]=API Key`,
        {
          headers: {
            Authorization: `Bearer ${AIRTABLE_PAT}`,
          },
        }
      );

      const records = response.data.records
        .filter((record) => record.fields.State && record.fields.State !== 'Deleted')
        .reduce((acc, record) => {
          const orgId = record.fields['Organisation ID'];
          if (!acc[orgId] || new Date(record.fields.UpdatedAt) > new Date(acc[orgId].UpdatedAt)) {
            acc[orgId] = {
              id: record.fields['Organisation ID'],
              name: record.fields.KeyName,
              status: record.fields.State,
              dateCreated: new Date(record.fields.CreatedAt),
              dateModified: new Date(record.fields.UpdatedAt),
              service: record.fields['AI Model'],
              apiKeyName: record.fields.KeyName,
              apiKey: record.fields['API Key'],
            };
          }
          return acc;
        }, {});

      // Sort records by status (Active first) and then by dateModified in descending order
      const sortedRecords = Object.values(records).sort((a, b) => {
        if (a.status === 'Active' && b.status !== 'Active') return -1;
        if (a.status !== 'Active' && b.status === 'Active') return 1;
        return b.dateModified - a.dateModified;
      });

      setApiKeys(sortedRecords);
    } catch (error) {
      console.error('Error fetching data from Airtable:', error);
      toast({
        title: 'Error',
        description: 'Failed to load API data from Airtable.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const handleNameClick = useCallback((api) => {
    setSelectedApi(api);
    setView('edit');
  }, []);

  const handleBack = useCallback(() => {
    setSelectedApi(null);
    setView('list');
  }, []);

  const handleDelete = useCallback(
    (deletedApiKey) => {
      setApiKeys(apiKeys.filter((key) => key.id !== deletedApiKey.id));
      fetchApiKeys(); // Refresh the list after deletion
    },
    [apiKeys, fetchApiKeys]
  );

  const handleNewAPIKey = useCallback(() => {
    setSelectedApi(null);
    setView('form');
  }, []);

  const addNewApiKey = useCallback(
    (newApiKey) => {
      setApiKeys((prevState) => {
        const filtered = prevState.filter((key) => key.id !== newApiKey.id);
        const updatedApiKeys = [...filtered, newApiKey];

        // Sort the updated list by status (Active first) and then by dateModified in descending order
        updatedApiKeys.sort((a, b) => {
          if (a.status === 'Active' && b.status !== 'Active') return -1;
          if (a.status !== 'Active' && b.status === 'Active') return 1;
          return b.dateModified - a.dateModified;
        });

        return updatedApiKeys;
      });

      setView('list');
      fetchApiKeys(); // Refresh the list after saving
      // Ensure it goes back to the first page with the most recent at the top
      setCurrentPage(1);
    },
    [fetchApiKeys]
  );

  const filteredApiKeys = useMemo(() => {
    return apiKeys.filter((key) => key.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [apiKeys, searchTerm]);

  const totalPages = Math.ceil(filteredApiKeys.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredApiKeys.length);
  const paginatedData = filteredApiKeys.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Pagination component
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <ButtonGroup variant="outline" spacing="2">
        <Button
          leftIcon={<FaChevronLeft />}
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
        >
          Previous
        </Button>
        {pageNumbers.map((number) => (
          <Button
            key={number}
            onClick={() => onPageChange(number)}
            colorScheme={currentPage === number ? 'blue' : 'gray'}
          >
            {number}
          </Button>
        ))}
        <Button
          rightIcon={<FaChevronRight />}
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
        >
          Next
        </Button>
      </ButtonGroup>
    );
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  return view === 'form' ? (
    <APIForm onBack={handleBack} onSave={addNewApiKey} />
  ) : view === 'edit' ? (
    <EditAPI onBack={handleBack} onDelete={handleDelete} initialData={selectedApi} addNewApiKey={addNewApiKey} />
  ) : (
    <Box boxShadow="lg" borderRadius="lg" p={4}>
      <Flex justifyContent="right" mb={4}>
        <Box mr={3}>
          <InputGroup width="400px">
            <InputLeftElement pointerEvents="none" color="gray.400">
              <FaSearch />
            </InputLeftElement>
            <Input placeholder="Search API Keys" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </InputGroup>
        </Box>
        <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={handleNewAPIKey}>
          New API Key
        </Button>
      </Flex>
      {paginatedData.length > 0 ? (
        <>
          <TableContainer>
            <Table variant="simple" size="md">
              <Thead bg="gray.100">
                <Tr>
                  <Th fontSize="md" pr={'100px'}>
                    NAME
                  </Th>
                  <Th fontSize="md">STATUS</Th>
                  <Th fontSize="md">DATE CREATED</Th>
                  <Th fontSize="md">DATE MODIFIED</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedData.map((key, index) => (
                  <Tr
                    key={index}
                    _hover={{ bg: 'gray.50' }}
                    transition="all 0.2s"
                    onClick={() => handleNameClick(key)}
                  >
                    <Td fontWeight="medium" _hover={{ cursor: 'pointer', textDecoration: 'underline' }}>
                      {key.name}
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Box as="span" h="10px" w="10px" borderRadius="full" bg={key.status === 'Active' ? 'green.400' : 'red.400'} />
                        <Text>{key.status}</Text>
                      </HStack>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.600">
                        {key.dateCreated.toLocaleString()}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.600">
                        {key.dateModified.toLocaleString()}
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex justifyContent="space-between" alignItems="center" mt={6}>
            <Text fontSize="sm" color="gray.600">
              Showing {startIndex + 1}-{endIndex} of {filteredApiKeys.length} results
            </Text>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </Flex>
        </>
      ) : (
        <Center h="300px">
          <VStack spacing={4}>
            <Icon as={FaKey} w={16} h={16} color="gray.300" />
            <Text fontSize="xl" fontWeight="bold" color="gray.600">
              No API Keys Found
            </Text>
            <Text fontSize="md" color="gray.500" textAlign="center">
              It looks like you haven't added any API keys yet. Click the button below to add a new API key.
            </Text>
            <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={handleNewAPIKey}>
              Add API Key
            </Button>
          </VStack>
        </Center>
      )}
    </Box>
  );
};

export default APIList;
