import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';

const SchemaLogs = () => {
  // Dummy data in JSON format
  const logsData = [
    {
      schemaName: 'Test_User_List',
      tableName: 'Users',
      propertyName: 'user_id',
      action: 'Added',
      logTime: '2024-08-22 10:15:00',
    },
    {
      schemaName: 'User_Event_Track',
      tableName: 'Events',
      propertyName: 'event_name',
      action: 'Modified',
      logTime: '2024-08-22 11:20:00',
    },
    {
      schemaName: 'HyperionDB',
      tableName: 'Records',
      propertyName: 'created_at',
      action: 'Deleted',
      logTime: '2024-08-22 12:30:00',
    },
    {
      schemaName: 'Test_User_List',
      tableName: 'Users',
      propertyName: 'email',
      action: 'Modified',
      logTime: '2024-08-22 13:45:00',
    },
    {
      schemaName: 'User_Event_Track',
      tableName: 'Events',
      propertyName: 'event_id',
      action: 'Added',
      logTime: '2024-08-22 14:00:00',
    },
    {
      schemaName: 'HyperionDB',
      tableName: 'Records',
      propertyName: 'status',
      action: 'Modified',
      logTime: '2024-08-22 15:10:00',
    },
    {
      schemaName: 'Test_User_List',
      tableName: 'Users',
      propertyName: 'phone_number',
      action: 'Added',
      logTime: '2024-08-22 16:20:00',
    },
    {
      schemaName: 'User_Event_Track',
      tableName: 'Events',
      propertyName: 'event_type',
      action: 'Deleted',
      logTime: '2024-08-22 17:30:00',
    },
    {
      schemaName: 'HyperionDB',
      tableName: 'Records',
      propertyName: 'updated_at',
      action: 'Modified',
      logTime: '2024-08-22 18:40:00',
    },
    {
      schemaName: 'Test_User_List',
      tableName: 'Users',
      propertyName: 'address',
      action: 'Added',
      logTime: '2024-08-22 19:50:00',
    },
    {
      schemaName: 'User_Event_Track',
      tableName: 'Events',
      propertyName: 'location',
      action: 'Modified',
      logTime: '2024-08-22 20:15:00',
    },
    {
      schemaName: 'HyperionDB',
      tableName: 'Records',
      propertyName: 'event_id',
      action: 'Deleted',
      logTime: '2024-08-22 21:25:00',
    },
    {
      schemaName: 'Test_User_List',
      tableName: 'Users',
      propertyName: 'age',
      action: 'Modified',
      logTime: '2024-08-22 22:35:00',
    },
    {
      schemaName: 'User_Event_Track',
      tableName: 'Events',
      propertyName: 'user_id',
      action: 'Added',
      logTime: '2024-08-22 23:45:00',
    },
    {
      schemaName: 'HyperionDB',
      tableName: 'Records',
      propertyName: 'status',
      action: 'Modified',
      logTime: '2024-08-23 00:55:00',
    },
    {
      schemaName: 'Test_User_List',
      tableName: 'Users',
      propertyName: 'email',
      action: 'Deleted',
      logTime: '2024-08-23 01:15:00',
    },
    {
      schemaName: 'User_Event_Track',
      tableName: 'Events',
      propertyName: 'timestamp',
      action: 'Added',
      logTime: '2024-08-23 02:25:00',
    },
    {
      schemaName: 'HyperionDB',
      tableName: 'Records',
      propertyName: 'created_at',
      action: 'Modified',
      logTime: '2024-08-23 03:35:00',
    },
    {
      schemaName: 'Test_User_List',
      tableName: 'Users',
      propertyName: 'username',
      action: 'Added',
      logTime: '2024-08-23 04:45:00',
    },
    {
      schemaName: 'User_Event_Track',
      tableName: 'Events',
      propertyName: 'event_name',
      action: 'Deleted',
      logTime: '2024-08-23 05:55:00',
    },
    {
      schemaName: 'HyperionDB',
      tableName: 'Records',
      propertyName: 'status',
      action: 'Added',
      logTime: '2024-08-23 06:05:00',
    },
    {
      schemaName: 'Test_User_List',
      tableName: 'Users',
      propertyName: 'user_id',
      action: 'Modified',
      logTime: '2024-08-23 07:15:00',
    },
    {
      schemaName: 'User_Event_Track',
      tableName: 'Events',
      propertyName: 'event_type',
      action: 'Modified',
      logTime: '2024-08-23 08:25:00',
    },
    {
      schemaName: 'HyperionDB',
      tableName: 'Records',
      propertyName: 'status',
      action: 'Deleted',
      logTime: '2024-08-23 09:35:00',
    },
  ];

  return (
    <Box maxWidth="90%" mx="auto" mt={8}>
      <TableContainer boxShadow="lg" borderRadius="lg" maxHeight="550px" overflowY="auto">
        <Table variant="simple" size="md">
          <Thead bg="gray.100" position="sticky" top={0} zIndex={1}>
            <Tr>
              <Th>Schema Name</Th>
              <Th>Table Name</Th>
              <Th>Property Name</Th>
              <Th>Action</Th>
              <Th>Log Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {logsData.map((log, index) => (
              <Tr key={index}>
                <Td>{log.schemaName}</Td>
                <Td>{log.tableName}</Td>
                <Td>{log.propertyName}</Td>
                <Td>{log.action}</Td>
                <Td>{log.logTime}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SchemaLogs;
