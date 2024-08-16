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
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Box,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';

const DrawerComponent = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [logs, setLogs] = useState([
    {
      name: 'Lorem ipsum',
      rule: 'LowRiskyUser',
      timestamp: '28/07/2024 5:33 PM',
      action: 'validation requested by user',
    },
    {
      name: 'Lorem ipsum',
      rule: 'LowRiskyUser',
      timestamp: '25/12/2024 1:13 PM',
      action: 'rejected by admin',
    },
    {
      name: 'Lorem ipsum',
      rule: 'LowRiskyUser',
      timestamp: '04/06/2024 6:56 AM',
      action: 'verified by admin',
    },
    {
      name: 'Lorem ipsum',
      rule: 'LowRiskyUser',
      timestamp: '13/03/2024 5:57 AM',
      action: 'pushed to knowledge by admin',
    },
    // Add more rows as needed
  ]);

  // Filter logs based on search query
  const filteredLogs = logs.filter(log =>
    log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.rule.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.timestamp.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
 <>
    
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody>
          <Tabs>
            <TabList>
              <Tab>Logs</Tab>
              <Tab>Chat History</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                {/* Search and Filter Section */}
                <Flex justify="space-between" mb={4}>
                  <Input
                    placeholder="Search"
                    width="40%"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
                  />
                  <Flex gap={2}>
                    <Button variant="outline">7d</Button>
                    <Button variant="outline">30d</Button>
                    <Button variant="outline">60d</Button>
                    <Button variant="outline">90d</Button>
                    <Button variant="outline">
                      <RepeatIcon />
                    </Button>
                  </Flex>
                </Flex>

                {/* Logs Table */}
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Business Rule</Th>
                      <Th>Time stamps</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredLogs.map((log, index) => (
                      <Tr key={index}>
                        <Td color="blue.500" cursor="pointer">{log.name}</Td>
                        <Td>{log.rule}</Td>
                        <Td>{log.timestamp}</Td>
                        <Td>{log.action}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TabPanel>
              <TabPanel>
                <p>Chat History content here!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </DrawerBody>
      </DrawerContent>
      </>
  );
};

export default DrawerComponent;
