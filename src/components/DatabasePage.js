import React, { useEffect, useState, useRef } from 'react';
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
  Image,
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
  Input,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  InputLeftElement,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Flex,
  ButtonGroup,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  VStack,
  Tooltip,
  Textarea,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react';
import { ChevronRightIcon, RepeatIcon, DeleteIcon, ChevronDownIcon, SearchIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { FaSortAlphaDown, FaSortAlphaUpAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import TopNav from './TopNav';
import SideNav from './SideNav';
import EditForm from './EditForm';

const AnotherPage = () => {
  const tabBg = useColorModeValue('gray.100', 'gray.700');
  const navigate = useNavigate();
  const location = useLocation();
  const databaseInfo = location.state?.databaseInfo || {};
  const [formData, setFormData] = useState(databaseInfo.fields || {});

  const [schemaData, setSchemaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const breadcrumbColor = useColorModeValue('gray.600', 'gray.300');
  const toast = useToast();
  const cancelRef = useRef();

  // State for handling modals and forms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDescription, setCurrentDescription] = useState('');
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  // State for table interactions
  const [searchText, setSearchText] = useState('');
  const [descriptionSearchText, setDescriptionSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // Status filter state
  const [sortOrder, setSortOrder] = useState(null);
  const [descriptionSortOrder, setDescriptionSortOrder] = useState(null);
  const [selectedSources, setSelectedSources] = useState([]);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
  const inputRef = useRef();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Confirmation dialog states
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    
    if (!databaseInfo.fields) {
      toast({
        title: 'No database information found.',
        description: 'Please select a database from the list.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/connections');
    } else {
      fetchSchema();
    }
  }, [databaseInfo, navigate, toast]);

// Update the fetchSchema function to filter data based on the selected database
const fetchSchema = async () => {
  try {
    setLoading(true);
    setError(null);

    // Create a filter formula to fetch only the schema data related to the selected database
    const filterFormula = `AND({Database} = "${databaseInfo.fields['Database']}")`;

    // Fetch data from Airtable with the applied filter formula
    const response = await axios.get(
      `https://api.airtable.com/v0/app4ZQ9jav2XzNIv9/BQNewSchemaOverview`,
      {
        headers: {
          Authorization: `Bearer pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89`,
        },
        params: {
          filterByFormula: filterFormula,
        },
      }
    );

    if (response.data.records.length === 0) {
      setError(`No data found for the database: ${databaseInfo.fields['Database']}.`);
    } else {
      setSchemaData(response.data.records);
    }
  } catch (error) {
    console.error('Error fetching schema:', error);
    setError('Failed to fetch schema data.');
  } finally {
    setLoading(false);
  }
};


  // Navigate to DatabasePage on row click
  const handleRowClick = (row) => {
  const schemaName = row.fields['Schema Name']; // Capture the schema name
  navigate('/DatabasePagec', { state: { databaseInfo: row, schemaName } }); // Pass schema name along with database info
};

  // Modal handling functions
  const openModal = (index) => {
    setSelectedRowIndex(index);
    setCurrentDescription(schemaData[index].fields.Description || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRowIndex(null);
    setCurrentDescription('');
  };

  const saveDescription = async () => {
    if (selectedRowIndex !== null) {
      const updatedSchemaData = schemaData.map((row, index) =>
        index === selectedRowIndex ? { ...row, fields: { ...row.fields, Description: currentDescription } } : row
      );

      const recordId = schemaData[selectedRowIndex].id;

      try {
        await axios.patch(
          `https://api.airtable.com/v0/app4ZQ9jav2XzNIv9/BQNewSchemaOverview/${recordId}`,
          { fields: { Description: currentDescription } },
          {
            headers: {
              Authorization: `Bearer pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89`,
              'Content-Type': 'application/json',
            },
          }
        );
        setSchemaData(updatedSchemaData);
        toast({
          title: 'Description updated.',
          description: 'The description has been successfully updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error updating description:', error);
        toast({
          title: 'Failed to update description.',
          description: 'There was an error updating the description.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }

      closeModal();
    }
  };

  const generateAIDescription = () => {
    const aiDescription = 'This is an AI-generated description.';
    setCurrentDescription(aiDescription);
  };

  const generateAIDescriptionForAll = async () => {
    try {
      const updatedSchemaData = await Promise.all(
        schemaData.map(async (row) => {
          const aiDescription = `AI-generated description for ${row.fields['Schema Name']}`;
          const recordId = row.id;

          await axios.patch(
            `https://api.airtable.com/v0/app4ZQ9jav2XzNIv9/BQNewSchemaOverview/${recordId}`,
            { fields: { Description: aiDescription } },
            {
              headers: {
                Authorization: `Bearer pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89`,
                'Content-Type': 'application/json',
              },
            }
          );

          return { ...row, fields: { ...row.fields, Description: aiDescription } };
        })
      );

      setSchemaData(updatedSchemaData);
      toast({
        title: 'AI Descriptions Generated.',
        description: 'AI-generated descriptions have been created for all rows.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error generating AI descriptions for all:', error);
      toast({
        title: 'Failed to generate AI descriptions.',
        description: 'There was an error generating AI descriptions for all rows.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCheckboxChange = (name, isChecked) => {
    if (isChecked) {
      setSelectedSources((prev) => [...prev, name]);
    } else {
      setSelectedSources((prev) => prev.filter((item) => item !== name));
    }
  };

  // Filter the table data based on search text and status filter
  const filteredTableData = schemaData.filter((row) => {
    const matchesSearchText =
      row.fields['Schema Name'].toLowerCase().includes(searchText.toLowerCase()) &&
      row.fields.Description.toLowerCase().includes(descriptionSearchText.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'used' && row.fields.Status === 'active') ||
      (statusFilter === 'unused' && row.fields.Status === 'inactive');

    return matchesSearchText && matchesStatus;
  });

  const toggleSortOrder = () => {
    let sortedData;
    if (sortOrder === 'asc') {
      sortedData = [...filteredTableData].sort((a, b) =>
        a.fields['Schema Name'].toLowerCase() > b.fields['Schema Name'].toLowerCase() ? -1 : 1
      );
      setSortOrder('desc');
    } else {
      sortedData = [...filteredTableData].sort((a, b) =>
        a.fields['Schema Name'].toLowerCase() < b.fields['Schema Name'].toLowerCase() ? -1 : 1
      );
      setSortOrder('asc');
    }
    setSchemaData(sortedData);
  };

  const toggleDescriptionSortOrder = () => {
    let sortedData;
    if (descriptionSortOrder === 'asc') {
      sortedData = [...filteredTableData].sort((a, b) =>
        a.fields.Description.toLowerCase() > b.fields.Description.toLowerCase() ? -1 : 1
      );
      setDescriptionSortOrder('desc');
    } else {
      sortedData = [...filteredTableData].sort((a, b) =>
        a.fields.Description.toLowerCase() < b.fields.Description.toLowerCase() ? -1 : 1
      );
      setDescriptionSortOrder('asc');
    }
    setSchemaData(sortedData);
  };

  const handleSave = async (updatedData) => {
    try {
      const response = await axios.patch(
        `https://api.airtable.com/v0/app4ZQ9jav2XzNIv9/DatabaseConfig/${databaseInfo.id}`,
        { fields: updatedData },
        {
          headers: {
            Authorization: `Bearer pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89`,
            'Content-Type': 'application/json',
          },
        }
      );
      setFormData(response.data.fields);
      toast({
        title: 'Saved Successfully.',
        description: 'Database details have been updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsConfirmSaveOpen(false);
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: 'Save Failed.',
        description: 'An error occurred while saving the details.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://api.airtable.com/v0/app4ZQ9jav2XzNIv9/DatabaseConfig/${databaseInfo.id}`,
        {
          headers: {
            Authorization: `Bearer pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89`,
          },
        }
      );
      toast({
        title: 'Deleted Successfully.',
        description: 'The database configuration has been deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/connections');
    } catch (error) {
      console.error('Error deleting data:', error);
      toast({
        title: 'Delete Failed.',
        description: 'An error occurred while deleting the configuration.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsConfirmDeleteOpen(false);
      setDeleteConfirmation('');
    }
  };

  const handleChangeStatus = async (recordId, currentStatus) => {
    const newStatus = currentStatus === 'inactive' ? 'active' : 'inactive';

    try {
      const response = await axios.patch(
        `https://api.airtable.com/v0/app4ZQ9jav2XzNIv9/BQNewSchemaOverview/${recordId}`,
        { fields: { Status: newStatus } },
        {
          headers: {
            Authorization: `Bearer pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setSchemaData((prevData) =>
          prevData.map((row) =>
            row.id === recordId ? { ...row, fields: { ...row.fields, Status: newStatus } } : row
          )
        );
        toast({
          title: 'Status Updated.',
          description: `The status has been changed to ${newStatus}.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error('Failed to update status. Status code:', response.status);
        toast({
          title: 'Failed to update status.',
          description: 'There was an error updating the status.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating status:', error.message);
      toast({
        title: 'Failed to update status.',
        description: 'There was an error updating the status.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRefresh = async (recordId) => {
    try {
      const response = await axios.get(
        `https://api.airtable.com/v0/app4ZQ9jav2XzNIv9/BQNewSchemaOverview/${recordId}`,
        {
          headers: {
            Authorization: `Bearer pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89`,
            'Content-Type': 'application/json',
          },
        }
      );

      const updatedRecord = response.data;
      setSchemaData((prevData) =>
        prevData.map((row) =>
          row.id === recordId ? updatedRecord : row
        )
      );
      toast({
        title: 'Record Refreshed.',
        description: 'The record has been successfully refreshed.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error refreshing record:', error.message);
      toast({
        title: 'Failed to refresh record.',
        description: 'There was an error refreshing the record.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRefreshAll = async () => {
    fetchSchema();
    toast({
      title: 'All Records Refreshed.',
      description: 'All records have been successfully refreshed.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(filteredTableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredTableData.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return (
      <Alert status="error" maxWidth="90%" mx="auto" mt={4}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <div className="Dashboard flex flex-col h-screen">
      <TopNav />
      <div className="flex flex-grow overflow-hidden">
        <SideNav />
        <main className="flex-grow p-4" style={{ paddingTop: '105px' }}>
          <Box maxWidth="90%" mx="auto">
            <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
              <Breadcrumb
                spacing="8px"
                separator={<ChevronRightIcon color={breadcrumbColor} boxSize="18px" />}
                fontSize="lg"
                color={breadcrumbColor}
              >
                <BreadcrumbItem>
                  <BreadcrumbLink href="/connections" fontSize="lg">
                    Connection
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/connections" fontSize="lg">
                    Database Configuration
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink fontSize="lg" fontWeight="semibold">
                  {databaseInfo.fields['Database']}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </Box>

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
                    <Flex justifyContent="flex-end" mb={4}>
                      <HStack spacing={4}>
                        {/* <Button colorScheme="blue" onClick={generateAIDescriptionForAll}>
                          AI Description for All
                        </Button> */}
                        <Button colorScheme="blue" mr={4} onClick={handleRefreshAll}>
                          Refresh All
                        </Button>
                      </HStack>
                    </Flex>
                    <Table variant="simple" size="md">
                      <Thead bg="gray.100">
                        <Tr>
                          <Th>
                            <HStack spacing={4}>
                              <Menu closeOnSelect={false} autoSelect={false}>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost" size="sm">
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
                                      Sort
                                    </Button>
                                    <InputGroup>
                                      <InputLeftElement pointerEvents="none">
                                        <SearchIcon color="gray.400" />
                                      </InputLeftElement>
                                      <Input
                                        ref={inputRef}
                                        placeholder="Filter by name.."
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        mb={2}
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </InputGroup>
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </HStack>
                          </Th>
                          <Th fontSize="md">
                            <HStack spacing={4}>
                              <Menu closeOnSelect={false} autoSelect={false}>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost" size="sm">
                                  Description
                                </MenuButton>
                                <MenuList maxH="300px" overflowY="auto">
                                  <MenuItem>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={toggleDescriptionSortOrder}
                                      rightIcon={
                                        descriptionSortOrder === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUpAlt />
                                      }
                                    >
                                      Sort
                                    </Button>
                                    <InputGroup>
                                      <InputLeftElement pointerEvents="none">
                                        <SearchIcon color="gray.400" />
                                      </InputLeftElement>
                                      <Input
                                        placeholder="Filter by description.."
                                        value={descriptionSearchText}
                                        onChange={(e) => setDescriptionSearchText(e.target.value)}
                                        mb={2}
                                        autoFocus
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </InputGroup>
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </HStack>
                          </Th>
                          <Th fontSize="md">
                            <HStack spacing={4}>
                              <Menu closeOnSelect={false} autoSelect={false}>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost" size="sm">
                                  Status
                                </MenuButton>
                                <MenuList>
                                  <MenuItem onClick={() => setStatusFilter('all')}>All</MenuItem>
                                  <MenuItem onClick={() => setStatusFilter('used')}>Used</MenuItem>
                                  <MenuItem onClick={() => setStatusFilter('unused')}>Unused</MenuItem>
                                </MenuList>
                              </Menu>
                            </HStack>
                          </Th>
                          <Th fontSize="md">Date Created</Th>
                          <Th fontSize="md">Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {paginatedData.map((row, index) => (
                          <Tr
                            key={index}
                            _hover={{ bg: 'gray.50' }}
                            transition="all 0.2s"
                            onClick={() => handleRowClick(row)}
                            onMouseEnter={() => setHoveredRowIndex(index)}
                            onMouseLeave={() => setHoveredRowIndex(null)}
                            bg={row.fields.Status === 'inactive' ? 'gray.200' : 'inherit'}
                            opacity={row.fields.Status === 'inactive' ? 0.6 : 1}
                          >
                            <Td fontWeight="medium">
                              <LinkBox>
                                <LinkOverlay
                                  onClick={() => console.log('Navigate to schema detail')}
                                  _hover={{ textDecoration: 'underline' }}
                                >
                                  {row.fields['Schema Name']}
                                </LinkOverlay>
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
                                {row.fields.Description || '+ Add Description'}
                              </Button>
                            </Td>
                            <Td>
                              <Box
                                as="span"
                                display="inline-block"
                                w="10px"
                                h="10px"
                                borderRadius="50%"
                                bg={row.fields.Status === 'active' ? 'green.500' : 'red.500'}
                                mr={2}
                              />
                              {row.fields.Status === 'active' ? 'Used' : 'Unused'}
                            </Td>
                            <Td>
                              <Text fontSize="sm" color="gray.600">
                                {row.fields['CreatedAt']}
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
                                  icon={row.fields.Status === 'active' ? <DeleteIcon /> : <RepeatIcon />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleChangeStatus(row.id, row.fields.Status);
                                  }}
                                  aria-label={row.fields.Status === 'active' ? 'Mark as Unused' : 'Mark as Used'}
                                  color={row.fields.Status === 'active' ? 'red.500' : 'green.500'}
                                />
                                <IconButton
                                  size="sm"
                                  icon={<MdRefresh />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRefresh(row.id);
                                  }}
                                  aria-label="Refresh Row"
                                  color={'blue.500'}
                                />
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>

                  {/* Pagination Controls */}
                  <Flex justifyContent="space-between" alignItems="center" mt={6}>
                    <Text fontSize="sm" color="gray.600">
                      Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTableData.length)} of {filteredTableData.length} results
                    </Text>
                    <ButtonGroup variant="outline" spacing={2}>
                      <Button
                        leftIcon={<FaChevronLeft />}
                        onClick={() => handlePageChange(currentPage - 1)}
                        isDisabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      {[...Array(totalPages).keys()].map((page) => (
                        <Button
                          key={page + 1}
                          onClick={() => handlePageChange(page + 1)}
                          variant={currentPage === page + 1 ? 'solid' : 'outline'}
                          colorScheme={currentPage === page + 1 ? 'blue' : 'gray'}
                        >
                          {page + 1}
                        </Button>
                      ))}
                      <Button
                        rightIcon={<FaChevronRight />}
                        onClick={() => handlePageChange(currentPage + 1)}
                        isDisabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </ButtonGroup>
                  </Flex>
                </TabPanel>

                <TabPanel>
                  <EditForm formData={formData} setFormData={setFormData} databaseType={databaseInfo.databaseName} />
                  <VStack spacing={4} mt={4} align="stretch">
                    <HStack spacing={4} justify="flex-end">
                      <Button colorScheme="red" onClick={() => setIsConfirmDeleteOpen(true)}>
                        Delete
                      </Button>
                      <Button colorScheme="blue" onClick={() => setIsConfirmSaveOpen(true)}>
                        Save
                      </Button>
                    </HStack>
                  </VStack>
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
                    <Tooltip label="Generate description using AI" aria-label="A tooltip" hasArrow placement="bottom-start">
                      <Button
                        onClick={generateAIDescription}
                        leftIcon={<Image src="/ai-logo.png" boxSize="30px" alt="AI Icon" />}
                        bg="transparent"
                        _hover={{ bg: 'transparent' }}
                        _active={{ bg: 'transparent' }}
                      />
                    </Tooltip>
                    <div>
                      <Button variant="ghost" onClick={closeModal} mr={5}>
                        Cancel
                      </Button>
                      <Button bg="black" color="white" _hover={{ bg: 'gray.800' }} onClick={saveDescription}>
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

      {/* Save Confirmation Dialog */}
      <AlertDialog isOpen={isConfirmSaveOpen} leastDestructiveRef={cancelRef} onClose={() => setIsConfirmSaveOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Save
            </AlertDialogHeader>
            <AlertDialogBody>Saving changes will update the database configuration. Do you want to proceed?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsConfirmSaveOpen(false)} bg="white">
                Cancel
              </Button>
              <Button onClick={() => handleSave(formData)} ml={3} colorScheme="blue">
                Yes, Save
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isConfirmDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsConfirmDeleteOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Delete
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this configuration? Please type <b>delete</b> to confirm.
              <Input
                mt={4}
                placeholder="Type delete"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
              />
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsConfirmDeleteOpen(false)} bg="white">
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                ml={3}
                colorScheme="red"
                isDisabled={deleteConfirmation.toLowerCase() !== 'delete'}
              >
                Confirm Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};

export default AnotherPage;
