import React, { useState } from 'react';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  HStack,
  IconButton,
  Textarea,
  Flex,
  Tooltip,
  Image
} from '@chakra-ui/react';
import { ChevronRightIcon, RepeatIcon, DeleteIcon } from '@chakra-ui/icons';
import TopNav from './TopNav';
import SideNav from './SideNav';
import { useAuth } from '../auth'; // Adjust path if necessary

const AnotherPage = () => {
  const { isSignedIn } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDescription, setCurrentDescription] = useState('');
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedPropertyIndex, setSelectedPropertyIndex] = useState(null);

  const [tableData, setTableData] = useState([
    {
      databaseName: 'Test_User_List',
      description: '',
      properties: [
        { name: 'id', type: 'int', nullable: false, description: '' },
        { name: 'username', type: 'varchar(50)', nullable: false, description: '' },
        { name: 'email', type: 'varchar(100)', nullable: true, description: '' },
      ]
    },
    {
      databaseName: 'User_Event_Track',
      description: '',
      properties: [
        { name: 'event_id', type: 'int', nullable: false, description: '' },
        { name: 'user_id', type: 'int', nullable: false, description: '' },
        { name: 'event_type', type: 'varchar(50)', nullable: false, description: '' },
        { name: 'timestamp', type: 'datetime', nullable: false, description: '' },
      ]
    },
    {
      databaseName: 'HyperionDB',
      description: '',
      properties: [
        { name: 'hyperion_id', type: 'uuid', nullable: false, description: '' },
        { name: 'data', type: 'jsonb', nullable: true, description: '' },
        { name: 'created_at', type: 'timestamp', nullable: false, description: '' },
      ]
    },
  ]);

  const [selectedTable, setSelectedTable] = useState(null);

  const openModal = (index, isProperty = false) => {
    setSelectedRowIndex(index);
    if (isProperty && selectedTable !== null) {
      setSelectedPropertyIndex(index);
      setCurrentDescription(tableData[selectedTable].properties[index].description);
    } else {
      setCurrentDescription(tableData[index].description);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRowIndex(null);
    setCurrentDescription('');
    setSelectedPropertyIndex(null);
  };

  const saveDescription = () => {
    if (selectedPropertyIndex !== null) {
      const updatedTableData = tableData.map((row, tableIndex) =>
        tableIndex === selectedTable
          ? {
              ...row,
              properties: row.properties.map((prop, propIndex) =>
                propIndex === selectedPropertyIndex ? { ...prop, description: currentDescription } : prop
              )
            }
          : row
      );
      setTableData(updatedTableData);
    } else if (selectedRowIndex !== null) {
      const updatedTableData = tableData.map((row, index) =>
        index === selectedRowIndex ? { ...row, description: currentDescription } : row
      );
      setTableData(updatedTableData);
    }
    closeModal();
  };

  const handleRefresh = (index, isProperty = false) => {
    console.log(`Refreshing ${isProperty ? 'property' : 'row'} ${index}`);
  };

  const handleDelete = (index, isProperty = false) => {
    console.log(`Deleting ${isProperty ? 'property' : 'row'} ${index}`);
    if (isProperty && selectedTable !== null) {
      const updatedTableData = tableData.map((row, tableIndex) =>
        tableIndex === selectedTable
          ? { ...row, properties: row.properties.filter((_, propIndex) => propIndex !== index) }
          : row
      );
      setTableData(updatedTableData);
    } else {
      setTableData(tableData.filter((_, i) => i !== index));
      if (selectedTable === index) {
        setSelectedTable(null);
      }
    }
  };

  const handleTableSelect = (index) => {
    setSelectedTable(index);
  };

  const generateAIDescription = () => {
    // This is a mock AI description generator
    // In a real application, this would call an AI service
    const aiDescriptions = [
      "This table stores user information including unique identifiers, usernames, and email addresses.",
      "This table tracks user events with details such as event type and timestamp.",
      "A high-performance database for storing complex JSON data with UUID identifiers.",
      "This property is a unique identifier for each record in the table.",
      "Stores the username of the user, used for authentication and display purposes.",
      "The user's email address, used for communication and notifications.",
      "A unique identifier for each event recorded in the system.",
      "References the user associated with this event.",
      "Categorizes the type of event that occurred.",
      "Records the exact time when the event took place.",
      "A universally unique identifier for each record in the Hyperion database.",
      "Stores complex, semi-structured data in JSON format.",
      "Timestamp indicating when the record was created in the database."
    ];
    
    const randomDescription = aiDescriptions[Math.floor(Math.random() * aiDescriptions.length)];
    setCurrentDescription(randomDescription);
  };

  return (
    <div className="Dashboard flex flex-col h-screen">
      <TopNav />
      <div className="flex flex-grow overflow-hidden">
        <SideNav />
        <main className="flex-grow p-4" style={{ paddingTop: '64px' }}>
          <Box maxWidth="90%" mx="auto" pt={12}>
            <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />} mb={4}>
              <BreadcrumbItem>
                <BreadcrumbLink href="/another-page">Connection</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#">NebulaStore</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#">SchemaName</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            <Text fontSize="md" color="gray.600" mb={6} align={'left'}>
              This is the schema for the database. Adding a detailed description will help the AI provide more accurate responses, and we can assist in generating this description.
            </Text>

            <Flex>
              <TableContainer boxShadow="lg" borderRadius="lg" flex="1" mr={4}>
                <Table variant="simple" size="md">
                  <Thead bg="gray.100">
                    <Tr>
                      <Th fontSize="md">Tables</Th>
                      <Th fontSize="md">Description</Th>
                      <Th fontSize="md"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tableData.map((row, index) => (
                      <Tr
                        key={index}
                        _hover={{ bg: 'gray.50', '.action-icons': { opacity: 1 } }}
                        transition="all 0.2s"
                        onClick={() => handleTableSelect(index)}
                        bg={selectedTable === index ? 'blue.100' : 'inherit'}
                        cursor="pointer"
                      >
                        <Td fontWeight="medium">{row.databaseName}</Td>
                        <Td>
                          <Button 
                            size="sm" 
                            variant="link"
                            color={'gray.600'}
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(index);
                            }}
                            _hover={{ bg: 'transparent' }}
                            _focus={{ boxShadow: 'none' }}
                          >
                            {row.description || '+ Add Description'}
                          </Button>
                        </Td>
                        <Td textAlign="right">
                          <HStack 
                            spacing={2}
                            justify="flex-end"
                            className="action-icons"
                            opacity={0}
                            transition="opacity 0.2s"
                          >
                            <IconButton 
                              size="sm"
                              icon={<RepeatIcon />} 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRefresh(index);
                              }} 
                              aria-label="Refresh"
                            />
                            <IconButton 
                              size="sm"
                              icon={<DeleteIcon />} 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(index);
                              }} 
                              aria-label="Delete"
                              color='red.500'
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              <TableContainer boxShadow="lg" borderRadius="lg" flex="1">
                <Table variant="simple" size="md">
                  <Thead bg="gray.100">
                    <Tr>
                      <Th fontSize="md">Properties</Th>
                      <Th fontSize="md">Description</Th>
                      <Th fontSize="md"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {selectedTable !== null && tableData[selectedTable].properties.map((prop, index) => (
                      <Tr
                        key={index}
                        _hover={{ bg: 'gray.50', '.action-icons': { opacity: 1 } }}
                        transition="all 0.2s"
                      >
                        <Td fontWeight="medium">{prop.name}</Td>
                        <Td>
                          <Button 
                            size="sm" 
                            variant="link"
                            color={'gray.600'}
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(index, true);
                            }}
                            _hover={{ bg: 'transparent' }}
                            _focus={{ boxShadow: 'none' }}
                          >
                            {prop.description || '+ Add Description'}
                          </Button>
                        </Td>
                        <Td textAlign="right">
                          <HStack 
                            spacing={2}
                            justify="flex-end"
                            className="action-icons"
                            opacity={0}
                            transition="opacity 0.2s"
                          >
                            <IconButton 
                              size="sm"
                              icon={<RepeatIcon />} 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRefresh(index, true);
                              }} 
                              aria-label="Refresh"
                            />
                            <IconButton 
                              size="sm"
                              icon={<DeleteIcon />} 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(index, true);
                              }} 
                              aria-label="Delete"
                              color='red.500'
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Flex>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Update Description</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Textarea 
                    value={currentDescription}
                    onChange={(e) => setCurrentDescription(e.target.value)}
                    placeholder="Enter description"
                  />
                </ModalBody>

                <ModalFooter>
                  <HStack spacing={4} w="full" justify="space-between">
                    <Tooltip label="Generate description using AI" aria-label='A tooltip' hasArrow placement='bottom-start'>
                      <Button 
                        onClick={generateAIDescription}
                        leftIcon={<Image src="/ai-logo.png" boxSize="30px" alt="AI Icon" />}
                        bg="transparent"
                        _hover={{ bg: "transparent" }}
                        _active={{ bg: "transparent" }}
                      >
                      </Button>
                    </Tooltip>
                    <div>
                      <Button variant="ghost" onClick={closeModal} mr={5}>
                        Cancel
                      </Button>
                      <Button 
                        bg="black"
                        color="white"
                        _hover={{ bg: "gray.800" }}
                        onClick={saveDescription}
                      >
                        Save
                      </Button>
                    </div>
                  </HStack>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </main>
      </div>
    </div>
  );
};

export default AnotherPage;