import React, { useState, useRef } from 'react';
import {
  Box,
  Flex,
  VStack,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useClipboard,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Editable,
  EditablePreview,
  EditableInput,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Tooltip,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import {
  EditIcon,
  CopyIcon,
  DownloadIcon,
  RepeatIcon,
  AddIcon,
  MinusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import {
  FaClock,
  FaShieldAlt,
  FaBook,
  FaExpand,
  FaChartBar,
  FaChartLine,
  FaChartPie,
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import DrawerComponent from './DrawerComponent';

SyntaxHighlighter.registerLanguage('sql', sql);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Component to display chat messages
const cleanMessage = (message) => {
  // Remove markdown-like symbols ###, **, and leading '-'
  return message
    .replace(/###/g, '') // Remove ###
    .replace(/\*\*/g, '') // Remove **
    .replace(/^\s*-\s+/gm, '') // Remove leading dash '-' with spaces
    .trim(); // Trim any leading or trailing whitespace
};

const cleanSQL = (sql) => {
  // Remove backticks, triple backticks, and trim whitespace
  return sql.replace(/```/g, '').trim();
};

const formatSQL = (sql) => {
  return sql
    .replace(
      /(SELECT|FROM|WHERE|JOIN|AND|OR|GROUP BY|ORDER BY|LIMIT|OFFSET|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN)/gi,
      '\n$1'
    )
    .replace(/,/g, ',\n') // Break after commas
    .replace(/\(/g, '(\n') // Break after open parentheses
    .replace(/\)/g, '\n)') // Break before close parentheses
    .replace(/```/g, '').trim()
   
};

const updateAirtableRecord = async (recordId, fields) => {
  const AIRTABLE_PAT = 'pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89';
  const AIRTABLE_BASE_ID = 'app4ZQ9jav2XzNIv9';
  const AIRTABLE_TABLE_NAME = 'SavedReports';

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}/${recordId}`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (!response.ok) {
      const errorDetail = await response.json();
      console.error('Airtable Response:', errorDetail);
      throw new Error(`Airtable Error: ${errorDetail.error.message}`);
    }

    const result = await response.json();
    console.log('Airtable Record Updated:', result);
    return result.fields.Status; // Return updated status
  } catch (error) {
    console.error('Error updating Airtable record:', error);
  }
};

const ResultBox = ({
  sql,
  data,
  chart,
  title,
  description,
  onBreadcrumbUpdate,
  reportId,
  onTitleChange,
  status: initialStatus, // Pass the initial status as a prop
}) => {
  const { hasCopied, onCopy } = useClipboard(sql);
  const [chartType, setChartType] = useState('bar');
  const [chartSize, setChartSize] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isVerifyOpen, onOpen: onVerifyOpen, onClose: onVerifyClose } = useDisclosure();
  const { isOpen: isTrainingOpen, onOpen: onTrainingOpen, onClose: onTrainingClose } = useDisclosure();
  const cancelRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableTitle, setEditableTitle] = useState(title);
  const [editableDescription, setEditableDescription] = useState(description);
  const [status, setStatus] = useState(initialStatus); // Track the status in state

  const breadcrumbColor = useColorModeValue('gray.600', 'gray.300');

  const downloadCSV = () => {
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map((row) => Object.values(row).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'report_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getChartComponent = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chart.data}>
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chart.data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {chart.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chart.data}>
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleTitleChange = (value) => {
    setEditableTitle(value);
    updateAirtableRecord(reportId, { 'Report Name': value });
    onTitleChange(value);
  };

  const handleDescriptionChange = (value) => {
    setEditableDescription(value);
    updateAirtableRecord(reportId, { 'Report Description': value });
  };

  const handleStatusChangeToVerified = async () => {
    // Toggle between Verified and Pending
    const newStatus = status === 'Verified' ? 'Pending' : 'Verified';
    const updatedStatus = await updateAirtableRecord(reportId, { Status: newStatus });
    setStatus(updatedStatus); // Update status state immediately
    onVerifyClose();
  };

  const handleStatusChangeToTraining = async () => {
    // Toggle between Training data and Pending
    const newStatus = status === 'Training data' ? 'Pending' : 'Training data';
    const updatedStatus = await updateAirtableRecord(reportId, { Status: newStatus });
    setStatus(updatedStatus); // Update status state immediately
    onTrainingClose();
  };

  const handleTabChange = (index) => {
    const tabNames = ['SQL', 'Data', 'Chart'];
    onBreadcrumbUpdate(tabNames[index]);
  };

  return (
    <Box borderRadius="md" p={4} width="85%" mx="auto">
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color={breadcrumbColor} boxSize="18px" />}
        fontSize="lg"
        color={breadcrumbColor}
        mb={14}
      >
        <BreadcrumbItem>
          <BreadcrumbLink href="/" fontSize="lg">
            Reports
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink fontWeight="semibold" href="/" fontSize="lg">
            {editableTitle || 'Detailed Report'}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <VStack align="start" spacing={4}>
          <Editable
            value={editableTitle}
            fontSize="2xl"
            fontWeight="bold"
            onChange={handleTitleChange}
            placeholder="Click to edit title"
          >
            <Tooltip label="Click to edit the report title" hasArrow>
              <HStack
                spacing={2}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700'), borderRadius: 'md' }}
              >
                <EditablePreview />
                <EditableInput />
                <EditIcon color="gray.500" />
              </HStack>
            </Tooltip>
          </Editable>
          <Editable
            value={editableDescription}
            fontSize="md"
            onChange={handleDescriptionChange}
            placeholder="Click to edit description"
          >
            <Tooltip label="Click to edit the report description" hasArrow>
              <HStack
                spacing={2}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700'), borderRadius: 'md' }}
              >
                <EditablePreview />
                <EditableInput />
                <EditIcon color="gray.500" />
              </HStack>
            </Tooltip>
          </Editable>
        </VStack>
        
        <Flex gap={4}>
  <Tooltip label="View history" hasArrow>
    <IconButton
      icon={<FaClock />}
      size="md"
      aria-label="View History"
      variant="ghost"
      onClick={onOpen}
    />
  </Tooltip>

  {/* Documentation button, enabled only if the status is 'Verified' or 'Training data' */}
  <Tooltip label="View documentation related to this report" hasArrow>
    <IconButton
      icon={<FaBook />}
      size="md"
      aria-label="View Documentation"
      variant="ghost"
      onClick={onTrainingOpen}
      colorScheme={status === 'Training data' ? 'green' : 'yellow'}
      isDisabled={status !== 'Verified' && status !== 'Training data'} // Disable unless status is 'Verified' or 'Training data'
    />
  </Tooltip>

  <Tooltip label="Verify or mark this report for training" hasArrow>
    <IconButton
      icon={<FaShieldAlt />}
      size="md"
      aria-label="Security Info"
      variant="ghost"
      onClick={onVerifyOpen}
      colorScheme={status === 'Verified' || status === 'Training data' ? 'green' : 'yellow'}
    />
  </Tooltip>
</Flex>

      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl">
        <DrawerComponent />
      </Drawer>

      <Tabs onChange={handleTabChange}>
        <TabList>
          <Tab>SQL</Tab>
          <Tab>Data</Tab>
          <Tab>Chart</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box
              bg="gray.900"
              color="white"
              fontFamily="monospace"
              fontSize="sm"
              borderRadius="md"
              overflow="hidden"
              maxHeight="400px"
              position="relative"
            >
              <Box
                overflowY="auto"
                maxHeight="360px"
                p={4}
                bg="gray.900"
                borderRadius="md"
                css={{
                  scrollbarWidth: 'thin',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#555',
                    borderRadius: '8px',
                  },
                }}
              >
                <SyntaxHighlighter
                  language="sql"
                  style={nightOwl}
                  wrapLongLines={true}
                  showLineNumbers
                  customStyle={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    maxWidth: '100%',
                    lineHeight: '1.5',
                  }}
                >
                  {formatSQL(sql)}
                </SyntaxHighlighter>
              </Box>

              <Flex position="absolute" top={2} right={2} gap={2}>
                <IconButton
                  icon={<CopyIcon />}
                  size="sm"
                  aria-label="Copy SQL"
                  bg="gray.700"
                  _hover={{ bg: 'gray.600' }}
                  _active={{ bg: 'gray.500' }}
                  color="white"
                  onClick={onCopy}
                />
              </Flex>
            </Box>
          </TabPanel>

          <TabPanel>
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Text fontSize="lg" fontWeight="bold">
                Data Table
              </Text>
              <Button leftIcon={<DownloadIcon />} onClick={downloadCSV}>
                Download CSV
              </Button>
            </Flex>
            <Table variant="simple">
              <Thead>
                <Tr>
                  {Object.keys(data[0] || {}).map((key) => (
                    <Th key={key}>{key}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {data.map((row, index) => (
                  <Tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <Td key={i}>{value}</Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>

          <TabPanel>
            <Box>
              <Flex justifyContent="end" alignItems="center" mb={4}>
  <HStack spacing={2}>
    <Tooltip label="Reset chart size" hasArrow>
      <IconButton icon={<RepeatIcon />} onClick={() => setChartSize(1)} />
    </Tooltip>
    <Tooltip label="Download chart" hasArrow>
      <IconButton
        icon={<DownloadIcon />}
        onClick={() => alert('Download chart functionality to be implemented')}
      />
    </Tooltip>
    <Tooltip label="Zoom in on chart" hasArrow>
      <IconButton
        icon={<AddIcon />}
        onClick={() => setChartSize((prev) => prev + 0.2)}
      />
    </Tooltip>
    <Tooltip label="Zoom out on chart" hasArrow>
      <IconButton
        icon={<MinusIcon />}
        onClick={() => setChartSize((prev) => (prev > 0.4 ? prev - 0.2 : prev))}
      />
    </Tooltip>
    <Tooltip label="Expand chart to full screen" hasArrow>
      <IconButton icon={<FaExpand />} onClick={openModal} />
    </Tooltip>
    <Menu>
      <Tooltip label="Change chart type" hasArrow>
        <MenuButton as={Button}>
          <HStack>
            {chartType === 'bar' && <FaChartBar />}
            {chartType === 'line' && <FaChartLine />}
            {chartType === 'pie' && <FaChartPie />}
            <Text>
              {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
            </Text>
            <ChevronDownIcon />
          </HStack>
        </MenuButton>
      </Tooltip>
      <MenuList>
        <MenuItem icon={<FaChartBar />} onClick={() => setChartType('bar')}>
          Bar Chart
        </MenuItem>
        <MenuItem icon={<FaChartLine />} onClick={() => setChartType('line')}>
          Line Chart
        </MenuItem>
        <MenuItem icon={<FaChartPie />} onClick={() => setChartType('pie')}>
          Pie Chart
        </MenuItem>
      </MenuList>
    </Menu>
  </HStack>
</Flex>
              <Box transform={`scale(${chartSize})`} transformOrigin="top left">
                {getChartComponent()}
              </Box>

              <Modal isOpen={isModalOpen} onClose={closeModal} size="full">
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Expanded Chart</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>{getChartComponent()}</ModalBody>
                  <ModalFooter>
                    <Button onClick={closeModal}>Close</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <AlertDialog
        isOpen={isVerifyOpen}
        leastDestructiveRef={cancelRef}
        onClose={onVerifyClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Verification
            </AlertDialogHeader>
            <AlertDialogBody>
              {status === 'Verified'
                ? 'This report is already verified. Changing it will update the status to "Pending". Do you want to proceed?'
                : 'Verifying this report will update its status to "Verified". Do you want to proceed?'}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onVerifyClose}
                bg="white"
                border="1px solid"
                borderColor="#32343A"
                color="#32343A"
                _hover={{ bg: '#f7f7f7' }}
                _active={{ bg: '#e2e2e2' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStatusChangeToVerified}
                ml={3}
                bg="#32343A"
                color="white"
                _hover={{ bg: '#2b2d33' }}
                _active={{ bg: '#232529' }}
              >
                {status === 'Verified' ? 'Yes, Change to Pending' : 'Yes, Verify'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isTrainingOpen}
        leastDestructiveRef={cancelRef}
        onClose={onTrainingClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Training Data Status
            </AlertDialogHeader>
            <AlertDialogBody>
              {status === 'Training data'
                ? 'This report is currently marked as "Training data". Changing it will update the status to "Pending". Do you want to proceed?'
                : 'Changing the status to "Training data" will update this report. Do you want to proceed?'}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onTrainingClose}
                bg="white"
                border="1px solid"
                borderColor="#32343A"
                color="#32343A"
                _hover={{ bg: '#f7f7f7' }}
                _active={{ bg: '#e2e2e2' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStatusChangeToTraining}
                ml={3}
                bg="#32343A"
                color="white"
                _hover={{ bg: '#2b2d33' }}
                _active={{ bg: '#232529' }}
              >
                {status === 'Training data' ? 'Yes, Change to Pending' : 'Yes, Change to Training'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

const DetailedPage = ({ report }) => {
  const [breadcrumbItems, setBreadcrumbItems] = useState([{ label: 'Reports', href: '/' }]);
  const [title, setTitle] = useState(report['Report Name'] || 'Detailed Report');

  if (!report) {
    return <Box>No Report Data Available</Box>;
  }

  const sqlQuery = report['SQL Query'] || 'No SQL Query Available';
  const tableData = report.data || [];
  const chartConfig = {
    data: tableData.map((row) => ({
      name: row.name || 'Unnamed',
      value: row.value || 0,
    })),
  };

  const handleBreadcrumbUpdate = (currentTab) => {
    setBreadcrumbItems([
      { label: 'Reports', href: '/' },
      { label: title, href: '#' },
      { label: currentTab, href: '#' },
    ]);
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    setBreadcrumbItems((prevItems) => [
      { label: 'Reports', href: '/' },
      { label: newTitle, href: '#' },
    ]);
  };

  return (
    <main className="flex-grow p-4">
      <ResultBox
        sql={sqlQuery}
        data={tableData}
        chart={chartConfig}
        title={title}
        description={report['Report Description'] || 'This is a detailed analysis report.'}
        onBreadcrumbUpdate={handleBreadcrumbUpdate}
        reportId={report.id}
        onTitleChange={handleTitleChange}
        status={report.Status} // Pass the status of the report to ResultBox
      />
    </main>
  );
};

export default DetailedPage;
