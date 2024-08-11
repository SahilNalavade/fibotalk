// Dashboard.js
import React from 'react';
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn
} from '@clerk/clerk-react';
import TopNav from './TopNav';
import SideNav from './SideNav';
import '../App.css';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue
} from '@chakra-ui/react';
import ConnectForm from './ConnectForm'; // Import the ConnectForm component
import APIForm from './APIForm';

const Dashboard = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <div className="Dashboard flex flex-col h-screen">
      <TopNav />
      <div className="flex flex-grow overflow-hidden">
        <SignedIn>
          <SideNav />
          <main className="flex-grow p-4" style={{ paddingTop: '64px', backgroundColor: bgColor }}>
            <Tabs pt={12}>
              <TabList mb="1em">
                <Tab>API Key</Tab>
                <Tab>Database Configuration</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <APIForm />
                </TabPanel>
                <TabPanel>
                  <ConnectForm /> 
                </TabPanel>
              </TabPanels>
            </Tabs>
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