import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Progress,
  Switch,
  Tooltip,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';
import { ViewIcon, ViewOffIcon, ChevronDownIcon, ArrowBackIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { FiUpload } from 'react-icons/fi';

const ConnectForm = ({ onBack }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [formData, setFormData] = useState({
    databaseServer: '',
    username: '',
    password: '',
    account: '',
    warehouse: '',
    role: '',
    database: '',
    serviceAccountKey: null,
    projectId: '',
    jsonParsedData: null,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const toast = useToast();
  const boxBgColor = useColorModeValue('white', 'gray.800');

  const databaseServers = [
    { value: 'BigQuery', label: 'BigQuery', logo: '/bigquery.png' },
    { value: 'SnowFlake', label: 'SnowFlake', logo: '/Snowflake.png' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setFormData({
          ...formData,
          serviceAccountKey: file,
          projectId: json.project_id,
          jsonParsedData: json,
        });
        toast({
          title: 'File Uploaded',
          description: 'The service account JSON file has been successfully parsed.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      } catch (error) {
        toast({
          title: 'File Upload Error',
          description: 'Failed to parse the JSON file. Please ensure it is a valid BigQuery service account key.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    };

    reader.onerror = () => {
      toast({
        title: 'File Read Error',
        description: 'There was an error reading the file. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    };

    reader.readAsText(file);
  };

  const handleSave = useCallback(async () => {
    const {
      databaseServer,
      username,
      password,
      account,
      warehouse,
      role,
      database,
      serviceAccountKey,
      projectId,
      jsonParsedData,
    } = formData;

    if (
      !databaseServer ||
      (databaseServer === 'SnowFlake' && (!username || !password || !account || !warehouse || !role || !database)) ||
      (databaseServer === 'BigQuery' && (!serviceAccountKey || !projectId))
    ) {
      toast({
        title: 'Form Incomplete',
        description: 'Please fill out all required fields.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    setLoading(true); // Set loading to true while submitting

    const airtableData = {
      fields: {
        "Organisation ID": new Date().getTime().toString(),
        "Database Server": databaseServer,
        ...(databaseServer === 'SnowFlake' && {
          "Username": username,
          "Password": password, // Remember to handle this securely
          "Account": account,
          "Warehouse": warehouse,
          "Role": role,
          "Database": database,
        }),
        ...(databaseServer === 'BigQuery' && {
          "Project ID": projectId,
          "Client Email": jsonParsedData.client_email,
          "Client ID": jsonParsedData.client_id,
          "Private Key ID": jsonParsedData.private_key_id,
          "Private Key": jsonParsedData.private_key,
          "Auth URI": jsonParsedData.auth_uri,
          "Token URI": jsonParsedData.token_uri,
          "Auth Provider URL": jsonParsedData.auth_provider_x509_cert_url,
          "Client Cert URL": jsonParsedData.client_x509_cert_url,
          "Universe Domain": jsonParsedData.universe_domain,
        }),
        "State": isEnabled ? "Active" : "Inactive",
        "CreatedAt": new Date().toISOString(),
        "UpdatedAt": new Date().toISOString(),
      },
    };

    try {
      const response = await axios.post(
        `https://api.airtable.com/v0/app4ZQ9jav2XzNIv9/DatabaseConfig`,
        airtableData,
        {
          headers: {
            Authorization: `Bearer pat7yphXE6tN9GRZo.4fa31f031768b1799770a8c2a9254d0f5cbf879cbe5dc2c6d7469ff11ec5cc89`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Airtable response:', response.data);

      toast({
        title: 'Form Saved',
        description: 'Your database configuration has been saved to Airtable.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });

      // Reset the form after saving
      setFormData({
        databaseServer: '',
        username: '',
        password: '',
        account: '',
        warehouse: '',
        role: '',
        database: '',
        serviceAccountKey: null,
        projectId: '',
        jsonParsedData: null,
      });
      setSelectedFile(null);
      setIsEnabled(false);

      onBack();
    } catch (error) {
      console.error('Error saving to Airtable:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.error?.message || 'There was an error saving your data to Airtable. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  }, [formData, isEnabled, onBack, toast]);

  const handleCancel = () => {
    onBack();
  };

  const handleMenuSelect = (value) => {
    setFormData({ ...formData, databaseServer: value });
    setActiveStep(1);
  };

  const steps = [
    'Select Database Server',
    formData.databaseServer === 'BigQuery' ? 'BigQuery Configuration' : 'SnowFlake Configuration',
    'Review & Save',
  ];

  const menuButtonRef = useRef(null);
  const [menuWidth, setMenuWidth] = useState(null);

  useEffect(() => {
    if (menuButtonRef.current) {
      setMenuWidth(menuButtonRef.current.getBoundingClientRect().width);
    }

    const updateMenuWidth = () => {
      if (menuButtonRef.current) {
        setMenuWidth(menuButtonRef.current.getBoundingClientRect().width);
      }
    };

    window.addEventListener('resize', updateMenuWidth);
    return () => {
      window.removeEventListener('resize', updateMenuWidth);
    };
  }, [formData.databaseServer]);

  return (
    <Box width="70%" margin="auto" padding="6" pt={10} borderRadius="lg" boxShadow="xl" bg={boxBgColor} mt={5}>
      <VStack spacing={8} align="stretch">
        <HStack justify="flex-start" spacing={4}>
          <IconButton icon={<ArrowBackIcon />} aria-label="Go back" onClick={handleCancel} variant="ghost" />
          <Text fontSize="lg" fontWeight="bold">
            Connect to Database
          </Text>
        </HStack>

        <Progress value={(activeStep / (steps.length - 1)) * 100} size="xs" colorScheme="blue" />

        {activeStep === 0 && (
          <FormControl id="database-server" isRequired>
            <FormLabel>Select Database Server</FormLabel>
            <Menu>
              <MenuButton
                ref={menuButtonRef}
                as={Button}
                size="lg"
                width="100%"
                rightIcon={<ChevronDownIcon />}
                textAlign="left"
                variant="outline"
                bg="white"
                _hover={{ bg: 'white' }}
                _focus={{ boxShadow: 'outline', bg: 'white' }}
                fontSize="md"
                fontWeight="normal"
                padding="0.875rem 1rem"
              >
                {formData.databaseServer || 'Select database server'}
              </MenuButton>
              <MenuList bg="white" width={menuWidth ? `${menuWidth}px` : 'auto'}>
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
        )}

        {activeStep === 1 && formData.databaseServer === 'SnowFlake' && (
          <VStack spacing={6} align="stretch">
            <HStack spacing={6}>
              <FormControl id="username" isRequired>
                <FormLabel>
                  Username
                  <Tooltip label="Your SnowFlake account username" fontSize="md">
                    <InfoOutlineIcon ml={2} />
                  </Tooltip>
                </FormLabel>
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
              <FormControl id="account" isRequired>
                <FormLabel>Account</FormLabel>
                <Input
                  placeholder="Enter account"
                  size="lg"
                  value={formData.account}
                  onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                />
              </FormControl>
              <FormControl id="warehouse" isRequired>
                <FormLabel>Warehouse</FormLabel>
                <Input
                  placeholder="Enter warehouse"
                  size="lg"
                  value={formData.warehouse}
                  onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                />
              </FormControl>
            </HStack>
            <HStack spacing={6}>
              <FormControl id="role" isRequired>
                <FormLabel>
                  Role
                  <Tooltip label="The role you want to use in SnowFlake" fontSize="md">
                    <InfoOutlineIcon ml={2} />
                  </Tooltip>
                </FormLabel>
                <Input
                  placeholder="Enter role"
                  size="lg"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </FormControl>
              <FormControl id="database" isRequired>
                <FormLabel>Database</FormLabel>
                <Input
                  placeholder="Enter database"
                  size="lg"
                  value={formData.database}
                  onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                />
              </FormControl>
            </HStack>
          </VStack>
        )}

        {activeStep === 1 && formData.databaseServer === 'BigQuery' && (
          <VStack spacing={6} align="stretch">
            <FormControl id="service-account-key" isRequired>
              <FormLabel mb={2}>
                Service Account Key (JSON)
                <Tooltip label="Upload your BigQuery service account key in JSON format" fontSize="sm">
                  <InfoOutlineIcon ml={2} boxSize={3} />
                </Tooltip>
              </FormLabel>
              <Box
                borderWidth={2}
                borderRadius="md"
                borderStyle="dashed"
                borderColor="gray.300"
                p={4}
                textAlign="center"
                transition="all 0.3s"
                _hover={{ borderColor: 'blue.500' }}
              >
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  display="none"
                  id="service-account-key-upload"
                />
                <Button
                  as="label"
                  htmlFor="service-account-key-upload"
                  variant="ghost"
                  colorScheme="blue"
                  size="md"
                  leftIcon={<Icon as={FiUpload} />}
                  mb={2}
                >
                  {selectedFile ? 'Change File' : 'Select JSON File'}
                </Button>
                <Text fontSize="sm" color="gray.500">
                  {selectedFile ? selectedFile.name : 'No file selected'}
                </Text>
              </Box>
            </FormControl>
          </VStack>
        )}

        {activeStep === 2 && (
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Review Your Configuration
            </Text>
            <VStack align="stretch" spacing={4}>
              <Box p={4} bg="gray.100" borderRadius="md">
                <Text>Database Server: {formData.databaseServer}</Text>
                {formData.databaseServer === 'SnowFlake' && (
                  <>
                    <Text>Username: {formData.username}</Text>
                    <Text>Account: {formData.account}</Text>
                    <Text>Warehouse: {formData.warehouse}</Text>
                    <Text>Role: {formData.role}</Text>
                    <Text>Database: {formData.database}</Text>
                  </>
                )}
                {formData.databaseServer === 'BigQuery' && (
                  <>
                    <Text>Project ID: {formData.projectId}</Text>
                    <Text>Service Account Key: {formData.serviceAccountKey?.name}</Text>
                  </>
                )}
              </Box>
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
            </VStack>
          </Box>
        )}

        <HStack spacing={6} justify="flex-end">
          {activeStep > 0 && (
            <Button bg="transparent" _hover={{ bg: 'transparent' }} size="md" onClick={() => setActiveStep(activeStep - 1)}>
              Back
            </Button>
          )}
          {activeStep < 2 ? (
            <Button colorScheme="blue" size="md" onClick={() => setActiveStep(activeStep + 1)} isDisabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Next'}
            </Button>
          ) : (
            <Button colorScheme="blue" size="md" onClick={handleSave} isDisabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Save'}
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default ConnectForm;
