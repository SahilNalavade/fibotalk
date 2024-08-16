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
  Text,
  IconButton
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, ChevronDownIcon, ArrowBackIcon } from '@chakra-ui/icons';

const ConnectForm = ({ onBack }) => {
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

  const boxBgColor = useColorModeValue('white', 'gray.800');
  const inputBgColor = useColorModeValue('gray.50', 'gray.700');
  const inputBorderColor = useColorModeValue('gray.300', 'gray.600');

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

    console.log('Form submitted:', formData);
  };

  const handleMenuSelect = (value) => {
    setFormData({ ...formData, databaseServer: value });
  };

  return (
    <Box width="70%" margin="auto" padding="6" pt={10} borderRadius="lg" boxShadow="xl" bg={boxBgColor} mt={10}>
      <VStack spacing={10} align="stretch">
        <HStack spacing={4} justify="flex-start">
          <IconButton
            icon={<ArrowBackIcon />}
            aria-label="Go back"
            onClick={onBack}
            variant="ghost"
          />
          <Text fontSize="lg" fontWeight="bold">Connect to Database</Text>
        </HStack>

        <HStack spacing={6}>
          <FormControl id="database-name" isRequired>
            <FormLabel>Connection Name</FormLabel>
            <Input
              placeholder="Enter database name"
              size="lg"
              bg={inputBgColor}
              borderColor={inputBorderColor}
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
                border="1px" 
                borderColor={inputBorderColor} 
                width="100%" 
                textAlign="left"
                ref={menuButtonRef}
                _hover={{ bg: inputBgColor }}
                _active={{ bg: inputBgColor }}
                fontWeight="normal"
              >
                {formData.databaseServer || 'Select database server'}
              </MenuButton>
              <MenuList 
                width={menuWidth}
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
              borderColor={inputBorderColor}
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
              borderColor={inputBorderColor}
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
              borderColor={inputBorderColor}
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
                borderColor={inputBorderColor}
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
