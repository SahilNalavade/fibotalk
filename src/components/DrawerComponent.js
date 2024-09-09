import React, { useState } from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  VStack,
} from '@chakra-ui/react';

const DrawerComponent = ({ isOpen, onClose, logs = [], chatHistory = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logs based on search query
  const filteredLogs = logs.filter((log) =>
    log.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.rule?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.timestamp?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter chat history based on search query
  const filteredChatHistory = chatHistory.filter(
    (chat) =>
      chat.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.timestamp?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent maxWidth="800px">
        <DrawerCloseButton />
        <DrawerBody>
          <Tabs>
            <TabList>
              <Tab>Activity Logs</Tab>
              <Tab>Chat History</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex justify="space-between" mb={4}>
                  <Input
                    placeholder="Search logs"
                    width="40%"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Flex>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Rule</Th>
                      <Th>Timestamp</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredLogs.map((log, index) => (
                      <Tr key={index}>
                        <Td color="blue.500" cursor="pointer">
                          {log.name}
                        </Td>
                        <Td>{log.rule}</Td>
                        <Td>{log.timestamp}</Td>
                        <Td>{log.action}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TabPanel>
              <TabPanel>
                <Flex justify="space-between" mb={4}>
                  <Input
                    placeholder="Search chat history"
                    width="40%"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Flex>
                <VStack align="start" spacing={4}>
                  {filteredChatHistory.length > 0 ? (
                    filteredChatHistory.map((chat, index) => (
                      <Box key={index} p={3} borderWidth="1px" borderRadius="md" width="100%">
                        <Flex justifyContent="space-between" mb={1}>
                          <Text fontWeight="bold">{chat.user}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {chat.timestamp}
                          </Text>
                        </Flex>
                        <Text>{chat.message}</Text>
                      </Box>
                    ))
                  ) : (
                    <Text>No chat history available.</Text>
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

// Sample data passed to the component
const exampleLogs = [
  {
    name: 'John Doe',
    rule: 'LowRiskyUser',
    timestamp: '2024-09-10 10:05 AM',
    action: 'Validation requested by user',
  },
  {
    name: 'Jane Smith',
    rule: 'HighRiskyUser',
    timestamp: '2024-09-10 11:00 AM',
    action: 'Rejected by admin due to policy violation',
  },
  {
    name: 'System',
    rule: 'AutoReview',
    timestamp: '2024-09-11 01:15 PM',
    action: 'Automatically verified based on set rules',
  },
  {
    name: 'Admin User',
    rule: 'ManualReview',
    timestamp: '2024-09-12 03:30 PM',
    action: 'Pushed to knowledge base by admin',
  },
];

const exampleChatHistory = [
  {
    user: 'John Doe',
    message: 'Can you please review my latest submission?',
    timestamp: '2024-09-10 10:15 AM',
  },
  {
    user: 'Admin',
    message: 'Your submission has been reviewed. Please check the details.',
    timestamp: '2024-09-10 10:20 AM',
  },
  {
    user: 'Jane Smith',
    message: 'I have some questions about the policy changes.',
    timestamp: '2024-09-11 11:30 AM',
  },
  {
    user: 'System',
    message: 'The chat session has ended.',
    timestamp: '2024-09-11 12:00 PM',
  },
];

export default DrawerComponent;
