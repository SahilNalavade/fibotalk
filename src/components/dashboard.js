// Dashboard.js
import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import TopNav from './TopNav';
import SideNav from './SideNav';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Box,
  Text,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import ConnectForm from './ConnectForm';
import TableComponent from './TableComponent';
import APIList from './APIList';

const Dashboard = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const breadcrumbColor = useColorModeValue('gray.600', 'gray.300');
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [apiKeys, setApiKeys] = useState([]);

  // Load the active tab index from local storage on component mount
  useEffect(() => {
    const savedTabIndex = localStorage.getItem('activeTabIndex');
    if (savedTabIndex !== null) {
      setActiveTabIndex(Number(savedTabIndex));
    }
  }, []);

  // Save the active tab index to local storage when it changes
  const handleTabChange = (index) => {
    setActiveTabIndex(index);
    localStorage.setItem('activeTabIndex', index);
  };

  const handleAddDatabase = () => {
    setShowConnectForm(true);
    setActiveTabIndex(1); // Switch to the Database Configuration tab
    localStorage.setItem('activeTabIndex', 1);
  };

  const handleBackToDatabaseConfig = () => {
    setShowConnectForm(false);
    setActiveTabIndex(0); // Switch to the API Key tab
    localStorage.setItem('activeTabIndex', 0);
  };

  const handleSaveAPIKey = (apiKeyData) => {
    setApiKeys([...apiKeys, apiKeyData]); // Update state with new API key
  };

  const handleSaveSuccess = () => {
    setShowConnectForm(false); // Hide the form and show the table component
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
          <main className="flex-grow p-4" style={{ paddingTop: '105px', backgroundColor: bgColor }}>
            <Box maxWidth="90%" mx="auto">
              <Box mt={4}>
                <Breadcrumb
                  spacing="8px"
                  separator={<ChevronRightIcon color={breadcrumbColor} boxSize="18px" />}
                  fontSize="lg"
                  color={breadcrumbColor}
                  mb={14}
                >
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" fontSize="lg">
                      Connection
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem isCurrentPage>
                    <Text fontWeight="semibold" fontSize="lg">
                      {getCurrentBreadcrumb()}
                    </Text>
                  </BreadcrumbItem>
                </Breadcrumb>
              </Box>

              <Tabs index={activeTabIndex} onChange={handleTabChange}>
                <TabList mb="1em">
                  <Tab>API Key</Tab>
                  <Tab>Database Configuration</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <APIList apiKeys={apiKeys} onSave={handleSaveAPIKey} />
                  </TabPanel>
                  <TabPanel>
                    {showConnectForm ? (
                      <ConnectForm onBack={handleBackToDatabaseConfig} onSaveSuccess={handleSaveSuccess} />
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
