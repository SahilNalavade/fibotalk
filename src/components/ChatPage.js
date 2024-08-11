import React, { useState } from 'react';
import {
  Box,
  Heading,
  Flex,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  Container,
  Divider,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useClipboard,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import { ArrowForwardIcon, CheckIcon, CloseIcon, CopyIcon, DownloadIcon, RepeatIcon, AddIcon, MinusIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import TopNav from './TopNav';
import SideNav from './SideNav';
import { useAuth } from '../auth';

// Register all necessary elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ExamplePrompt = ({ text, onClick }) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="md"
      cursor="pointer"
      bg={bgColor}
      _hover={{ bg: hoverBgColor }}
      onClick={onClick}
    >
      <Text>{text}</Text>
    </Box>
  );
};

const ChatMessage = ({ message, isUser }) => {
  const bgColor = useColorModeValue(isUser ? 'blue.100' : 'gray.100', isUser ? 'blue.700' : 'gray.700');
  const color = useColorModeValue(isUser ? 'blue.700' : 'gray.700', isUser ? 'white' : 'white');

  return (
    <Box
      alignSelf={isUser ? 'flex-end' : 'flex-start'}
      bg={bgColor}
      color={color}
      p={3}
      borderRadius="lg"
      maxW="70%"
    >
      <Text>{message}</Text>
    </Box>
  );
};

const ResultBox = ({ sql, data, chart }) => {
  const { hasCopied, onCopy } = useClipboard(sql);
  const [chartType, setChartType] = useState('bar');
  const [chartSize, setChartSize] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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
        return <Line data={chart.data} options={chart.options} />;
      case 'pie':
        return <Pie data={chart.data} options={chart.options} />;
      default:
        return <Bar data={chart.data} options={chart.options} />;
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Box borderWidth={1} borderRadius="md" p={4}>
      <Tabs>
      <TabList>
  <Tab>SQL</Tab>
  <Tab>Data</Tab>
  <Tab>Chart</Tab>
  <Button 
  ml="auto" 
  onClick={onOpen} 
  leftIcon={<ExternalLinkIcon />} 
  size="sm"  // Decrease button size
  bg={'#1a202c'}  // Dark charcoal color
  color={'#fff'}
  variant="solid"  // Ensure it's a solid button
  _hover={{ bg: '#2d3748' }}  // Slightly lighter on hover
>
  Save
</Button>


</TabList>

        <TabPanels>
        <TabPanel>
      <Box
        position="relative"
        bg="gray.900"         // Dark background resembling a SQL editor
        color="white"         // White font color for better contrast
        fontFamily="monospace" // Monospace font for code
        fontSize="sm"         // Smaller font size to mimic code editors
        p={4}                 // Padding around the text for better readability
        borderRadius="md"     // Rounded corners for a neat look
        overflowX="auto"      // Handle long lines by allowing horizontal scrolling
      >
        <pre>{sql}</pre>
        <IconButton
          icon={<CopyIcon />}
          position="absolute"
          top={2}
          right={2}
          onClick={onCopy}
          size="sm"
          aria-label="Copy SQL"
          bg="gray.700"
          _hover={{ bg: "gray.600" }} // Slightly lighter on hover
          _active={{ bg: "gray.500" }} // Active state for the button
          color="white"                // Button color to match the theme
        />
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
              <Flex justifyContent="space-between" alignItems="center" mb={4}>
                <Select value={chartType} onChange={(e) => setChartType(e.target.value)} width="200px">
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                </Select>
                <HStack spacing={2}>
                  <IconButton icon={<RepeatIcon />} onClick={() => setChartSize(1)} />
                  <IconButton icon={<AddIcon />} onClick={() => setChartSize(prev => prev + 0.2)} />
                  <IconButton icon={<MinusIcon />} onClick={() => setChartSize(prev => prev > 0.4 ? prev - 0.2 : prev)} />
                  <IconButton icon={<ExternalLinkIcon />} onClick={openModal} />
                  <Button
                    leftIcon={<DownloadIcon />}
                    onClick={() => alert('Download chart functionality to be implemented')}
                  >
                    Download Chart
                  </Button>
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

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Save Result</DrawerHeader>

          <DrawerBody>
            <FormControl id="title">
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a title" />
            </FormControl>

            <FormControl id="description" mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter a description" />
            </FormControl>

            <Tabs mt={4}>
              <TabList>
                <Tab>SQL</Tab>
                <Tab>Data</Tab>
                <Tab>Chart</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Box position="relative">
                    <pre>{sql}</pre>
                    <IconButton
                      icon={<CopyIcon />}
                      position="absolute"
                      top={2}
                      right={2}
                      onClick={onCopy}
                    />
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
                    {getChartComponent()}
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

const ChatPage = () => {
  const { isSignedIn } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState(false);
  const [currentSteps, setCurrentSteps] = useState([]);
  const [result, setResult] = useState(null);

  const examplePrompts = [
    "How do I make a chocolate cake?",
    "What's the best way to learn a new language?",
    "Can you explain quantum computing?",
  ];

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    setMessages([...messages, { text: inputValue, isUser: true }]);
    setInputValue('');

    // Simulate GPT response with steps
    setTimeout(() => {
      const steps = [
        "Research recipes for chocolate cake",
        "Gather ingredients",
        "Preheat the oven",
        "Mix dry ingredients",
        "Mix wet ingredients",
        "Combine wet and dry ingredients",
        "Pour batter into cake pan",
        "Bake the cake",
        "Let it cool and frost",
      ];
      setCurrentSteps(steps);
      setMessages(prev => [...prev, { text: "Here are the steps I'll take:", isUser: false }]);
      setIsWaitingForConfirmation(true);
    }, 1000);
  };

  const handleConfirmation = (confirmed) => {
    setIsWaitingForConfirmation(false);
    if (confirmed) {
      // Simulate generating a result
      const simulatedResult = {
        sql: "SELECT * FROM cakes WHERE deliciousness > 9000;",
        data: [
          { id: 1, name: "Super Chocolate Cake", deliciousness: 9001 },
          { id: 2, name: "Vanilla Cake", deliciousness: 8500 },
          { id: 3, name: "Strawberry Cake", deliciousness: 8000 },
        ],
        chart: {
          data: {
            labels: ['Chocolate Cake', 'Vanilla Cake', 'Strawberry Cake'],
            datasets: [
              {
                label: 'Deliciousness Level',
                data: [9001, 8500, 8000],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Cake Deliciousness',
              },
            },
          },
        },
      };
      setResult(simulatedResult);
      setMessages(prev => [
        ...prev,
        { text: "Great! Here's the result:", isUser: false },
      ]);
    } else {
      setMessages(prev => [...prev, { text: "I understand. Could you provide more details or clarify your request?", isUser: false }]);
    }
    setCurrentSteps([]);
  };

  return (
    <div className="Dashboard flex flex-col h-screen">
      <TopNav />
      <div className="flex flex-grow overflow-hidden">
        <SideNav />
        <main className="flex-grow p-4" style={{ paddingTop: '64px' }}>
          <Container maxW="container.xl" h="full">
            <VStack spacing={6} h="full">
              <Heading as="h1" size="xl">Chat with GPT</Heading>
              
              <HStack w="full" spacing={4}>
                {examplePrompts.map((prompt, index) => (
                  <ExamplePrompt
                    key={index}
                    text={prompt}
                    onClick={() => setInputValue(prompt)}
                  />
                ))}
              </HStack>
              
              <Divider />
              
              <VStack
                flex={1}
                w="full"
                overflowY="auto"
                spacing={4}
                alignItems="stretch"
                pb={4}
              >
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message.text} isUser={message.isUser} />
                ))}
                {isWaitingForConfirmation && (
                  <HStack justifyContent="center">
                    <Text>Are these steps correct?</Text>
                    <IconButton
                      icon={<CheckIcon />}
                      colorScheme="green"
                      onClick={() => handleConfirmation(true)}
                    />
                    <IconButton
                      icon={<CloseIcon />}
                      colorScheme="red"
                      onClick={() => handleConfirmation(false)}
                    />
                  </HStack>
                )}
                {result && <ResultBox sql={result.sql} data={result.data} chart={result.chart} />}
              </VStack>
              
              <HStack as="form" w="full" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message here..."
                  size="lg"
                />
                <Button
                  colorScheme="blue"
                  onClick={handleSend}
                  isDisabled={inputValue.trim() === '' || isWaitingForConfirmation}
                  rightIcon={<ArrowForwardIcon />}
                >
                  Send
                </Button>
              </HStack>
            </VStack>
          </Container>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
