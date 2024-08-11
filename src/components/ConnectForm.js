import React, { useState, useRef, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  VStack,
  HStack,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Center,
  useToast,
  Image,
  Text
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const ConnectForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    databaseName: '',
    databaseServer: '',
    hostname: '',
    port: '',
    username: '',
    password: ''
  });

  const [menuWidth, setMenuWidth] = useState('auto');
  const menuButtonRef = useRef(null);

  const toast = useToast();
  const navigate = useNavigate();

  const boxBgColor = useColorModeValue('white', 'gray.800');
  const inputBgColor = useColorModeValue('gray.50', 'gray.700');
  const inputBorderColor = useColorModeValue('gray.300', 'gray.600'); // Define the border color

  const databaseServers = [
    { value: 'BigQuery', label: 'BigQuery', logo: '/bigquery.png' },
    { value: 'RedShift', label: 'RedShift', logo: '/redshift.png' },
    { value: 'SnowFlake', label: 'SnowFlake', logo: '/snowflake.png' },
  ];

  useEffect(() => {
    if (menuButtonRef.current) {
      setMenuWidth(`${menuButtonRef.current.offsetWidth}px`);
    }
  }, [menuButtonRef]);

  const handleSubmit = () => {
    const { databaseName, databaseServer, hostname, port, username, password } = formData;

    if (!databaseName || !databaseServer || !hostname || !port || !username || !password) {
      toast({
        title: 'Form Incomplete',
        description: 'Please fill out all required fields.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      return;
    }

    // Handle form submission logic here
    console.log('Form submitted:', formData);

    // Navigate to another page
    navigate('/another-page');
  };

  const handleMenuSelect = (value) => {
    setFormData({ ...formData, databaseServer: value });
  };

  return (
    <Box width="70%" margin="auto" padding="6" pt={10} borderRadius="lg" boxShadow="xl" bg={boxBgColor} mt={10}>
      <VStack spacing={10} align="stretch">
        <HStack spacing={6}>
          <FormControl id="database-name" isRequired>
            <FormLabel>Database Name</FormLabel>
            <Input
              placeholder="Enter database name"
              size="lg"
              bg={inputBgColor}
              borderColor={inputBorderColor} // Apply border color to the input
              value={formData.databaseName}
              onChange={(e) => setFormData({ ...formData, databaseName: e.target.value })}
            />
          </FormControl>
          <FormControl id="database-server" isRequired>
            <FormLabel>Database Server</FormLabel>
            <Menu>
              <MenuButton 
                as={Button} 
                rightIcon={<ChevronDownIcon />} 
                size="lg" 
                bg={inputBgColor} 
                border="1px" // Add a border similar to the input
                borderColor={inputBorderColor} // Match the border color
                width="100%" 
                textAlign="left"
                ref={menuButtonRef}
                _hover={{ bg: inputBgColor }}
                _active={{ bg: inputBgColor }}
                fontWeight="normal" // Adjust font weight to normal
              >
                {formData.databaseServer || 'Select database server'}
              </MenuButton>
              <MenuList 
                width={menuWidth} // Explicitly set the width to match the MenuButton
              >
                {databaseServers.map(server => (
                  <MenuItem key={server.value} onClick={() => handleMenuSelect(server.value)}>
                    <HStack>
                      <Image src={server.logo} alt={server.label} boxSize="20px" />
                      <Text>{server.label}</Text>
                    </HStack>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </FormControl>
        </HStack>
        <HStack spacing={6}>
          <FormControl id="hostname" isRequired>
            <FormLabel>Hostname</FormLabel>
            <Input
              placeholder="Enter hostname"
              size="lg"
              bg={inputBgColor}
              borderColor={inputBorderColor} // Apply border color to the input
              value={formData.hostname}
              onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
            />
          </FormControl>
          <FormControl id="port" isRequired>
            <FormLabel>Port</FormLabel>
            <Input
              placeholder="Enter port number"
              size="lg"
              bg={inputBgColor}
              borderColor={inputBorderColor} // Apply border color to the input
              value={formData.port}
              onChange={(e) => setFormData({ ...formData, port: e.target.value })}
            />
          </FormControl>
        </HStack>
        <HStack spacing={6}>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="Enter username"
              size="lg"
              bg={inputBgColor}
              borderColor={inputBorderColor} // Apply border color to the input
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size="lg">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                bg={inputBgColor}
                borderColor={inputBorderColor} // Apply border color to the input
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </HStack>
        <Center>
          <Button colorScheme="blue" size="md" mt={6} width='200px' onClick={handleSubmit}>
            Connect
          </Button>
        </Center>
      </VStack>
    </Box>
  );
};

export default ConnectForm;
