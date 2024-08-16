import React, { useState } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import TopNav from './TopNav';
import SideNav from './SideNav';
import '../App.css';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Button,
  Icon,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Box,
  Text
} from '@chakra-ui/react';
import { ChevronRightIcon, AddIcon } from '@chakra-ui/icons';
import ConnectForm from './ConnectForm';
import TableComponent from './TableComponent';
import APIForm from './APIForm';
import APIList from './APIList';
import { FaPlus } from 'react-icons/fa';

const Dashboard = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const breadcrumbColor = useColorModeValue('gray.600', 'gray.300');
  const [showAPIForm, setShowAPIForm] = useState(false);
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(1); // Start with the second tab active

  const handleNewAPIKey = () => {
    setShowAPIForm(true);
    setActiveTabIndex(0); // Switch to the API Key tab
  };

  const handleAddDatabase = () => {
    setShowConnectForm(true);
    setActiveTabIndex(1); // Switch to the Database Configuration tab
  };

  const handleBackToDatabaseConfig = () => {
    setShowConnectForm(false);
    setShowAPIForm(false);
    setActiveTabIndex(0); // Switch to the API Key tab
  };

  const getCurrentBreadcrumb = () => {
    if (activeTabIndex === 0) {
      return 'API Key';
    } else if (activeTabIndex === 1) {
      return 'Database Configuration';
    }
    return '';
  };

  return (
    <div className="Dashboard flex flex-col h-screen">
      <TopNav />
      <div className="flex flex-grow overflow-hidden">
        <SignedIn>
          <SideNav />
          <main className="flex-grow p-4"  style={{ paddingTop: '105px', backgroundColor: bgColor }}>
          <Box maxWidth="90%" mx="auto" >
          <Box mt={4}>
  <Breadcrumb
    spacing="8px"
    separator={<ChevronRightIcon color={breadcrumbColor} boxSize="18px" />}
    fontSize="lg"
    color={breadcrumbColor}
    mb={14}
  >
    <BreadcrumbItem>
      <BreadcrumbLink href="#" fontSize="lg">Connection</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem isCurrentPage>
      <Text fontWeight="semibold" fontSize="lg">{getCurrentBreadcrumb()}</Text>
    </BreadcrumbItem>
  </Breadcrumb>
</Box>

            <Tabs index={activeTabIndex} onChange={(index) => setActiveTabIndex(index)}>
              <TabList mb="1em">
                <Tab>API Key</Tab>
                <Tab>Database Configuration</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Flex justify="flex-end" mb={4}>
                    {!showAPIForm && (
                      <Button
                        leftIcon={<Icon as={FaPlus} />}
                        colorScheme="blue"
                        onClick={handleNewAPIKey}
                      >
                        New API Key
                      </Button>
                    )}
                  </Flex>
                  {showAPIForm ? <APIForm onBack={handleBackToDatabaseConfig} /> : <APIList />}
                </TabPanel>
                <TabPanel>
                  <Flex justify="flex-end" mb={4}>
                    {!showConnectForm && (
                      <Button
                        leftIcon={<AddIcon />}
                        colorScheme="blue"
                        onClick={handleAddDatabase}
                      >
                        Add Database
                      </Button>
                    )}
                  </Flex>
                  {showConnectForm ? (
                    <ConnectForm onBack={handleBackToDatabaseConfig} />
                  ) : (
                    <TableComponent />
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
            </Box>
          </main>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </div>
    </div>
  );
};

export default Dashboard;
