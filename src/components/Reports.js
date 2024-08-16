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
  TableContainer,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { FaThList, FaTh, FaSync, FaTrash } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import TopNav from './TopNav';
import SideNav from './SideNav';
import { useAuth } from '../auth';
import DetailedPage from './DetailedPage';

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

const ReportTiles = ({ reports, onReportClick }) => {
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
          onClick={() => onReportClick(report)}
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

const ReportTab = ({ title, reports, onBreadcrumbUpdate }) => {
  const [isListView, setIsListView] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const activeColor = useColorModeValue('blue.500', 'blue.200');
  const inactiveColor = useColorModeValue('gray.400', 'gray.600');

  const handleReportClick = (report) => {
    setSelectedReport(report);
    onBreadcrumbUpdate(report.name);
  };

  return (
    <Box>
      {selectedReport ? (
        <DetailedPage report={selectedReport} />
      ) : (
        <>
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
          {isListView ? (
            <ReportList reports={reports} onReportClick={handleReportClick} />
          ) : (
            <ReportTiles reports={reports} onReportClick={handleReportClick} />
          )}
        </>
      )}
    </Box>
  );
};

const ReportList = ({ reports, onReportClick }) => {
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <TableContainer boxShadow="lg" borderRadius="lg">
      <Table variant="simple" size="md">
        <Thead bg="gray.100">
          <Tr>
            <Th fontSize="md">Report Name</Th>
            <Th fontSize="md">Requested By</Th>
            <Th fontSize="md">Pending Since</Th>
            <Th fontSize="md">Short Description</Th>
            <Th fontSize="md"></Th>
          </Tr>
        </Thead>
        <Tbody>
          {reports.map((report, index) => (
            <Tr
              key={index}
              _hover={{ bg: hoverBgColor, cursor: 'pointer' }}
              transition="all 0.2s"
              sx={{
                '& .report-actions': { opacity: 0, transition: 'opacity 0.3s ease' },
                '&:hover .report-actions': { opacity: 1 },
              }}
              onClick={() => onReportClick(report)}
            >
              <Td fontWeight="medium">
                <LinkBox>
                  <LinkOverlay href="#" onClick={(e) => e.preventDefault()}>{report.name}</LinkOverlay>
                </LinkBox>
              </Td>
              <Td>{report.requestedBy}</Td>
              <Td>
                <Text fontSize="sm" color="gray.600">
                  {report.pendingSince}
                </Text>
              </Td>
              <Td>
                <Text fontSize="sm" color="gray.600">
                  {report.description}
                </Text>
              </Td>
              <Td>
                <HStack spacing={2} justifyContent="flex-end" className="report-actions">
                  <Tooltip label="Refresh" aria-label="Refresh">
                    <IconButton
                      icon={<FaSync />}
                      aria-label="Refresh"
                      size="sm"
                      variant="ghost"
                    />
                  </Tooltip>
                  <Tooltip label="Delete" aria-label="Delete">
                    <IconButton
                      icon={<FaTrash />}
                      aria-label="Delete"
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                    />
                  </Tooltip>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const Reports = () => {
  const { isSignedIn } = useAuth(); // Check if the user is signed in
  const bgColor = useColorModeValue('white', 'gray.800');
  const breadcrumbColor = useColorModeValue('gray.600', 'gray.300');

  // State to manage the current breadcrumb
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { label: 'Reports', href: '/reports' },
  ]);

  const pendingReports = sampleReports.filter(report => report.status === 'Pending').slice(0, 3);
  const verifiedReports = sampleReports.filter(report => report.status === 'Completed').slice(0, 2);
  const trainingDataReports = sampleReports.filter(report => report.status === 'In Progress').slice(0, 1);

  const handleTabChange = (index) => {
    const tabLabels = ['Pending', 'Verified', 'Training Data'];
    setBreadcrumbItems([
      { label: 'Reports', href: '/reports' },
      { label: tabLabels[index], href: '/reports' },
    ]);
  };

  const handleBreadcrumbUpdate = (reportName) => {
    setBreadcrumbItems((prevItems) => [
      ...prevItems,
      { label: reportName, href: '#' },
    ]);
  };

  return (
    <div className="Dashboard flex flex-col h-screen">
      <TopNav />
      <div className="flex flex-grow overflow-hidden">
        <SideNav />
        <main className="flex-grow p-4" style={{ paddingTop: '105px' }}>
          <Box maxWidth="90%" mx="auto" rounded="md">
            <Box mt={4}>
              <Breadcrumb
                spacing="8px"
                separator={<ChevronRightIcon color={breadcrumbColor} boxSize="18px" />}
                fontSize="lg"
                color={breadcrumbColor}
                mb={14}
              >
                {breadcrumbItems.map((item, index) => (
                  <BreadcrumbItem key={index} isCurrentPage={index === breadcrumbItems.length - 1}>
                    {index === breadcrumbItems.length - 1 ? (
                      <Text fontWeight="semibold" fontSize="lg">{item.label}</Text>
                    ) : (
                      item.href ? (
                        <BreadcrumbLink href={item.href} fontSize="lg">{item.label}</BreadcrumbLink>
                      ) : (
                        <Text fontSize="lg">{item.label}</Text>
                      )
                    )}
                  </BreadcrumbItem>
                ))}
              </Breadcrumb>
            </Box>

            <Tabs colorScheme="blue" isLazy onChange={handleTabChange}>
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
                  <ReportTab reports={pendingReports} onBreadcrumbUpdate={handleBreadcrumbUpdate} />
                </TabPanel>
                <TabPanel>
                  <ReportTab reports={verifiedReports} onBreadcrumbUpdate={handleBreadcrumbUpdate} />
                </TabPanel>
                <TabPanel>
                  <ReportTab reports={trainingDataReports} onBreadcrumbUpdate={handleBreadcrumbUpdate} />
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
