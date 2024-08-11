import React from 'react';
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
  Button,
  Flex,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const TableComponent = () => {
  const tableData = [
    {
      databaseName: 'NebulaStore',
      status: 'Active',
      statusColor: 'green.400',
      dateCreated: '28/07/2024 5:33 PM',
      dateModified: '29/07/2024 2:07 PM',
    },
    {
      databaseName: 'GalaxyDB',
      status: 'Schema Imported',
      statusColor: 'yellow.400',
      dateCreated: '28/07/2024 5:33 PM',
      dateModified: '29/07/2024 2:07 PM',
    },
    {
      databaseName: 'CosmosData',
      status: 'Inactive',
      statusColor: 'red.400',
      dateCreated: '28/07/2024 5:33 PM',
      dateModified: '29/07/2024 2:07 PM',
    },
  ];

  return (
    <Box maxWidth="90%" mx="auto" boxShadow="lg" borderRadius="lg" overflow="hidden" my={8}>
      <Flex justifyContent="flex-end" alignItems="center" p={4} bg="gray.50">
        <Button leftIcon={<AddIcon />} colorScheme="blue" size="sm">
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
            {tableData.map((row, index) => (
              <Tr key={index} _hover={{ bg: 'gray.50' }} transition="all 0.2s">
                <Td fontWeight="medium">{row.databaseName}</Td>
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
