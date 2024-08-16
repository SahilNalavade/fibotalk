import React, { useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  IconButton,
  useDisclosure,
  Drawer,
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
  Select,
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
} from '@chakra-ui/react';
import { EditIcon, CopyIcon, DownloadIcon, RepeatIcon, AddIcon, MinusIcon, ExternalLinkIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FaClock, FaShieldAlt, FaBook, FaExpand, FaChartBar, FaChartLine, FaChartPie } from 'react-icons/fa'; // Updated to use FaArrowsAlt instead of FaExpand
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TopNav from './TopNav';
import SideNav from './SideNav';
import { useAuth } from '../auth';
import DrawerComponent from './DrawerComponent';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const ResultBox = ({ sql, data, chart }) => {
  const { hasCopied, onCopy } = useClipboard(sql);
  const [chartType, setChartType] = useState('bar');
  const [chartSize, setChartSize] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState('Monthly CLV Trend Analysis');
  const [description, setDescription] = useState('This is the monthly trend report for CLV over the last 5 months.');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const downloadCSV = () => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'table_data.csv');
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
              <Tooltip />
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
              <Tooltip />
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
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Box borderRadius="md" p={2} width={'85%'} mx="auto" >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <VStack align="start" spacing={4}>
          <Editable
            value={title}
            onChange={(value) => setTitle(value)}
            fontSize="2xl"
            fontWeight="bold"
          >
            <EditablePreview />
            <EditableInput />
            <IconButton
              icon={<EditIcon />}
              size="sm"
              ml={2}
              aria-label="Edit Title"
              variant="ghost"
            />
          </Editable>
          <Editable
            value={description}
            onChange={(value) => setDescription(value)}
            fontSize="md"
          >
            <EditablePreview />
            <EditableInput />
            <IconButton
              icon={<EditIcon />}
              size="sm"
              ml={2}
              aria-label="Edit Description"
              variant="ghost"
            />
          </Editable>
        </VStack>
        <Flex gap={4}>
          <IconButton
            icon={<FaClock />}
            size="md"
            aria-label="View History"
            variant="ghost"
            onClick={onOpen}
          />
          <IconButton
            icon={<FaBook />}
            size="md"
            aria-label="View Documentation"
            variant="ghost"
          />
          <IconButton
            icon={<FaShieldAlt />}
            size="md"
            aria-label="Security Info"
            variant="ghost"
          />
        </Flex>
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={'xl'}>
        <DrawerComponent />
      </Drawer>

      <Tabs>
        <TabList>
          <Tab>SQL</Tab>
          <Tab>Data</Tab>
          <Tab>Chart</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box
              position="relative"
              bg="gray.900"
              color="white"
              fontFamily="monospace"
              fontSize="sm"
              p={4}
              borderRadius="md"
              overflowX="auto"
              textAlign="left"
            >
              <pre>{sql}</pre>

              <Flex position="absolute" top={2} right={2} gap={2}>
                <IconButton
                  icon={<EditIcon />}
                  size="sm"
                  bg="gray.700"
                  color={'#fff'}
                  variant="solid"
                  _hover={{ bg: '#2d3748' }}
                  aria-label="Edit"
                />
                <IconButton
                  icon={<CopyIcon />}
                  size="sm"
                  aria-label="Copy SQL"
                  bg="gray.700"
                  _hover={{ bg: "gray.600" }}
                  _active={{ bg: "gray.500" }}
                  color="white"
                  onClick={onCopy}
                />
              </Flex>
            </Box>
          </TabPanel>

          <TabPanel>
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Text fontSize="lg" fontWeight="bold">Data Table</Text>
              <Button
                leftIcon={<DownloadIcon />}
                onClick={downloadCSV}
              >
                Download CSV
              </Button>
            </Flex>
            <Table variant="simple">
              <Thead>
                <Tr>
                  {Object.keys(data[0]).map((key) => (
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
                  <IconButton icon={<RepeatIcon />} onClick={() => setChartSize(1)} />
                  <IconButton icon={<DownloadIcon />} onClick={() => alert('Download chart functionality to be implemented')} />
                  <IconButton icon={<AddIcon />} onClick={() => setChartSize((prev) => prev + 0.2)} />
                  <IconButton icon={<MinusIcon />} onClick={() => setChartSize((prev) => (prev > 0.4 ? prev - 0.2 : prev))} />
                  <IconButton icon={<FaExpand />} onClick={openModal} /> {/* Updated icon */}
                  <Menu>
                    <MenuButton as={Button}>
                      <HStack>
                        {chartType === 'bar' && <FaChartBar />}
                        {chartType === 'line' && <FaChartLine />}
                        {chartType === 'pie' && <FaChartPie />}
                        <Text>{chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart</Text>
                        <ChevronDownIcon /> {/* Adding the down chevron icon */}
                      </HStack>
                    </MenuButton>
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
                  <ModalBody>
                    {getChartComponent()}
                  </ModalBody>
                  <ModalFooter>
                    <Button onClick={closeModal}>Close</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

const DetailedPage = () => {
  const { isSignedIn } = useAuth();

  const sqlQuery = `
    SELECT c.id, c.title
    FROM chats c
    INNER JOIN (
      SELECT chat_id, COUNT(*) AS message_count
      FROM messages
      GROUP BY chat_id
    ) m ON c.id = m.chat_id
    WHERE m.message_count >= 4;
  `;

  const tableData = [
    { id: 1, name: "Sample Data 1", value: 100 },
    { id: 2, name: "Sample Data 2", value: 200 },
    { id: 3, name: "Sample Data 3", value: 300 },
  ];

  const chartConfig = {
    data: [
      { name: 'Sample Data 1', value: 100 },
      { name: 'Sample Data 2', value: 200 },
      { name: 'Sample Data 3', value: 300 },
    ]
  };

  return (
 
        <main className="flex-grow p-4" >
          <ResultBox
            sql={sqlQuery}
            data={tableData}
            chart={chartConfig}
          />
        </main>
  );
};

export default DetailedPage;
