import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  useColorModeValue,
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
  Input,
  HStack,
  IconButton,
  Image,
  Tooltip,
  Textarea,
} from '@chakra-ui/react';
import { ChevronRightIcon, RepeatIcon, DeleteIcon } from '@chakra-ui/icons';
import TopNav from './TopNav';
import SideNav from './SideNav';
import { useAuth } from '../auth'; // Adjust path if necessary

const AnotherPage = () => {
  const { isSignedIn } = useAuth(); // Check if the user is signed in
  const tabBg = useColorModeValue('gray.100', 'gray.700');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDescription, setCurrentDescription] = useState('');
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  
  // Table data as a state variable
  const [tableData, setTableData] = useState([
    {
      databaseName: 'Test_User_List',
      description: '',
      dateCreated: '01/01/2022',
    },
    {
      databaseName: 'User_Event_Track',
      description: '',
      dateCreated: '05/03/2022',
    },
    {
      databaseName: 'HyperionDB',
      description: '',
      dateCreated: '12/06/2022',
    },
  ]);

  // Function to handle opening the modal
  const openModal = (index) => {
    setSelectedRowIndex(index);
    setCurrentDescription(tableData[index].description);
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRowIndex(null);
    setCurrentDescription('');
  };

  // Function to handle saving the description
  const saveDescription = () => {
    if (selectedRowIndex !== null) {
      const updatedTableData = tableData.map((row, index) =>
        index === selectedRowIndex ? { ...row, description: currentDescription } : row
      );
      setTableData(updatedTableData);
    }
    closeModal();
  };

  // Function to generate AI description (mock implementation)
  const generateAIDescription = () => {
    // Replace with actual AI call
    const aiDescription = "This is an AI-generated description.";
    setCurrentDescription(aiDescription);
  };

  // Function to handle refresh (mock implementation)
  const handleRefresh = (index) => {
    console.log(`Refreshing row ${index}`);
    // Add logic to refresh the row data
  };

  // Function to handle delete (mock implementation)
  const handleDelete = (index) => {
    console.log(`Deleting row ${index}`);
    // Add logic to delete the row
    setTableData(tableData.filter((_, i) => i !== index));
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
                <BreadcrumbLink href="/another-page">Databases</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#">NebulaStore</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

      

            <Tabs pt={12}>
              <TabList mb="1em">
                <Tab>Schema</Tab>
                <Tab>Settings</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                <Text fontSize="md" color="gray.600" mb={6} align={'left'}>
            This is the schema for the database. Adding a detailed description will help the AI provide more accurate responses, and we can assist in generating this description.
            </Text>
                  <TableContainer boxShadow="lg" borderRadius="lg">
                    <Table variant="simple" size="md">
                      <Thead bg="gray.100">
                        <Tr>
                          <Th fontSize="md">Database Name</Th>
                          <Th fontSize="md">Description</Th>
                          <Th fontSize="md">Date Created</Th>
                          <Th fontSize="md" ></Th> {/* New column for actions */}
                        </Tr>
                      </Thead>
                      <Tbody>
  {tableData.map((row, index) => (
    <Tr
      key={index}
      _hover={{ bg: 'gray.50', '.action-icons': { opacity: 1 } }} // Only show icons on row hover
      transition="all 0.2s"
    >
      <Td fontWeight="medium">{row.databaseName}</Td>
      <Td>
        <Button 
          size="sm" 
          variant="link"
          color={'gray.600'}
          onClick={() => openModal(index)}
          _hover={{ bg: 'transparent' }}
          _focus={{ boxShadow: 'none' }}
        >
          {row.description || '+ Add Description'}
        </Button>
      </Td>
      <Td>
        <Text fontSize="sm" color="gray.600">
          {row.dateCreated}
        </Text>
      </Td>
      <Td textAlign="right">
        <HStack 
          spacing={2}
          justify="flex-end"
          className="action-icons" // Class to identify this HStack
          opacity={0} // Hidden by default
          transition="opacity 0.2s"
        >
          <IconButton 
            size="sm"
            icon={<RepeatIcon />} 
            onClick={() => handleRefresh(index)} 
            aria-label="Refresh"
          />
          <IconButton 
            size="sm"
            icon={<DeleteIcon />} 
            onClick={() => handleDelete(index)} 
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
                </TabPanel>
                <TabPanel>
                  <Text>Settings content goes here.</Text>
                </TabPanel>
              </TabPanels>
            </Tabs>

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
                        leftIcon={<Image src="/ai-logo.png" boxSize="30px" alt="AI Icon" />} // Replace with your image path
                        bg="transparent"  // Set the background to transparent
                        _hover={{ bg: "transparent" }}  // Ensure background remains transparent on hover
                        _active={{ bg: "transparent" }}  // Ensure background remains transparent when active
                        >
                        {/* Optionally, add text or leave it empty */}
                    </Button>
                    </Tooltip>
                    <div>
                    <Button variant="ghost" onClick={closeModal} mr={5}>
                      Cancel
                    </Button>
                    <Button 
                      bg="black"        // Set the background color to black
                      color="white"     // Set the text color to white for contrast
                      _hover={{ bg: "gray.800" }}  // Optionally, darken the button on hover
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
