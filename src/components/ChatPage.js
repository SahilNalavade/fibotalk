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

// Component to display chat messages
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
    const lines = message.split('\n'); // Split message into lines
    const elements = lines.map((line, index) => {
      // Check if the line matches the pattern for numbered headings (e.g., "1. **Select Columns**:")
      if (/^\d+\.\s\*\*.+\*\*:/.test(line)) {
        return (
          <Heading as="h5" size="sm" mb={1} color="blue.600" key={index}>
            {line.replace(/^\d+\.\s\*\*/, '').replace(/\*\*:$/, '').trim()}
          </Heading>
        );
      }
      // Check if the line starts with ### for headers
      if (line.startsWith('###')) {
        return (
          <Heading as="h4" size="md" mb={2} color="gray.600" key={index}>
            {line.replace(/^###\s*/, '').trim()}
          </Heading>
        );
      }
      // Check if the line starts with # for subheaders
      if (line.startsWith('#')) {
        return (
          <Heading as="h5" size="sm" mb={1} color="blue.500" key={index}>
            {line.replace(/^#\s*/, '').trim()}
          </Heading>
        );
      }
      // Check if the line starts with * for list items
      if (line.startsWith('*')) {
        return (
          <UnorderedList key={index} pl={5} mb={2}>
            <ListItem color="gray.800">
              {line.replace(/^\*\s*/, '').trim()}
            </ListItem>
          </UnorderedList>
        );
      }
      // Check if the line starts with - for bullet points
      if (line.startsWith('-')) {
        return (
          <UnorderedList key={index} pl={5} mb={2}>
            <ListItem color="gray.800">
              {line.replace(/^-/, '').trim()}
            </ListItem>
          </UnorderedList>
        );
      }
      // Default rendering for other lines
      return (
        <Text key={index} color="gray.700">
          {line.trim()}
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
              <Box ml={2}>
                <UserButton />
              </Box>
            </HStack>
          </HStack>
        </Box>
      )}
    </HStack>
  );
};

// ResultBox component
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
              <Pie data={data} dataKey="deliciousness" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
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
            <Box
              position="relative"
              bg="gray.900"
              color="white"
              fontFamily="monospace"
              fontSize="sm"
              p={4}
              borderRadius="md"
              overflowX="auto"
              w="full"
            >
              <pre style={{ textAlign: 'left', margin: 0 }}>{sql}</pre>
              <IconButton
                icon={<CopyIcon />}
                position="absolute"
                top={2}
                right={2}
                onClick={onCopy}
                size="sm"
                aria-label="Copy SQL"
                bg="gray.700"
                _hover={{ bg: 'gray.600' }}
                _active={{ bg: 'gray.500' }}
                color="white"
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
          </TabPanel>
          <TabPanel>
            <Box>
              <Flex justifyContent="end" alignItems="center" mb={4}>
                <HStack spacing={2}>
                  <IconButton icon={<RepeatIcon />} onClick={() => setChartSize(1)} />
                  <IconButton icon={<DownloadIcon />} onClick={() => alert('Download chart functionality to be implemented')} />
                  <IconButton icon={<AddIcon />} onClick={() => setChartSize((prev) => prev + 0.2)} />
                  <IconButton icon={<MinusIcon />} onClick={() => setChartSize((prev) => (prev > 0.4 ? prev - 0.2 : prev))} />
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
                  <Box position="relative" bg={'black'} color={'white'} p={5} fontSize={14}>
                    <pre>{sql}</pre>
                    <IconButton icon={<CopyIcon />} position="absolute" top={2} right={2} onClick={onCopy} color={'white'} bg={'transparent'} _active={'transparent'} _hover={'transparent'} />
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
            <a href="/reports">
              <Button colorScheme="blue">Save</Button>
            </a>
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
  const [conversationCount, setConversationCount] = useState(0);
  const [isInputDisabled, setIsInputDisabled] = useState(false); // State to disable input on confirmation

  const examplePrompts = [
    {
      title: '',
      prompt: 'What is the total users and CLV - only high ticket ( using deals table)',
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

    setMessages([...messages, { text: inputValue, isUser: true }]);
    setInputValue('');
    setShowExamples(false);

    const newConversationId = conversationCount + 1;

    // Create a new message object with a unique identifier only for user messages
    const newMessage = {
      id: newConversationId,
      text: inputValue,
      isUser: true,
    };

    // Add the new user message to the messages array
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setShowExamples(false);

    // Filter out system messages and format the conversation history
    const formattedConversation = updatedMessages
      .filter((message) => message.isUser) // Include only user messages
      .map((message) => `Conversation ${message.id}: ${message.text}`)
      .join('\n');

    // Log the formatted conversation history
    console.log('Formatted Conversation: \n', formattedConversation);

    // Send the formatted conversation history to your Flask API
    sendToAgent(formattedConversation);
    // Update the conversation counter
    setConversationCount(newConversationId);
  };

  const sendToAgent = (formattedConversation) => {
    const apiUrl = 'http://localhost:8080/api/generate-pseudocode';

    // Display the loading message before starting the API call
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
        const pseudocodeSteps = data.pseudocode.split('\n'); // Assuming each step is on a new line
        setCurrentSteps(pseudocodeSteps);

        // Replace the loading message with the actual pseudocode
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1), // Remove the loading message
          { text: data.pseudocode, isUser: false }, // Add system response to the chat
        ]);

        // Show the confirmation prompt only after pseudocode is displayed
        setIsWaitingForConfirmation(true);
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1), // Remove the loading message in case of error
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

      // Send the pseudocode to the Flask API to generate SQL
      sendPseudocodeToAgent(formattedPseudocode);

      // Disable the input box when confirmed
      setIsInputDisabled(true);
    } else {
      setMessages((prev) => [
        ...prev,
        { text: 'I understand. Could you provide more details or clarify your request?', isUser: false },
      ]);
    }
    setCurrentSteps([]);
  };

  const sendPseudocodeToAgent = (pseudocode) => {
    const apiUrl = 'http://localhost:8080/api/generate-sql';

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
          { text: "Great! Here's the result:", isUser: false },
        ]);
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessages((prev) => [
          ...prev,
          { text: `Error: ${error.message}`, isUser: false },
        ]);
      });
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

                {result && <ResultBox sql={result.sql} data={result.data} chart={result.chart} />}
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
