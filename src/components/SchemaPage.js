import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box,
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
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  InputGroup,
  InputLeftElement,
  Checkbox,
  useToast,
} from '@chakra-ui/react';
import { ChevronDownIcon, SearchIcon, RepeatIcon, DeleteIcon } from '@chakra-ui/icons';
import { FaSortAlphaDown, FaSortAlphaUpAlt, FaMagic } from 'react-icons/fa';
import { FiRotateCcw } from 'react-icons/fi';

const SchemaPage = ({ schemaName, databaseInfo }) => {
  const [tableData, setTableData] = useState([]);
  const toast = useToast();
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    if (schemaName && databaseInfo?.fields?.['Database']) {
      console.log(`Schema Name: ${schemaName}`);
      console.log(`Database: ${databaseInfo.fields['Database']}`);
      fetchTableData(schemaName, databaseInfo.fields['Database']);
    }
  }, [schemaName, databaseInfo]);

  const [searchText, setSearchText] = useState('');
  const [descriptionSearchText, setDescriptionSearchText] = useState('');
  const [columnDescriptionSearchText, setColumnDescriptionSearchText] = useState('');
  const [columnsData, setColumnsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDescription, setCurrentDescription] = useState('');
  const [editingType, setEditingType] = useState('table'); // 'table' or 'column'
  const [editingIndex, setEditingIndex] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [descriptionSortOrder, setDescriptionSortOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // Status filter state for tables
  const [columnStatusFilter, setColumnStatusFilter] = useState('all'); // Status filter state for columns
  const [checkedTables, setCheckedTables] = useState([]); // State to track checked tables
  const [checkedColumns, setCheckedColumns] = useState([]); // State to track checked columns
  const [nameSortOrder, setNameSortOrder] = useState(null);
  const [descriptionColumnSortOrder, setDescriptionColumnSortOrder] = useState(null);
  const [statusColumnSortOrder, setStatusColumnSortOrder] = useState(null);
  const [columnSearchText, setColumnSearchText] = useState(''); // State for columns search text
  const inputRef = useRef();

  const fetchTableData = async (schemaName, database) => {
    try {
      const filterFormula = `AND({Schema Name} = "${schemaName}", {Database} = "${database}")`;
  
      // Wait for a specified time (e.g., 1000 milliseconds or 1 second)
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      const response = await axios.get(
        'https://api.airtable.com/v0/app4ZQ9jav2XzNIv9/BQNewSchemaTable',
        {
          headers: {
            Authorization: `Bearer pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89`, // Replace with your actual API key
          },
          params: {
            filterByFormula: filterFormula, // Use the combined filter formula
          },
        }
      );
  

      const records = response.data.records.map((record) => ({
        id: record.id,
        databaseName: record.fields['Table Name'] || 'No Table Name',
        description: record.fields['Description'] || 'No Description',
        status: record.fields['Status'] || 'unknown',
        properties: [],
      }));

      setTableData(records);
    } catch (error) {
      toast({
        title: 'Error fetching table data',
        description: 'Failed to retrieve table data from Airtable.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error fetching table data from Airtable:', error);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchColumnsData = async (schemaName, database, tableName) => {
    try {
      console.log(`Fetching columns for Table Name: ${tableName}`); // Log the table name
      const filterFormula = `AND({Schema Name} = "${schemaName}", {Database} = "${database}", {Table Name} = "${tableName}")`;
      const response = await axios.get(
        'https://api.airtable.com/v0/app4ZQ9jav2XzNIv9/BQNewSchemaColumn', // Updated endpoint for column data
        {
          headers: {
            Authorization: `Bearer pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89`,
          },
          params: {
            filterByFormula: filterFormula, // Use the combined filter formula
          },
        }
      );

      const records = response.data.records.map((record) => ({
        id: record.id,
        columnName: record.fields['Column Name'] || 'No Column Name',
        description: record.fields['Description'] || 'No Description',
        status: record.fields['Status'] || 'unknown',
      }));

      setColumnsData(records);
    } catch (error) {
      toast({
        title: 'Error fetching column data',
        description: 'Failed to retrieve column data from Airtable.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error fetching columns data from Airtable:', error);
    }
  };

  const handleTableSelect = (index) => {
    setSelectedTable(index);
    const selectedTableName = tableData[index]?.databaseName;
    fetchColumnsData(schemaName, databaseInfo.fields['Database'], selectedTableName);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleDescriptionSearchChange = (e) => {
    setDescriptionSearchText(e.target.value);
  };

  const handleColumnDescriptionSearchChange = (e) => {
    setColumnDescriptionSearchText(e.target.value);
  };

  const handleColumnSearchChange = (e) => {
    setColumnSearchText(e.target.value);
  };

  const handleRefreshAll = () => {
    fetchTableData();
    setColumnsData([]);
  };

  const openModal = (type, index) => {
    setEditingType(type);
    setEditingIndex(index);

    if (type === 'table') {
      setCurrentDescription(tableData[index]?.description || '');
    } else {
      setCurrentDescription(columnsData[index]?.description || '');
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentDescription('');
    setEditingIndex(null);
  };

  const saveDescription = async () => {
    try {
      if (editingType === 'table') {
        const updatedTableData = [...tableData];
        updatedTableData[editingIndex].description = currentDescription;
        setTableData(updatedTableData);

        const recordId = tableData[editingIndex].id;
        await axios.patch(
          `https://api.airtable.com/v0/app4ZQ9jav2XzNIv9/BQNewSchemaTable/${recordId}`,
          {
            fields: {
              Description: currentDescription,
            },
          },
          {
            headers: {
              Authorization: `Bearer pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89`,
            },
          }
          
        );
      } else {
        const updatedColumnsData = [...columnsData];
        updatedColumnsData[editingIndex].description = currentDescription;
        setColumnsData(updatedColumnsData);

        const recordId = columnsData[editingIndex].id;
        await axios.patch(
          `https://api.airtable.com/v0/app4ZQ9jav2XzNIv9/BQNewSchemaColumn/${recordId}`,
          {
            fields: {
              Description: currentDescription,
            },
          },
          {
            headers: {
              Authorization: `Bearer pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89`,
            },
          }
        );
      }

      toast({
        title: 'Description saved',
        description: 'The description has been successfully updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error saving description',
        description: 'Failed to update the description.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    closeModal();
  };

  const generateAIDescription = () => {
    const aiDescriptions = [
      "This table stores user information including unique identifiers, usernames, and email addresses.",
      "This table tracks user events with details such as event type and timestamp.",
      "A high-performance database for storing complex JSON data with UUID identifiers.",
      "This column is a unique identifier for each record in the table.",
      "Stores the username of the user, used for authentication and display purposes.",
      "The user's email address, used for communication and notifications.",
    ];

    const randomDescription = aiDescriptions[Math.floor(Math.random() * aiDescriptions.length)];
    setCurrentDescription(randomDescription);
  };

  const toggleSortOrder = (column) => {
    let sortedData;
    if (column === 'name') {
      if (nameSortOrder === 'asc') {
        sortedData = [...tableData].sort((a, b) =>
          a.databaseName.toLowerCase() > b.databaseName.toLowerCase() ? -1 : 1
        );
        setNameSortOrder('desc');
      } else {
        sortedData = [...tableData].sort((a, b) =>
          a.databaseName.toLowerCase() < b.databaseName.toLowerCase() ? -1 : 1
        );
        setNameSortOrder('asc');
      }
    } else if (column === 'description') {
      if (descriptionColumnSortOrder === 'asc') {
        sortedData = [...tableData].sort((a, b) =>
          a.description.toLowerCase() > b.description.toLowerCase() ? -1 : 1
        );
        setDescriptionColumnSortOrder('desc');
      } else {
        sortedData = [...tableData].sort((a, b) =>
          a.description.toLowerCase() < b.description.toLowerCase() ? -1 : 1
        );
        setDescriptionColumnSortOrder('asc');
      }
    } else if (column === 'status') {
      if (statusColumnSortOrder === 'asc') {
        sortedData = [...tableData].sort((a, b) =>
          a.status.toLowerCase() > b.status.toLowerCase() ? -1 : 1
        );
        setStatusColumnSortOrder('desc');
      } else {
        sortedData = [...tableData].sort((a, b) =>
          a.status.toLowerCase() < b.status.toLowerCase() ? -1 : 1
        );
        setStatusColumnSortOrder('asc');
      }
    }
    setTableData(sortedData);
  };

  const handleDelete = async (index, isProperty = false) => {
    try {
      if (isProperty && selectedTable !== null) {
        const updatedColumnsData = columnsData.map((col, colIndex) =>
          colIndex === index
            ? { ...col, status: col.status === 'active' ? 'unused' : 'active' }
            : col
        );
        setColumnsData(updatedColumnsData);

        const recordId = columnsData[index].id;
        await axios.patch(
          `https://api.airtable.com/v0/app4ZQ9jav2XzNIv9/BQNewSchemaColumn/${recordId}`,
          {
            fields: {
              Status: updatedColumnsData[index].status,
            },
          },
          {
            headers: {
              Authorization: `Bearer pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89`,
            },
          }
        );
      } else if (index !== null) {
        const updatedTableData = tableData.map((row, rowIndex) =>
          rowIndex === index
            ? { ...row, status: row.status === 'active' ? 'unused' : 'active' }
            : row
        );
        setTableData(updatedTableData);

        const recordId = tableData[index].id;
        await axios.patch(
          `https://api.airtable.com/v0/app4ZQ9jav2XzNIv9/BQNewSchemaTable/${recordId}`,
          {
            fields: {
              Status: updatedTableData[index].status,
            },
          },
          {
            headers: {
              Authorization: `Bearer pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89`,
            },
          }
        );
      }

      toast({
        title: 'Status updated',
        description: 'The status has been successfully updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating status',
        description: 'Failed to update the status.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRefresh = (index, isProperty = false) => {
    console.log(`Refreshing ${isProperty ? 'property' : 'table'} at index ${index}`);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const handleColumnStatusFilterChange = (status) => {
    setColumnStatusFilter(status);
  };

  const handleCheckboxChange = (index) => {
    setCheckedTables((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleColumnCheckboxChange = (index) => {
    setCheckedColumns((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Filter rows based on checked items, search text, and description search text
  const filteredTableData = tableData.filter((row, index) => {
    const isChecked = checkedTables.length === 0 || checkedTables.includes(index);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'used' && row.status === 'active') ||
      (statusFilter === 'unused' && row.status === 'unused');
    const matchesSearchText =
      row.databaseName.toLowerCase().includes(searchText.toLowerCase()) &&
      row.description.toLowerCase().includes(descriptionSearchText.toLowerCase());
    return isChecked && matchesStatus && matchesSearchText;
  });

  // Filter columns data based on checked items and search text in the column names
  const filteredColumnsData = columnsData.filter((col, index) => {
    const isChecked = checkedColumns.length === 0 || checkedColumns.includes(index);
    const matchesStatus =
      columnStatusFilter === 'all' ||
      (columnStatusFilter === 'used' && col.status === 'active') ||
      (columnStatusFilter === 'unused' && col.status === 'unused');
    return (
      isChecked &&
      matchesStatus &&
      col.columnName.toLowerCase().includes(columnSearchText.toLowerCase()) &&
      col.description.toLowerCase().includes(columnDescriptionSearchText.toLowerCase())
    );
  });

  return (
    <main className="flex-grow p-4">
      <Box mx="auto">
        <Text
          fontSize="md"
          color="gray.600"
          mb={6}
          align={'left'}
          fontFamily="Arial, sans-serif"
        >
          This is the schema for the database. Selecting a table will show its
          columns.
        </Text>
        <Flex justifyContent="flex-end" mb={4}>
          <HStack justify="flex-end" mb={4}>
            <Button
              mr={4}
              onClick={handleRefreshAll}
              bg="blue.500"
              color="white"
              _hover={{ bg: 'blue.600' }}
              fontFamily="Arial, sans-serif"
              leftIcon={<RepeatIcon />}
            >
              Refresh All
            </Button>
          </HStack>
          <Tooltip
            borderRadius="5"
            label="Create AI Description for All"
            aria-label="Create AI Description for All"
          >
            <IconButton
              icon={<FaMagic />}
              onClick={generateAIDescription}
              bg="blue.500"
              color="white"
              _hover={{ bg: 'blue.600' }}
              mr={4}
              fontFamily="Arial, sans-serif"
              aria-label="Create AI Description for All"
            />
          </Tooltip>
        </Flex>

    
          <TableContainer
            boxShadow="lg"
            borderRadius="lg"
            flex="1"
            mr={4}
            height="200px"
            overflowY="auto"
   
          >
            <Table variant="simple" size="md">
              <Thead bg="gray.100" position="sticky" top="0" zIndex="1">
                <Tr>
                  <Th fontSize="md" fontFamily="Arial, sans-serif">
                    <HStack spacing={4}>
                      <Menu closeOnSelect={false} autoSelect={false}>
                        <MenuButton
                          as={Button}
                          rightIcon={<ChevronDownIcon />}
                          variant="ghost"
                          size="sm"
                        >
                          Tables
                        </MenuButton>
                        <MenuList maxH="300px" overflowY="auto">
                          <MenuItem>
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
                                fontFamily="Arial, sans-serif"
                              />
                            </InputGroup>
                          </MenuItem>
                          <MenuDivider />
                          {tableData.map((row, index) => (
                            <MenuItem key={index} fontFamily="Arial, sans-serif">
                              <Checkbox
                                isChecked={checkedTables.includes(index)}
                                onChange={() => handleCheckboxChange(index)}
                                fontFamily="Arial, sans-serif"
                              >
                                {row.databaseName}
                              </Checkbox>
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                    </HStack>
                  </Th>
                  <Th fontSize="md" fontFamily="Arial, sans-serif">
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
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <SearchIcon color="gray.400" />
                            </InputLeftElement>
                            <Input
                              placeholder="Filter by description.."
                              value={descriptionSearchText}
                              onChange={handleDescriptionSearchChange}
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                              fontFamily="Arial, sans-serif"
                            />
                          </InputGroup>
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Th>
                  <Th fontSize="md" fontFamily="Arial, sans-serif">
                    <Menu closeOnSelect={false} autoSelect={false}>
                      <MenuButton
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                        variant="ghost"
                        size="sm"
                      >
                        Status
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={() => handleStatusFilterChange('all')}>
                          All
                        </MenuItem>
                        <MenuItem onClick={() => handleStatusFilterChange('used')}>
                          Used
                        </MenuItem>
                        <MenuItem onClick={() => handleStatusFilterChange('unused')}>
                          Unused
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Th>
                  <Th fontSize="md" fontFamily="Arial, sans-serif"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTableData.map((row, index) => (
                  <Tr
                    key={index}
                    _hover={{ bg: 'gray.50' }}
                    transition="all 0.2s"
                    onClick={() => handleTableSelect(index)}
                    bg={selectedTable === index ? 'blue.100' : 'inherit'}
                    cursor="pointer"
                    fontFamily="Arial, sans-serif"
                  >
                    <Td fontWeight="medium" fontFamily="Arial, sans-serif">
                      {row.databaseName}
                    </Td>
                    <Td fontFamily="Arial, sans-serif">
                      <Button
                        size="sm"
                        variant="link"
                        color={'gray.600'}
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('table', index);
                        }}
                        _hover={{ bg: 'transparent' }}
                        _focus={{ boxShadow: 'none' }}
                        fontFamily="Arial, sans-serif"
                      >
                        {row.description || '+ Add Description'}
                      </Button>
                    </Td>
                    <Td fontFamily="Arial, sans-serif">
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
                    <Td textAlign="right" fontFamily="Arial, sans-serif">
                      <HStack spacing={2} justify="flex-end">
                        <IconButton
                          size="sm"
                          icon={<RepeatIcon />}
                          aria-label="Refresh"
                          color="blue.500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRefresh(index);
                          }}
                          fontFamily="Arial, sans-serif"
                        />
                        <IconButton
                          size="sm"
                          icon={
                            row.status === 'active' ? <DeleteIcon /> : <FiRotateCcw />
                          }
                          aria-label={
                            row.status === 'active' ? 'Delete' : 'Restore'
                          }
                          color={row.status === 'active' ? 'red.500' : 'green.500'}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(index);
                          }}
                          fontFamily="Arial, sans-serif"
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          {selectedTable !== null && (
            <TableContainer
              mt={'50px'}
              boxShadow="lg"
              borderRadius="lg"
              flex="1"
              height="200px"
              overflowY="auto"
            >
              <Table variant="simple" size="md">
                <Thead bg="gray.100" position="sticky" top="0" zIndex="1">
                  <Tr>
                    <Th fontSize="md" fontFamily="Arial, sans-serif">
                      <Menu closeOnSelect={false} autoSelect={false}>
                        <MenuButton
                          as={Button}
                          rightIcon={<ChevronDownIcon />}
                          variant="ghost"
                          size="sm"
                        >
                          Columns
                        </MenuButton>
                        <MenuList maxH="300px" overflowY="auto">
                          <MenuItem>
                            <InputGroup>
                              <InputLeftElement pointerEvents="none">
                                <SearchIcon color="gray.400" />
                              </InputLeftElement>
                              <Input
                                placeholder="Filter by column.."
                                value={columnSearchText}
                                onChange={handleColumnSearchChange}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                                fontFamily="Arial, sans-serif"
                              />
                            </InputGroup>
                          </MenuItem>
                          <MenuDivider />
                          {columnsData.map((col, index) => (
                            <MenuItem key={index} fontFamily="Arial, sans-serif">
                              <Checkbox
                                isChecked={checkedColumns.includes(index)}
                                onChange={() => handleColumnCheckboxChange(index)}
                                fontFamily="Arial, sans-serif"
                              >
                                {col.columnName}
                              </Checkbox>
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                    </Th>
                    <Th fontSize="md" fontFamily="Arial, sans-serif">
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
                            <InputGroup>
                              <InputLeftElement pointerEvents="none">
                                <SearchIcon color="gray.400" />
                              </InputLeftElement>
                              <Input
                                placeholder="Filter by description.."
                                value={columnDescriptionSearchText}
                                onChange={handleColumnDescriptionSearchChange}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                                fontFamily="Arial, sans-serif"
                              />
                            </InputGroup>
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Th>
                    <Th fontSize="md" fontFamily="Arial, sans-serif">
                      <Menu closeOnSelect={false} autoSelect={false}>
                        <MenuButton
                          as={Button}
                          rightIcon={<ChevronDownIcon />}
                          variant="ghost"
                          size="sm"
                        >
                          Status
                        </MenuButton>
                        <MenuList>
                          <MenuItem onClick={() => handleColumnStatusFilterChange('all')}>
                            All
                          </MenuItem>
                          <MenuItem onClick={() => handleColumnStatusFilterChange('used')}>
                            Used
                          </MenuItem>
                          <MenuItem onClick={() => handleColumnStatusFilterChange('unused')}>
                            Unused
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Th>
                    <Th fontSize="md" fontFamily="Arial, sans-serif"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredColumnsData.map((col, index) => (
                    <Tr
                      key={index}
                      _hover={{ bg: 'gray.50' }}
                      transition="all 0.2s"
                      fontFamily="Arial, sans-serif"
                      cursor="pointer"
                    >
                      <Td fontFamily="Arial, sans-serif">{col.columnName}</Td>
                      <Td fontFamily="Arial, sans-serif">
                        <Button
                          size="sm"
                          variant="link"
                          color={'gray.600'}
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('column', index);
                          }}
                          _hover={{ bg: 'transparent' }}
                          _focus={{ boxShadow: 'none' }}
                          fontFamily="Arial, sans-serif"
                        >
                          {col.description || '+ Add Description'}
                        </Button>
                      </Td>
                      <Td fontFamily="Arial, sans-serif">
                        <Box
                          as="span"
                          display="inline-block"
                          w="10px"
                          h="10px"
                          borderRadius="50%"
                          bg={col.status === 'active' ? 'green.500' : 'red.500'}
                          mr={2}
                        />
                        {col.status === 'active' ? 'Used' : 'Unused'}
                      </Td>
                      <Td textAlign="right" fontFamily="Arial, sans-serif">
                        <HStack spacing={2} justify="flex-end">
                          <IconButton
                            size="sm"
                            icon={<RepeatIcon />}
                            aria-label="Refresh"
                            color="blue.500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRefresh(index, true);
                            }}
                            fontFamily="Arial, sans-serif"
                          />
                          <IconButton
                            size="sm"
                            icon={
                              col.status === 'active' ? <DeleteIcon /> : <FiRotateCcw />
                            }
                            aria-label={
                              col.status === 'active' ? 'Delete' : 'Restore'
                            }
                            color={col.status === 'active' ? 'red.500' : 'green.500'}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(index, true);
                            }}
                            fontFamily="Arial, sans-serif"
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
  

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontFamily="Arial, sans-serif">
              Update Description
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea
                value={currentDescription}
                onChange={(e) => setCurrentDescription(e.target.value)}
                placeholder="Enter description"
                fontFamily="Arial, sans-serif"
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
                    leftIcon={<FaMagic />}
                    bg="transparent"
                    _hover={{ bg: 'transparent' }}
                    _active={{ bg: 'transparent' }}
                    fontFamily="Arial, sans-serif"
                  />
                </Tooltip>
                <div>
                  <Button
                    variant="ghost"
                    onClick={closeModal}
                    mr={5}
                    fontFamily="Arial, sans-serif"
                  >
                    Cancel
                  </Button>
                  <Button
                    bg="black"
                    color="white"
                    _hover={{ bg: 'gray.800' }}
                    onClick={saveDescription}
                    fontFamily="Arial, sans-serif"
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
  );
};

export default SchemaPage;
