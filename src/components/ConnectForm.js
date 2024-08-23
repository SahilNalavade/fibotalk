import React, { useState } from 'react';
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
  Tooltip,
  Progress,
  Icon
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, ChevronDownIcon, ArrowBackIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { FiUpload } from 'react-icons/fi';

const ConnectForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
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
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const navigate = useNavigate();
  const toast = useToast();
  const boxBgColor = useColorModeValue('white', 'gray.800');

  const databaseServers = [
    { value: 'BigQuery', label: 'BigQuery', logo: '/bigquery.png' },
    { value: 'RedShift', label: 'RedShift', logo: '/redshift.png' },
    { value: 'SnowFlake', label: 'SnowFlake', logo: '/snowflake.png' },
  ];

  const handleSave = () => {
    const { databaseServer, username, password, account, warehouse, role, database, serviceAccountKey, projectId } = formData;

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

    console.log('Form submitted:', { ...formData, isEnabled });

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
    });
    setSelectedFile(null);
    setIsEnabled(false); // Reset the switch

    toast({
      title: 'Form Saved',
      description: 'Your database connection has been saved.',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });

    // Redirect to the database configuration tab
    navigate('/#database-config-tab');
  };

  const handleCancel = () => {
    // Redirect to the database configuration tab when cancelled
    navigate('/#database-config-tab');
  };

  const handleMenuSelect = (value) => {
    setFormData({ ...formData, databaseServer: value });
    setActiveStep(1); // Move to the next step
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setFormData({ ...formData, serviceAccountKey: e.target.files[0] });
  };

  const steps = [
    'Select Database Server',
    formData.databaseServer === 'BigQuery' ? 'BigQuery Configuration' : 'SnowFlake Configuration',
    'Review & Save',
  ];

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
              <MenuList bg="white">
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
    _hover={{ borderColor: "blue.500" }}
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
      {selectedFile ? "Change File" : "Select JSON File"}
    </Button>
    <Text fontSize="sm" color="gray.500">
      {selectedFile ? selectedFile.name : "No file selected"}
    </Text>
  </Box>
</FormControl>
            <FormControl id="project-id" isRequired>
              <FormLabel>Project ID</FormLabel>
              <Input
                placeholder="Enter project ID"
                size="lg"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              />
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
            <Button colorScheme="blue" size="md" onClick={() => setActiveStep(activeStep + 1)}>
              Next
            </Button>
          ) : (
            <Button colorScheme="blue" size="md" onClick={handleSave}>
              Save
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default ConnectForm;
