import React, { useState } from 'react';
import {
  Box,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Flex,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  IconButton,
  Tooltip,
  Select,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { FaThList, FaTh, FaSync, FaTrash } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import TopNav from './TopNav';
import SideNav from './SideNav';
import { useAuth } from '../auth'; // Adjust path if necessary

const sampleReports = [
  { 
    name: "Q1 Financial Report", 
    requestedBy: "John Doe",
    pendingSince: "2023-03-31", 
    description: "Financial performance overview for Q1.",
    status: "Pending",
    type: "line",
    data: [
      {name: 'Jan', value: 4000},
      {name: 'Feb', value: 3000},
      {name: 'Mar', value: 5000},
    ]
  },
  { 
    name: "Customer Satisfaction Survey", 
    requestedBy: "Jane Smith",
    pendingSince: "2023-04-15", 
    description: "Survey results on customer satisfaction.",
    status: "Pending",
    type: "bar",
    data: [
      {name: 'Product A', value: 400},
      {name: 'Product B', value: 300},
      {name: 'Product C', value: 500},
    ]
  },
  { 
    name: "Product Performance Analysis", 
    requestedBy: "Mike Johnson",
    pendingSince: "2023-05-01", 
    description: "Analysis of product performance.",
    status: "Pending",
    type: "pie",
    data: [
      { name: 'Group A', value: 400 },
      { name: 'Group B', value: 300 },
      { name: 'Group C', value: 300 },
    ]
  },
  { 
    name: "Year-End Financial Report", 
    requestedBy: "Alice Brown",
    pendingSince: "2023-12-31", 
    description: "Year-end financial performance overview.",
    status: "Completed",
    type: "line",
    data: [
      {name: 'Oct', value: 7000},
      {name: 'Nov', value: 8000},
      {name: 'Dec', value: 9000},
    ]
  },
  { 
    name: "Employee Satisfaction Survey", 
    requestedBy: "David Wilson",
    pendingSince: "2023-11-30", 
    description: "Survey results on employee satisfaction.",
    status: "Completed",
    type: "bar",
    data: [
      {name: 'Department A', value: 450},
      {name: 'Department B', value: 350},
      {name: 'Department C', value: 400},
    ]
  },
  { 
    name: "Mid-Year Training Data Report", 
    requestedBy: "Sarah Connor",
    pendingSince: "2023-06-30", 
    description: "Analysis of training data.",
    status: "In Progress",
    type: "pie",
    data: [
      { name: 'Group A', value: 600 },
      { name: 'Group B', value: 300 },
      { name: 'Group C', value: 100 },
    ]
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ReportChart = ({ report, selectedChartType }) => {
  switch (selectedChartType) {
    case 'line':
      return (
        <LineChart width={400} height={200} data={report.data}>
          <XAxis dataKey="name" />
          <YAxis />
          <RechartsTooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      );
    case 'bar':
      return (
        <BarChart width={400} height={200} data={report.data}>
          <XAxis dataKey="name" />
          <YAxis />
          <RechartsTooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      );
    case 'pie':
      return (
        <PieChart width={400} height={200}>
          <Pie
            data={report.data}
            cx={200}
            cy={100}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {report.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip />
        </PieChart>
      );
    default:
      return null;
  }
};

const ReportTiles = ({ reports }) => {
  const [selectedChartTypes, setSelectedChartTypes] = useState(reports.map(report => report.type));

  const handleChartTypeChange = (index, value) => {
    const newSelectedChartTypes = [...selectedChartTypes];
    newSelectedChartTypes[index] = value;
    setSelectedChartTypes(newSelectedChartTypes);
  };

  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={4}>
      {reports.map((report, index) => (
        <Box 
          key={index} 
          p={4} 
          borderWidth={1} 
          borderRadius="md" 
          shadow="sm" 
          position="relative"
          _hover={{ 
            '& .tile-actions': {
              opacity: 1,
            }
          }}
        >
          <VStack align="start" spacing={2}>
            <Heading size="md">{report.name}</Heading>
            <Text fontSize="sm">Date: {report.pendingSince}</Text>
            <Badge
              colorScheme={
                report.status === "Completed"
                  ? "green"
                  : report.status === "In Progress"
                  ? "yellow"
                  : "red"
              }
            >
              {report.status}
            </Badge>
            <Select
              mt={2}
              size="sm"
              value={selectedChartTypes[index]}
              onChange={(e) => handleChartTypeChange(index, e.target.value)}
              width="auto"
              alignSelf="flex-end"
            >
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="pie">Pie</option>
            </Select>
            <Box>
              <ReportChart
                report={report}
                selectedChartType={selectedChartTypes[index]}
              />
            </Box>
          </VStack>
          <HStack 
            spacing={2} 
            position="absolute" 
            top={2} 
            right={2} 
            opacity={0} 
            className="tile-actions" 
            transition="opacity 0.3s ease"
          >
            <Tooltip label="Refresh" aria-label="Refresh">
              <IconButton icon={<FaSync />} aria-label="Refresh" size="sm" variant="ghost" />
            </Tooltip>
            <Tooltip label="Delete" aria-label="Delete" >
              <IconButton icon={<FaTrash />} aria-label="Delete" size="sm" variant="ghost" colorScheme='red' />
            </Tooltip>
          </HStack>
        </Box>
      ))}
    </SimpleGrid>
  );
};

const ReportTab = ({ title, reports }) => {
  const [isListView, setIsListView] = useState(true);
  const activeColor = useColorModeValue('blue.500', 'blue.200');
  const inactiveColor = useColorModeValue('gray.400', 'gray.600');

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">{title}</Heading>
        <Flex>
          <Tooltip label="List view">
            <IconButton icon={<FaThList />} aria-label="List view" mr={2} onClick={() => setIsListView(true)} color={isListView ? activeColor : inactiveColor} variant="ghost" />
          </Tooltip>
          <Tooltip label="Grid view">
            <IconButton icon={<FaTh />} aria-label="Grid view" onClick={() => setIsListView(false)} color={!isListView ? activeColor : inactiveColor} variant="ghost" />
          </Tooltip>
        </Flex>
      </Flex>
      {isListView ? <ReportList reports={reports} /> : <ReportTiles reports={reports} />}
    </Box>
  );
};

const ReportList = ({ reports }) => {
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Report Name</Th>
          <Th>Requested By</Th>
          <Th>Pending Since</Th>
          <Th>Short Description</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {reports.map((report, index) => (
          <Tr key={index} _hover={{ backgroundColor: hoverBgColor }} sx={{ '& .report-actions': { opacity: 0, transition: 'opacity 0.3s ease' }, '&:hover .report-actions': { opacity: 1 } }}>
            <Td>{report.name}</Td>
            <Td>{report.requestedBy}</Td>
            <Td>{report.pendingSince}</Td>
            <Td>{report.description}</Td>
            <Td>
              <HStack spacing={2} justifyContent="flex-end" className="report-actions">
                <Tooltip label="Refresh" aria-label="Refresh">
                  <IconButton icon={<FaSync />} aria-label="Refresh" size="sm" variant="ghost" />
                </Tooltip>
                <Tooltip label="Delete" aria-label="Delete">
                  <IconButton icon={<FaTrash />} aria-label="Delete" size="sm" variant="ghost" colorScheme='red' />
                </Tooltip>
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

const Reports = () => {
  const { isSignedIn } = useAuth(); // Check if the user is signed in
  const bgColor = useColorModeValue('white', 'gray.800');

  const pendingReports = sampleReports.filter(report => report.status === 'Pending').slice(0, 3);
  const verifiedReports = sampleReports.filter(report => report.status === 'Completed').slice(0, 2);
  const trainingDataReports = sampleReports.filter(report => report.status === 'In Progress').slice(0, 1);

  return (
    <div className="Dashboard flex flex-col h-screen">
      <TopNav />
      <div className="flex flex-grow overflow-hidden">
        <SideNav />
        <main className="flex-grow p-4" style={{ paddingTop: '64px' }}>
          <Box bg={bgColor} p={4} rounded="md" shadow="sm">
            <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#">Reports</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            <Heading as="h1" size="xl" mt={4} mb={6}>Reports</Heading>

            <Tabs colorScheme="blue" isLazy>
              <TabList>
                <Tab>
                  <Flex alignItems="center">
                    Pending
                    <Badge ml={2} colorScheme="blue" borderRadius={9}>{pendingReports.length}</Badge>
                  </Flex>
                </Tab>
                <Tab>
                  <Flex alignItems="center">
                    Verified
                    <Badge ml={2} colorScheme="blue" borderRadius={9}>{verifiedReports.length}</Badge>
                  </Flex>
                </Tab>
                <Tab>
                  <Flex alignItems="center">
                    Training Data
                    <Badge ml={2} colorScheme="blue" borderRadius={9}>{trainingDataReports.length}</Badge>
                  </Flex>
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <ReportTab title="Pending Reports" reports={pendingReports} />
                </TabPanel>
                <TabPanel>
                  <ReportTab title="Verified Reports" reports={verifiedReports} />
                </TabPanel>
                <TabPanel>
                  <ReportTab title="Training Data Reports" reports={trainingDataReports} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </main>
      </div>
    </div>
  );
};

export default Reports;
