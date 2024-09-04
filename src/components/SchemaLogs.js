import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useBreakpointValue,
} from '@chakra-ui/react';

const SchemaLogs = () => {
  const [logsData, setLogsData] = useState([]);

  const fetchLogsData = async () => {
    try {
      const response = await axios.get('https://api.airtable.com/v0/app4ZQ9jav2XzNIv9/BQNewSchemaColumn', {
        headers: {
          Authorization: `Bearer pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89`,
        },
      });

      const records = response.data.records.map(record => ({
        organisationId: record.fields['Organisation ID'] || 'No Organisation ID',
        databaseServer: record.fields['Database Server'] || 'No Database Server',
        projectId: record.fields['Project ID'] || 'No Project ID',
        schemaName: record.fields['Schema Name'] || 'No Schema Name',
        tableName: record.fields['Table Name'] || 'No Table Name',
        columnName: record.fields['Column Name'] || 'No Column Name',
        status: record.fields['Status'] || 'No Status',
        description: record.fields['Description'] || 'No Description',
        createdAt: record.fields['CreatedAt'] || 'No CreatedAt',
        updatedAt: record.fields['UpdatedAt'] || 'No UpdatedAt',
      }));

      setLogsData(records);
    } catch (error) {
      console.error('Error fetching logs data from Airtable:', error);
    }
  };

  useEffect(() => {
    fetchLogsData();
  }, []);


  return (
    <Box maxWidth="90%" mx="auto" mt={8}>
      <TableContainer boxShadow="lg" borderRadius="lg" maxHeight="550px" overflowY="auto">
        <Table variant="simple" size="sm">
          <Thead bg="gray.100" position="sticky" top={0} zIndex={1}>
            <Tr>
              <Th>Schema Name</Th>
              <Th>Table Name</Th>
              <Th>Property Name</Th>
              <Th>Updated At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {logsData.map((log, index) => (
              <Tr key={index}>
                <Td isTruncated>{log.schemaName}</Td>
                <Td isTruncated>{log.tableName}</Td>
                <Td isTruncated>{log.columnName}</Td>
                <Td isTruncated>{log.updatedAt}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SchemaLogs;
