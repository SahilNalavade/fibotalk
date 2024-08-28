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
import SchemaLogs from './SchemaLogs';

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

  // Function to handle delete (mock implementation)
  const handleDelete = (index) => {
    console.log(`Deleting row ${index}`);
    setTableData(tableData.filter((_, i) => i !== index));
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
    navigate('/schema-page'); // Redirect to /schema-page
  };

  return (
    <div className="Dashboard flex flex-col h-screen">
      <TopNav />
      <div className="flex flex-grow overflow-hidden">
        <SideNav />
        <main className="flex-grow p-4" style={{ paddingTop: '105px' }}>
          <Box  mx="auto">
            <Box mt={4}>
              <Breadcrumb
                spacing="8px"
                separator={<ChevronRightIcon color={breadcrumbColor} boxSize="18px" />}
                fontSize="lg"
                color={breadcrumbColor}
              >
                <BreadcrumbItem>
                  <BreadcrumbLink href="/connections/database" fontSize="lg">
                    Connection
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/connections/database" fontSize="lg">
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
                <Tab>logs</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SchemaPage />
                </TabPanel>
                <TabPanel>
                  <SchemaLogs />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </main>
      </div>
    </div>
  );
};

export default AnotherPage;
