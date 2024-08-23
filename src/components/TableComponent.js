import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import ConnectForm from './ConnectForm'; // Import the ConnectForm component

const TableComponent = () => {
  const [showForm, setShowForm] = useState(false); // State to toggle between table and form
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  const tableData = [
    {
      id: 1,
      databaseName: 'NebulaStore',
      description: 'Main database for store records',
      status: 'Active',
      statusColor: 'green.400',
      dateCreated: '28/07/2024 5:33 PM',
      dateModified: '28/07/2024 5:33 PM',
    },
    {
      id: 2,
      databaseName: 'GalaxyDB',
      description: 'Holds galaxy exploration data',
      status: 'Schema Imported',
      statusColor: 'yellow.400',
      dateCreated: '28/07/2024 5:33 PM',
      dateModified: '28/07/2024 5:33 PM',
    },
    {
      id: 3,
      databaseName: 'CosmosData',
      description: '',
      status: 'Schema Imported',
      statusColor: 'yellow.400',
      dateCreated: '28/07/2024 5:33 PM',
      dateModified: '28/07/2024 5:33 PM',
    },
  ];

  const handleAddDatabaseClick = () => {
    setShowForm(true); // Show the form when the button is clicked
  };

  const handleBack = () => {
    setShowForm(false); // Hide the form and show the table again
  };

  const filteredData = tableData.filter((row) =>
    row.databaseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showForm) {
    return <ConnectForm onBack={handleBack} />;
  }

  return (
    <Box boxShadow="lg" borderRadius="lg" p={4}>
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
            {filteredData.map((row, index) => (
              <Tr
                key={index}
                _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                transition="all 0.2s"
              >
                <Td fontWeight="medium">
                  <LinkBox>
                    <LinkOverlay href="/DatabasePage">{row.databaseName}</LinkOverlay>
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
                    {row.dateCreated}
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="sm" color="gray.600">
                    {row.dateModified}
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

export default TableComponent;
