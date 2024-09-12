import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  Container,
  Heading,
  UnorderedList,
  ListItem,
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
  Image,
  Center,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  RepeatIcon,
  AddIcon,
  MinusIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons';
import {
  FaPencilAlt,
  FaThumbsDown,
  FaThumbsUp,
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
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import TopNav from './TopNav';
import SideNav from './SideNav';
import { useAuth } from '../auth';
import { UserButton } from '@clerk/clerk-react';
import ErrorBoundary from './ErrorBoundry';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco ,nightOwl} from 'react-syntax-highlighter/dist/esm/styles/hljs'; // You can change this to another theme like 'atom-one-dark' or 'github'
import { useNavigate } from 'react-router-dom';

// Airtable integration function
const sendToAirtable = async (data) => {
  const AIRTABLE_PAT = 'pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89';
  const AIRTABLE_BASE_ID = 'app4ZQ9jav2XzNIv9';
  const AIRTABLE_TABLE_NAME = 'Conversation'; // Replace with your Airtable Table Name

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

  try {
    const fetchResponse = await fetch(`${url}?sort[0][field]=Message ID&sort[0][direction]=desc&maxRecords=1`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
      },
    });

    const fetchData = await fetchResponse.json();
    let newSerialNumber = 1;

    if (fetchData.records && fetchData.records.length > 0) {
      const lastSerialNumber = fetchData.records[0].fields['Message ID'];
      newSerialNumber = lastSerialNumber + 1;
    }

    const body = {
      fields: {
        "Message ID": newSerialNumber, // This will act as the message ID
        "Organisation ID": String(data.organisationId || '').trim(),
        "Report ID": String(data.reportId || '').trim(),
        "User ID": String(data.userId || '').trim(),
        "Message": String(data.message || '').trim(),
        "Message User Type": String(data.messageUserType || '').trim(),
        "Message Type": String(data.messageType || '').trim(),
        "CreatedAt": new Date().toISOString(),
        "UpdatedAt": new Date().toISOString(),
        "Verification Status": "Pending",
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorDetail = await response.json();
      console.error('Airtable Response:', errorDetail);
      throw new Error(`Airtable Error: ${errorDetail.error.message}`);
    }

    const result = await response.json();
    console.log('Airtable Record Created:', result);
  } catch (error) {
    console.error('Error sending data to Airtable:', error);
  }
};


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

const ChatMessage = ({ message, isUser, onEdit }) => {
  const bgColor = useColorModeValue(isUser ? 'transparent' : 'white', isUser ? 'blue.700' : 'gray.700');
  const borderColor = useColorModeValue(isUser ? 'transparent' : '#E2E8F0', isUser ? 'blue.700' : 'gray.700');
  const color = useColorModeValue(isUser ? 'black' : 'gray.700', isUser ? 'white' : 'white');
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onEdit(editedMessage);
    setIsEditing(false);
  };

  // Function to render formatted message content
  const formattedMessage = () => {
    const cleanedMessage = cleanMessage(message);
    const lines = cleanedMessage.split('\n');
    const elements = lines.map((line, index) => {
      if (/^\d+\.\s/.test(line)) {
        // Step numbers
        return (
          <Text key={`step-${index}`} fontWeight="bold" color="blue.500">
            {line}
          </Text>
        );
      }
      if (line.startsWith('Pseudocode:')) {
        // Pseudocode section
        return (
          <Heading as="h5" size="sm" mt={4} mb={2} color="teal.500" key={`heading-${index}`}>
            {line}
          </Heading>
        );
      }
      if (/```/.test(line)) {
        // Render code blocks with syntax highlighter
        const code = lines.slice(index + 1, lines.indexOf('```', index + 1)).join('\n');
        return (
          <Box key={`code-${index}`} overflowX="auto" maxWidth="100%">
          <SyntaxHighlighter
            key={`code-${index}`}
            language="plaintext"
            style={docco}
            showLineNumbers
            wrapLines
          >
            {code}
          </SyntaxHighlighter>
          </Box>
        );
      }
      return (
        <Text key={`text-${index}`} color="gray.700">
          {line}
        </Text>
      );
    });
    return elements;
  };

  return (
    <HStack
      alignSelf={isUser ? 'flex-end' : 'flex-start'}
      spacing={3}
      w="full"
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
    >
      {!isUser && (
        <Box position="relative" maxW="80%">
          <Image
            borderRadius="full"
            boxSize="28px"
            src="/response_profile_pic.png"
            alt="Profile Pic"
            position="absolute"
            top="4"
            left="0"
          />
          <Box
            bg={bgColor}
            color={color}
            border={'solid'}
            borderColor={borderColor}
            p={3}
            borderRadius="lg"
            ml="50px"
            mt="10px"
            w="full"
            textAlign="left"
          >
            <VStack align="start" spacing={4}>
              {isEditing ? (
                <Input
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  size="sm"
                  w="full"
                />
              ) : (
                formattedMessage()
              )}
            </VStack>
          </Box>
        </Box>
      )}
      {isUser && (
        <Box
          bg={bgColor}
          color={color}
          border={'solid'}
          borderColor={borderColor}
          p={3}
          borderRadius="lg"
          ml="auto"
          maxW="80%"
          textAlign="right"
        >
          <HStack justify="flex-end">
            {isEditing ? (
              <Input
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                size="sm"
                w="full"
              />
            ) : (
              <Text whiteSpace="pre-wrap">{message}</Text>
            )}
            <HStack spacing={2}>
              <IconButton
                icon={isEditing ? <CheckIcon /> : <FaPencilAlt />}
                size="sm"
                bg="transparent"
                onClick={isEditing ? handleSaveClick : handleEditClick}
                aria-label={isEditing ? 'Save' : 'Edit'}
                _hover={{ bg: 'transparent' }}
                _active={{ bg: 'transparent' }}
              />
            </HStack>
          </HStack>
        </Box>
      )}
    </HStack>
  );
};

// ResultBox component
const ResultBox = ({ sql, data, chart }) => {
  const navigate = useNavigate(); // Initialize the navigate hook

  const { hasCopied, onCopy } = useClipboard(sql);
  const [chartType, setChartType] = useState('bar');
  const [chartSize, setChartSize] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(''); // State to hold validation errors
  const maxDescriptionLength = 100; // Maximum character limit for description

  const downloadCSV = () => {
    if (!data || data.length === 0) {
      console.error('No data available to download.');
      return;
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row) => Object.values(row).join(',')).join('\n');
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
    if (!data || data.length === 0) {
      return <Text>No data available for the chart.</Text>;
    }

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="deliciousness" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="deliciousness"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chart.colors[index % chart.colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="deliciousness" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Save button handler
  const saveResult = async () => {
    // Collect data to save
    // Validate required fields
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    if (!description.trim()) {
      setError('Description is required.');
      return;
    }

    if (description.length > maxDescriptionLength) {
      setError(`Description must be less than ${maxDescriptionLength} characters.`);
      return;
    }
    const resultData = {
      "Organisation ID": 'ORG123', // Replace with actual Organisation ID
      "Report ID": 'RPT456', // Replace with actual Report ID
      "User ID": 'test@gmail.com', // Replace with actual User ID
      "Message ID": 'MSG789', // Replace with actual Message ID
      "Report Name": title, // Report name entered by the user
      "Report Description": description, // Report description entered by the user
      "SQL Query": sql, // The SQL query generated by the application
      "Created At": new Date().toISOString(), // Timestamp for when the report was created
      "Updated At": new Date().toISOString(), // Timestamp for when the report was last updated
      "Status": 'Pending', // Status of the report, can be modified based on the application logic
    };

    // Airtable configuration
    const AIRTABLE_PAT = 'pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89';
    const AIRTABLE_BASE_ID = 'app4ZQ9jav2XzNIv9';
    const AIRTABLE_TABLE_NAME = 'SavedReports'; // Replace with your target Airtable Table Name

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

    // Send data to Airtable
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_PAT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields: resultData }),
      });

      if (!response.ok) {
        const errorDetail = await response.json();
        console.error('Airtable Response:', errorDetail);
        throw new Error(`Airtable Error: ${errorDetail.error.message}`);
      }

      const result = await response.json();
      console.log('Airtable Record Created:', result);
      navigate('/'); // Redirect to the Reports page
      // Optional: Show a success message or perform any other action after saving
      onClose(); // Close the drawer or modal after saving
    } catch (error) {
      console.error('Error saving data to Airtable:', error);
    }
  };

  return (
    <Box borderWidth={1} borderRadius="md" p={4} w="full" mx="auto">
      <Tabs>
        <TabList>
          <Tab>SQL</Tab>
          <Tab>Data</Tab>
          <Tab>Chart</Tab>
          <Button
            ml="auto"
            right={5}
            onClick={onOpen}
            size="sm"
            bg={'#1a202c'}
            color={'#fff'}
            variant="solid"
            _hover={{ bg: '#2d3748' }}
          >
            Save
          </Button>
        </TabList>

        <TabPanels>
          <TabPanel>
          <Box position="relative" borderRadius="md" overflow="hidden">
  <SyntaxHighlighter
    language="sql"
    style={nightOwl}
    showLineNumbers
    wrapLines
    customStyle={{
      padding: '1rem',
      borderRadius: '8px',
      fontSize: '14px', // Adjust font size
      backgroundColor: '#011627', // Match the Night Owl theme
    }}
  >
    {cleanSQL(sql)}
  </SyntaxHighlighter>
  {/* Optional: Add Copy Button */}
  <IconButton
    icon={<CopyIcon />}
    aria-label="Copy SQL"
    position="absolute"
    top={2}
    right={2}
    size="sm"
    onClick={() => {
      navigator.clipboard.writeText(cleanSQL(sql));
    }}
    _hover={{ bg: 'gray.600' }}
  />
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
            {data && data.length > 0 ? (
              <Table variant="simple" w="full">
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
            ) : (
              <Text>No data available to display.</Text>
            )}
          </TabPanel>
          <TabPanel>
            <Box>
              <Flex justifyContent="end" alignItems="center" mb={4}>
                <HStack spacing={2}>
                  <IconButton icon={<RepeatIcon />} onClick={() => setChartSize(1)} />
                  <IconButton
                    icon={<DownloadIcon />}
                    onClick={() => alert('Download chart functionality to be implemented')}
                  />
                  <IconButton icon={<AddIcon />} onClick={() => setChartSize((prev) => prev + 0.2)} />
                  <IconButton
                    icon={<MinusIcon />}
                    onClick={() => setChartSize((prev) => (prev > 0.4 ? prev - 0.2 : prev))}
                  />
                  <IconButton icon={<FaExpand />} onClick={openModal} />
                  <Menu>
                    <MenuButton as={Button}>
                      <HStack>
                        {chartType === 'bar' && <FaChartBar />}
                        {chartType === 'line' && <FaChartLine />}
                        {chartType === 'pie' && <FaChartPie />}
                        <Text>{chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart</Text>
                        <ChevronDownIcon />
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
              <Box transform={`scale(${chartSize})`} transformOrigin="top left" w="full">
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

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Save Result</DrawerHeader>

          <DrawerBody>
            <FormControl id="title" isRequired> 
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a title" />
            </FormControl>

            <FormControl id="description" mt={4} isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description"
                maxLength={100}
              />
              <Text fontSize="sm" color="gray.500">
                {description.length}/100 characters
              </Text>
            </FormControl>

            <Tabs mt={4}>
              <TabList>
                <Tab>SQL</Tab>
                <Tab>Data</Tab>
                <Tab>Chart</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                <Box position="relative" borderRadius="md" overflow="hidden">
  <SyntaxHighlighter
    language="sql"
    style={nightOwl}
    showLineNumbers
    wrapLines
    customStyle={{
      padding: '1rem',
      borderRadius: '8px',
      fontSize: '14px', // Adjust font size
      backgroundColor: '#011627', // Match the Night Owl theme
    }}
  >
    {cleanSQL(sql)}
  </SyntaxHighlighter>
  {/* Optional: Add Copy Button */}
  <IconButton
    icon={<CopyIcon />}
    aria-label="Copy SQL"
    position="absolute"
    top={2}
    right={2}
    size="sm"
    onClick={() => {
      navigator.clipboard.writeText(cleanSQL(sql));
    }}
    _hover={{ bg: 'gray.600' }}
  />
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
                  {data && data.length > 0 ? (
                    <Table variant="simple" w="full">
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
                  ) : (
                    <Text>No data available to display.</Text>
                  )}
                </TabPanel>
                <TabPanel>
                  <Box w="full">{getChartComponent()}</Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={saveResult}>
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

// Main ChatPage component
const ChatPage = () => {
  const { isSignedIn } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState(false);
  const [currentSteps, setCurrentSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [showExamples, setShowExamples] = useState(true);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const examplePrompts = [
    {
      title: '',
      prompt: 'What is the total users and CLV - only high ticket (using deals table)',
      imageSrc: '/vector1.png',
    },
    {
      title: '',
      prompt: 'What is the daily trends of Deals and Amount per funnel',
      imageSrc: '/vector1.png',
    },
    {
      title: '',
      prompt: 'What is the total Current Cycle Deals for May 2024',
      imageSrc: '/vector1.png',
    },
  ];

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    // Create a new message object with unique identifier
    const newMessage = {
      text: inputValue,
      isUser: true,
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setShowExamples(false);

    const formattedConversation = updatedMessages
      .filter((message) => message.isUser)
      .map((message, index) => `Message ${index + 1}: ${message.text}`)
      .join('\n');

    console.log('Formatted Conversation: \n', formattedConversation);

    sendToAgent(formattedConversation);

    // Send data to Airtable without manual Message ID
    sendToAirtable({
      organisationId: 'ORG123',
      reportId: 'RPT456',
      userId: 'test@gmail.com',
      message: inputValue,
      messageUserType: 'User',
      messageType: 'Query',
    });
  };

  const sendToAgent = (formattedConversation) => {
    const apiUrl = 'https://fibo-flask.onrender.com/api/generate-pseudocode';

    setMessages((prev) => [
      ...prev,
      {
        text: 'Generating Pseudocode....',
        isUser: false,
      },
    ]);

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation: formattedConversation }),
    })
      .then((response) => response.json())
      .then((data) => {
        const pseudocodeSteps = data.pseudocode.split('\n');
        setCurrentSteps(pseudocodeSteps);

        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1),
          {
            text: data.pseudocode,
            isUser: false,
          },
        ]);

        setIsWaitingForConfirmation(true);

        sendToAirtable({
          organisationId: 'ORG123',
          reportId: 'RPT456',
          userId: 'test@gmail.com',
          message: data.pseudocode,
          messageUserType: 'Agent',
          messageType: 'Pseudocode',
        });
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1),
          { text: `Error: ${error.message}`, isUser: false },
        ]);
      });
  };

  const sendPseudocodeToAgent = (pseudocode) => {
    const apiUrl = 'https://fibo-flask.onrender.com/api/generate-sql';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pseudocode: pseudocode }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Received SQL from agent: ', data.sql);
        console.log('Received Data from agent: ', data.data);

        if (!data.data || data.data.length === 0) {
          throw new Error('No data returned from API');
        }

        const result = {
          sql: data.sql,
          data: data.data,
          chart: {
            colors: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
          },
        };

        setResult(result);

        setMessages((prev) => [
          ...prev,
          {
            text: "Great! Here's the result:",
            isUser: false,
          },
        ]);

        sendToAirtable({
          organisationId: 'ORG123',
          reportId: 'RPT456',
          userId: 'test@gmail.com',
          message: data.sql,
          messageUserType: 'Agent',
          messageType: 'SQL',
        });
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessages((prev) => [
          ...prev,
          { text: `Error: ${error.message}`, isUser: false },
        ]);
      });
  };

  const handleEditMessage = (index, newMessage) => {
    const updatedMessages = [...messages];
    updatedMessages[index].text = newMessage;
    setMessages(updatedMessages);
  };

  const handleConfirmation = (confirmed) => {
    setIsWaitingForConfirmation(false);

    if (confirmed) {
      const formattedPseudocode = currentSteps.join('\n');
      console.log('Formatted Pseudocode: \n', formattedPseudocode);

      sendPseudocodeToAgent(formattedPseudocode);

      setIsInputDisabled(true);
    } else {
      setMessages((prev) => [
        ...prev,
        { text: 'I understand. Could you provide more details or clarify your request?', isUser: false },
      ]);
    }
    setCurrentSteps([]);
  };

  return (
    <div className="Dashboard flex flex-col h-screen">
      <TopNav />
      <div className="flex flex-grow overflow-hidden">
        <SideNav />
        <main className="flex-grow p-4" style={{ paddingTop: '120px' }}>
          <Container maxW="container.xl" h="full">
            <VStack spacing={6} h="full" align="center">
              {showExamples && (
                <HStack w="80%" spacing={4} justifyContent="center" alignItems="center" mx="auto">
                  {examplePrompts.map((prompt, index) => (
                    <Box
                      key={index}
                      p={4}
                      w="full"
                      borderWidth="1px"
                      borderRadius="lg"
                      onClick={() => setInputValue(prompt.prompt)}
                      cursor="pointer"
                      _hover={{ backgroundColor: 'gray.100' }}
                    >
                      <VStack align="left" spacing={2}>
                        <Center w="50px" h="50px" bg="#F8F8F8" borderRadius="50%" mb={2}>
                          <Image src={prompt.imageSrc} alt={`${prompt.title} icon`} boxSize="20px" />
                        </Center>
                        <Text fontWeight="bold" fontSize="lg" textAlign="left">
                          {prompt.title}
                        </Text>
                        <Text fontSize="md" color="gray.500" textAlign="left">
                          {prompt.prompt}
                        </Text>
                      </VStack>
                    </Box>
                  ))}
                </HStack>
              )}

              <VStack flex={1} w="80%" overflowY="auto" spacing={4} alignItems="stretch" pb={4} mx="auto">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    message={message.text}
                    isUser={message.isUser}
                    onEdit={(newMessage) => handleEditMessage(index, newMessage)}
                  />
                ))}

                {isWaitingForConfirmation && (
                  <HStack w="full" justifyContent="center" alignItems="center" spacing={2}>
                    <Text>Is it okay to proceed and generate using this logic?</Text>
                    <IconButton
                      size={'xs'}
                      borderRadius={'full'}
                      icon={<FaThumbsDown />}
                      colorScheme="red"
                      onClick={() => handleConfirmation(false)}
                    />
                    <IconButton
                      size={'xs'}
                      borderRadius={'full'}
                      icon={<FaThumbsUp />}
                      colorScheme="green"
                      onClick={() => handleConfirmation(true)}
                    />
                  </HStack>
                )}

                {result && 
                <ErrorBoundary>
                  <ResultBox sql={result.sql} data={result.data} chart={result.chart} />
                </ErrorBoundary>}
              
              </VStack>

              {!isInputDisabled && (
                <HStack as="form" w="80%" mb={2} onSubmit={(e) => e.preventDefault()} mx="auto">
                  <InputGroup size="lg">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter your message..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isWaitingForConfirmation && inputValue.trim() !== '') {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <InputRightElement width="4.5rem">
                      <IconButton
                        bg={'transparent'}
                        aria-label="Send"
                        icon={<Image src="/send.png" boxSize="20px" alt="Send" />}
                        onClick={handleSend}
                        isDisabled={inputValue.trim() === '' || isWaitingForConfirmation}
                        size="sm"
                      />
                    </InputRightElement>
                  </InputGroup>
                </HStack>
              )}
            </VStack>
          </Container>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
