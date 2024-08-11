import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import TopNav from './TopNav';
import SideNav from './SideNav';
import { useAuth } from '../auth'; // Adjust path if necessary
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    useColorModeValue
  } from '@chakra-ui/react';
const Reports = () => {
  const { isSignedIn } = useAuth(); // Check if the user is signed in

  return (
    <div className="Dashboard flex flex-col h-screen">
    <TopNav />
    <div className="flex flex-grow overflow-hidden">

        <SideNav />
        <main className="flex-grow p-4" style={{ paddingTop: '64px'}}>
          {/* content */}
        </main>
</div>
    </div>
  );
};

export default Reports;