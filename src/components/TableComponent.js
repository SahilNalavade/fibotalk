// TableComponent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  HStack,
  Text,
  LinkBox,
  LinkOverlay,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Image,
  IconButton,
  ButtonGroup,
} from '@chakra-ui/react';
import { FaPlus, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConnectForm from './ConnectForm';

const TableComponent = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const navigate = useNavigate();

  // Function to fetch data from Airtable
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.airtable.com/v0/app4ZQ9jav2XzNIv9/DatabaseConfig`,
        {
          headers: {
            Authorization: `Bearer pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89`, // Replace with your actual Airtable API key
          },
        }
      );

      const records = response.data.records.map((record) => {
        let logoUrl = '';
        if (record.fields['Database Server'] === 'BigQuery') {
          logoUrl = '/bigquery.png';
        } else if (record.fields['Database Server'] === 'SnowFlake') {
          logoUrl = '/Snowflake.png';
        } else {
          logoUrl = '/default_database.png';
        }

        return {
          id: record.id,
          databaseName: record.fields['Database'] || 'Unnamed Database',
          description: record.fields['Description'] || '',
          status: record.fields['State'] || 'Unknown',
          statusColor: record.fields['State'] === 'Active' ? 'green.400' : 'yellow.400',
          dateCreated: new Date(record.fields['CreatedAt']),
          dateModified: new Date(record.fields['UpdatedAt']),
          logoUrl,
          fields: record.fields,
        };
      });

      const sortedRecords = records.sort((a, b) => b.dateModified - a.dateModified);
      setTableData(sortedRecords);
    } catch (error) {
      console.error('Error fetching data from Airtable:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddDatabaseClick = () => {
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
  };

  // Update this function to call fetchData after saving
  const handleSaveDatabase = useCallback(
    (newDatabase) => {
      fetchData(); // Refresh the data after saving
      setShowForm(false);
      setCurrentPage(1);
    },
    [fetchData]
  );

  const handleRowClick = (row) => {
    navigate('/DatabasePage', { state: { databaseInfo: row } });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredData = tableData.filter((row) =>
    row.databaseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Box boxShadow="lg" borderRadius="lg" p={4}>
      {showForm ? (
        <ConnectForm onBack={handleBack} onSaveDatabase={handleSaveDatabase} />
      ) : (
        <>
          <Flex justifyContent="right" mb={4}>
            <InputGroup width="400px" mr={3}>
              <InputLeftElement pointerEvents="none" color="gray.400">
                <FaSearch />
              </InputLeftElement>
              <Input
                placeholder="Search Database"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={handleAddDatabaseClick}>
              Add Database
            </Button>
          </Flex>
          {loading ? (
            <Spinner size="xl" />
          ) : (
            <>
              <TableContainer>
                <Table variant="simple" size="md">
                  <Thead bg="gray.100">
                    <Tr>
                      <Th fontSize="md">Database Name</Th>
                      <Th fontSize="md">Status</Th>
                      <Th fontSize="md">Date Created</Th>
                      <Th fontSize="md">Date Modified</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedData.map((row, index) => (
                      <Tr
                        key={index}
                        _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                        transition="all 0.2s"
                        onClick={() => handleRowClick(row)}
                      >
                        <Td fontWeight="medium">
                          <LinkBox>
                            <LinkOverlay>
                              <HStack spacing={3}>
                                <Image src={row.logoUrl} alt={row.databaseName} boxSize="24px" />
                                <Text>{row.databaseName}</Text>
                              </HStack>
                            </LinkOverlay>
                          </LinkBox>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Box
                              as="span"
                              h="10px"
                              w="10px"
                              borderRadius="full"
                              bg={row.statusColor}
                            />
                            <Text>{row.status}</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <Text fontSize="sm" color="gray.600">
                            {row.dateCreated.toLocaleString()}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontSize="sm" color="gray.600">
                            {row.dateModified.toLocaleString()}
                          </Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Flex justifyContent="center" alignItems="center" mt={6}>
                <ButtonGroup variant="outline" spacing={2}>
                  <IconButton
                    icon={<FaChevronLeft />}
                    onClick={() => handlePageChange(currentPage - 1)}
                    isDisabled={currentPage === 1}
                    aria-label="Previous Page"
                  />
                  {[...Array(totalPages).keys()].map((page) => (
                    <Button
                      key={page + 1}
                      onClick={() => handlePageChange(page + 1)}
                      variant={currentPage === page + 1 ? 'solid' : 'outline'}
                      colorScheme={currentPage === page + 1 ? 'blue' : 'gray'}
                    >
                      {page + 1}
                    </Button>
                  ))}
                  <IconButton
                    icon={<FaChevronRight />}
                    onClick={() => handlePageChange(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                    aria-label="Next Page"
                  />
                </ButtonGroup>
              </Flex>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default TableComponent;
