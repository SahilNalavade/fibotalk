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
  useToast,
  Image,
  Text,
  IconButton,
  Flex,
  Switch,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, ChevronDownIcon, ArrowBackIcon } from '@chakra-ui/icons';

const EditForm = ({ onBack, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);  // New state for enabling/disabling
  const [formData, setFormData] = useState({
    databaseName: '',
    databaseServer: '',
    hostname: '',
    port: '',
    username: '',
    password: ''
  });

  const menuButtonRef = useRef(null);
  const [menuListWidth, setMenuListWidth] = useState('auto');

  useEffect(() => {
    if (menuButtonRef.current) {
      setMenuListWidth(`${menuButtonRef.current.offsetWidth}px`);
    }
  }, [menuButtonRef.current]);

  const toast = useToast();
  const boxBgColor = useColorModeValue('white', 'gray.800');

  const databaseServers = [
    { value: 'BigQuery', label: 'BigQuery', logo: '/bigquery.png' },
    { value: 'RedShift', label: 'RedShift', logo: '/redshift.png' },
    { value: 'SnowFlake', label: 'SnowFlake', logo: '/snowflake.png' },
  ];

  const handleSave = () => {
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

    console.log('Form submitted:', { ...formData, isEnabled });

    // Reset the form after saving
    setFormData({
      databaseName: '',
      databaseServer: '',
      hostname: '',
      port: '',
      username: '',
      password: ''
    });
    setIsEnabled(false); // Reset the switch

    toast({
      title: 'Form Saved',
      description: 'Your database connection has been saved.',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right'
    });
  };

  const handleDelete = () => {
    onDelete(); // Handle the delete action
  };

  const handleCancel = () => {
    onBack(); // Handle the cancel action
  };

  const handleMenuSelect = (value) => {
    setFormData({ ...formData, databaseServer: value });
  };

  return (
    <Box width="70%" margin="auto" padding="6" pt={10} borderRadius="lg" boxShadow="xl" bg={boxBgColor} mt={5}>
      <VStack spacing={8} align="stretch">
        <HStack justify="flex-start" spacing={4}>
          <IconButton
            icon={<ArrowBackIcon />}
            aria-label="Go back"
            onClick={onBack}
            variant="ghost"
          />
          <Text fontSize="lg" fontWeight="bold">Edit Database Configuration</Text>
        </HStack>
        <HStack spacing={6}>
          <FormControl id="database-name" isRequired>
            <FormLabel>Connection Name</FormLabel>
            <Input
              placeholder="Enter database name"
              size="lg"
              value={formData.databaseName}
              onChange={(e) => setFormData({ ...formData, databaseName: e.target.value })}
            />
          </FormControl>

          <FormControl id="database-server" isRequired>
            <FormLabel>Database Server</FormLabel>
            <Menu>
              <MenuButton
                as={Button}
                size="lg"
                width="100%"
                rightIcon={<ChevronDownIcon />}
                textAlign="left"
                variant="outline"
                bg="white"
                _hover={{ bg: 'white' }}
                _focus={{ boxShadow: 'outline', bg: 'white' }}
                ref={menuButtonRef}
                fontSize="md"
                fontWeight="normal"
                padding="0.875rem 1rem"
              >
                {formData.databaseServer || 'Select database server'}
              </MenuButton>
              <MenuList minWidth={menuListWidth} bg="white">
                {databaseServers.map((server) => (
                  <MenuItem
                    key={server.value}
                    onClick={() => handleMenuSelect(server.value)}
                    _hover={{ bg: 'gray.100' }}
                  >
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
              value={formData.hostname}
              onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
            />
          </FormControl>
          <FormControl id="port" isRequired>
            <FormLabel>Port</FormLabel>
            <Input
              placeholder="Enter port number"
              size="lg"
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

        <HStack spacing={6}>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="enable-connection" mb="0">
              Enable Connection
            </FormLabel>
            <Switch
              id="enable-connection"
              isChecked={isEnabled}
              onChange={() => setIsEnabled(!isEnabled)}
            />
          </FormControl>
        </HStack>

        <Flex justify="space-between" mt={6}>
          <Button colorScheme="red" size="md" onClick={handleDelete}>
            Delete
          </Button>
          <HStack spacing={6}>
            <Button bg={'transparent'} _hover={{ bg: 'transparent' }} size="md" onClick={handleCancel}>
              Cancel
            </Button>
            <Button colorScheme="blue" size="md" onClick={handleSave}>
              Save
            </Button>
          </HStack>
        </Flex>
      </VStack>
    </Box>
  );
};

export default EditForm;
