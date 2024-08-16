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
  LinkBox,
  LinkOverlay,
  IconButton,
  Button,
} from '@chakra-ui/react';
import { RepeatIcon, DeleteIcon } from '@chakra-ui/icons';

const TableComponent = () => {
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

  return (
    <TableContainer boxShadow="lg" borderRadius="lg">
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
  );
};

export default TableComponent;
