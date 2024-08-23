import React, { useState, useRef } from 'react';
import {
  Box,
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
  HStack,
  IconButton,
  Image,
  Tooltip,
  Textarea,
  LinkBox,
  LinkOverlay,
  Input,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { ChevronRightIcon, RepeatIcon, DeleteIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons';
import { FaSortAlphaDown, FaSortAlphaUpAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import TopNav from './TopNav';
import SideNav from './SideNav';
import { useAuth } from '../auth';
import SchemaPage from './SchemaPage';
import EditForm from './EditForm';

const AnotherPage = () => {
  const { isSignedIn } = useAuth(); // Check if the user is signed in
  const tabBg = useColorModeValue('gray.100', 'gray.700');
  const navigate = useNavigate(); // Use the useNavigate hook for navigation

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDescription, setCurrentDescription] = useState('');
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  // State to control which component to display in the Schema tab
  const [showSchemaPage, setShowSchemaPage] = useState(false);

  // State to track the current tab for breadcrumb updates
  const [currentTab, setCurrentTab] = useState('Schema');

  // State to track whether the "Table" breadcrumb item should be displayed
  const [showTableBreadcrumb, setShowTableBreadcrumb] = useState(false);

  // Table data as a state variable
  const [tableData, setTableData] = useState([
    {
      databaseName: 'Test_User_List',
      description: '',
      dateCreated: '01/01/2022',
      status: 'active', // Status field
    },
    {
      databaseName: 'User_Event_Track',
      description: '',
      dateCreated: '05/03/2022',
      status: 'active', // Status field
    },
    {
      databaseName: 'HyperionDB',
      description: '',
      dateCreated: '12/06/2022',
      status: 'active', // Status field
    },
  ]);

  // State to manage the dropdown search functionality
  const [searchText, setSearchText] = useState('');
  const [selectedSources, setSelectedSources] = useState([]);
  const [sortOrder, setSortOrder] = useState(null); // State to track sorting order
  const [descriptionSearchText, setDescriptionSearchText] = useState('');
  const [descriptionSortOrder, setDescriptionSortOrder] = useState(null);

  const inputRef = useRef(); // Use ref to manage focus manually

  // New state to track hovered row index
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

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

  // Function to handle delete/change status
  const handleDelete = (index) => {
    console.log(`Changing status of row ${index}`);
    const updatedTableData = tableData.map((row, i) =>
      i === index ? { ...row, status: row.status === 'active' ? 'inactive' : 'active' } : row
    );
    setTableData(updatedTableData);
  };

  const breadcrumbColor = useColorModeValue('gray.600', 'gray.300');

  // Function to update the current breadcrumb based on the selected tab
  const getCurrentBreadcrumb = () => {
    switch (currentTab) {
      case 'Schema':
        return 'Schema';
      case 'Settings':
        return 'Settings';
      default:
        return '';
    }
  };

  // Function to handle search and filter the table data
  const filteredTableData = tableData.filter(
    (row) =>
      row.databaseName.toLowerCase().includes(searchText.toLowerCase()) &&
      row.description.toLowerCase().includes(descriptionSearchText.toLowerCase())
  );

  // Function to handle search input change and update searchText
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleDescriptionSearchChange = (e) => {
    setDescriptionSearchText(e.target.value);
  };

  // Function to handle checkbox changes
  const handleCheckboxChange = (databaseName, isChecked) => {
    if (isChecked) {
      setSelectedSources([...selectedSources, databaseName]);
    } else {
      setSelectedSources(selectedSources.filter((name) => name !== databaseName));
    }
  };

  // Function to handle sorting of the table data by database name
  const toggleSortOrder = () => {
    let sortedData;
    if (sortOrder === 'asc') {
      sortedData = [...filteredTableData].sort((a, b) =>
        a.databaseName.toLowerCase() > b.databaseName.toLowerCase() ? -1 : 1
      );
      setSortOrder('desc');
    } else {
      sortedData = [...filteredTableData].sort((a, b) =>
        a.databaseName.toLowerCase() < b.databaseName.toLowerCase() ? -1 : 1
      );
      setSortOrder('asc');
    }
    setTableData(sortedData);
  };

  // Function to handle sorting of the table data by description
  const toggleDescriptionSortOrder = () => {
    let sortedData;
    if (descriptionSortOrder === 'asc') {
      sortedData = [...filteredTableData].sort((a, b) =>
        a.description.toLowerCase() > b.description.toLowerCase() ? -1 : 1
      );
      setDescriptionSortOrder('desc');
    } else {
      sortedData = [...filteredTableData].sort((a, b) =>
        a.description.toLowerCase() < b.description.toLowerCase() ? -1 : 1
      );
      setDescriptionSortOrder('asc');
    }
    setTableData(sortedData);
  };

  // Function to handle row click and navigate to the /schema-page
  const handleRowClick = () => {
    navigate('/DatabasePagec'); // Redirect to /schema-page
  };

  return (
    <div className="Dashboard flex flex-col h-screen">
      <TopNav />
      <div className="flex flex-grow overflow-hidden">
        <SideNav />
        <main className="flex-grow p-4" style={{ paddingTop: '105px' }}>
          <Box maxWidth="90%" mx="auto">
            <Box mt={4}>
              <Breadcrumb
                spacing="8px"
                separator={<ChevronRightIcon color={breadcrumbColor} boxSize="18px" />}
                fontSize="lg"
                color={breadcrumbColor}
              >
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" fontSize="lg">
                    Connection
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" fontSize="lg">
                    Database Configuration
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href="DatabasePage" fontSize="lg" fontWeight="semibold">
                    Schema
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {showTableBreadcrumb && (
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" fontSize="lg">
                      Table
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )}
              </Breadcrumb>
            </Box>

            <Tabs pt={12} onChange={(index) => setCurrentTab(index === 0 ? 'Schema' : 'Settings')}>
              <TabList mb="1em">
                <Tab>Schema</Tab>
                <Tab>Settings</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {/* Conditional rendering inside the Schema tab */}
                  {!showSchemaPage ? (
                    <>
                      <Text fontSize="md" color="gray.600" mb={6} align={'left'}>
                        This is the schema for the database. Adding a detailed description will help the AI provide more accurate responses, and we can assist in generating this description.
                      </Text>
                      <TableContainer boxShadow="lg" borderRadius="lg">
                        <Table variant="simple" size="md">
                          <Thead bg="gray.100">
                            <Tr>
                              <Th>
                                <HStack spacing={4}>
                                  <Menu closeOnSelect={false} autoSelect={false}>
                                    <MenuButton
                                      as={Button}
                                      rightIcon={<ChevronDownIcon />}
                                      variant="ghost"
                                      size="sm"
                                    >
                                      Schema Name
                                    </MenuButton>
                                    <MenuList maxH="300px" overflowY="auto">
                                      <MenuItem>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={toggleSortOrder}
                                          rightIcon={sortOrder === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUpAlt />}
                                        >
                                        </Button>
                                        <InputGroup>
                                          <InputLeftElement pointerEvents="none">
                                            <SearchIcon color="gray.400" />
                                          </InputLeftElement>
                                          <Input
                                            ref={inputRef}
                                            placeholder="Filter by name.."
                                            value={searchText}
                                            onChange={handleSearchChange}
                                            mb={2}
                                            autoFocus
                                            onClick={(e) => e.stopPropagation()}
                                            onBlur={(e) => {
                                              if (e.relatedTarget) {
                                                e.preventDefault();
                                                inputRef.current.focus();
                                              }
                                            }}
                                          />
                                        </InputGroup>
                                      </MenuItem>
                                      <MenuDivider />
                                      {filteredTableData.map((row, index) => (
                                        <MenuItem key={index}>
                                          <Checkbox
                                            isChecked={selectedSources.includes(row.databaseName)}
                                            onChange={(e) => handleCheckboxChange(row.databaseName, e.target.checked)}
                                          >
                                            {row.databaseName}
                                          </Checkbox>
                                        </MenuItem>
                                      ))}
                                    </MenuList>
                                  </Menu>
                                </HStack>
                              </Th>
                              <Th fontSize="md">
                                <HStack spacing={4}>
                                  <Menu closeOnSelect={false} autoSelect={false}>
                                    <MenuButton
                                      as={Button}
                                      rightIcon={<ChevronDownIcon />}
                                      variant="ghost"
                                      size="sm"
                                    >
                                      Description
                                    </MenuButton>
                                    <MenuList maxH="300px" overflowY="auto">
                                      <MenuItem>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={toggleDescriptionSortOrder}
                                          rightIcon={descriptionSortOrder === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUpAlt />}
                                        >
                                        </Button>
                                        <InputGroup>
                                          <InputLeftElement pointerEvents="none">
                                            <SearchIcon color="gray.400" />
                                          </InputLeftElement>
                                          <Input
                                            placeholder="Filter by description.."
                                            value={descriptionSearchText}
                                            onChange={handleDescriptionSearchChange}
                                            mb={2}
                                            autoFocus
                                            onClick={(e) => e.stopPropagation()}
                                            onBlur={(e) => {
                                              if (e.relatedTarget) {
                                                e.preventDefault();
                                                inputRef.current.focus();
                                              }
                                            }}
                                          />
                                        </InputGroup>
                                      </MenuItem>
                                      <MenuDivider />
                                      {filteredTableData.map((row, index) => (
                                        <MenuItem key={index}>
                                          <Checkbox
                                            isChecked={selectedSources.includes(row.description)}
                                            onChange={(e) => handleCheckboxChange(row.description, e.target.checked)}
                                          >
                                            {row.description || 'No Description'}
                                          </Checkbox>
                                        </MenuItem>
                                      ))}
                                    </MenuList>
                                  </Menu>
                                </HStack>
                              </Th>
                              <Th fontSize="md">Status</Th> {/* New status column */}
                              <Th fontSize="md">Date Created</Th>
                              <Th fontSize="md"></Th> {/* New column for actions */}
                            </Tr>
                          </Thead>
                          <Tbody>
                            {filteredTableData.map((row, index) => (
                              <Tr
                                key={index}
                                _hover={{ bg: 'gray.50' }}
                                transition="all 0.2s"
                                onMouseEnter={() => setHoveredRowIndex(index)}
                                onMouseLeave={() => setHoveredRowIndex(null)}
                                bg={row.status === 'inactive' ? 'gray.200' : 'inherit'} // Gray out the row if inactive
                                opacity={row.status === 'inactive' ? 0.6 : 1} // Reduce opacity if inactive
                              >
                                <Td fontWeight="medium">
                                  <LinkBox>
                                    <LinkOverlay onClick={handleRowClick} _hover={{textDecoration:'underline' }} >{row.databaseName}</LinkOverlay>
                                  </LinkBox>
                                </Td>
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
                                <Td>
                                  <Box
                                    as="span"
                                    display="inline-block"
                                    w="10px"
                                    h="10px"
                                    borderRadius="50%"
                                    bg={row.status === 'active' ? 'green.500' : 'red.500'}
                                    mr={2}
                                  />
                                  {row.status === 'active' ? 'Used' : 'Unused'}
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
                                    opacity={hoveredRowIndex === index ? 1 : 0}
                                    transition="opacity 0.2s"
                                  >
                                    <IconButton
                                      size="sm"
                                      icon={row.status === 'active' ? <DeleteIcon /> : <RepeatIcon />}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(index);
                                      }}
                                      aria-label={row.status === 'active' ? 'Mark as Unused' : 'Mark as Used'}
                                      color={row.status === 'active' ? 'red.500' : 'green.500'}
                                    />
                                  </HStack>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </>
                  ) : (
                    <SchemaPage />
                  )}
                </TabPanel>
                <TabPanel>
                  <EditForm />
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
                    <Tooltip
                      label="Generate description using AI"
                      aria-label="A tooltip"
                      hasArrow
                      placement="bottom-start"
                    >
                      <Button
                        onClick={generateAIDescription}
                        leftIcon={<Image src="/ai-logo.png" boxSize="30px" alt="AI Icon" />}
                        bg="transparent"
                        _hover={{ bg: 'transparent' }}
                        _active={{ bg: 'transparent' }}
                      >
                        {/* Optionally, add text or leave it empty */}
                      </Button>
                    </Tooltip>
                    <div>
                      <Button variant="ghost" onClick={closeModal} mr={5}>
                        Cancel
                      </Button>
                      <Button
                        bg="black"
                        color="white"
                        _hover={{ bg: 'gray.800' }}
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
