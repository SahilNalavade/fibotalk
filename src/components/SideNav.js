import { useState } from 'react';
import { Box, Button, VStack, Flex, Text, Tooltip } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaHome, FaArchive, FaStar, FaPlusSquare, FaHistory, FaDatabase, FaUser, FaUserCog, FaSignOutAlt } from 'react-icons/fa';

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { label: 'All Reports', icon: FaHome, section: 'Dashboard' },
    { label: 'Archive', icon: FaArchive, section: 'Dashboard' },
    { label: 'Favourites', icon: FaStar, section: 'Dashboard' },
    { label: 'New Report', icon: FaPlusSquare, section: 'Agent' },
    { label: 'History', icon: FaHistory, section: 'Agent' },
    { label: 'Connection', icon: FaDatabase, section: 'Settings' },
    { label: 'User', icon: FaUser, section: 'Settings' },
    { label: 'Accounts', icon: FaUserCog, section: 'Settings' },
    { label: 'Admin', icon: FaUserCog, section: 'Settings' },
  ];

  return (
    <Box
      className={`transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      } h-screen pt-8`}
      style={{ background: '#F1F2F7'}}
    >
      <Flex direction="column" height="100%" position="relative">
        
        <VStack align="start" spacing={4} mt={8} p={4}>
          {navItems.reduce((acc, item, index) => {
            const isFirstOfSection = index === 0 || item.section !== navItems[index - 1].section;
            
            if (isFirstOfSection && isOpen) {
              acc.push(
                <Text key={item.section} fontSize="sm" color="gray.500" mt={index !== 0 ? 6 : 0}>
                  {item.section.toUpperCase()}
                </Text>
              );
            }

            acc.push(
              <Tooltip key={item.label} label={item.label} placement="right" isDisabled={isOpen}>
                <Button 
                  leftIcon={<item.icon color="#4A90E2" />} 
                  variant="ghost" 
                  justifyContent={isOpen ? 'flex-start' : 'center'}
                  w="100%"
                  colorScheme="blue"
                  size="sm"
                  _hover={{ bg: isOpen ? '#E6EAF3' : 'transparent' }}
                  _active={{ bg: isOpen ? '#E6EAF3' : 'transparent' }}
                  bg={isOpen && item.label === 'All Reports' ? '#E6EAF3' : 'transparent'}
                  color={item.label === 'All Reports' && isOpen ? '#4A90E2' : 'gray.500'}
                  borderRadius="md"
                >
                  {isOpen && <Text ml={2}>{item.label}</Text>}
                </Button>
              </Tooltip>
            );

            return acc;
          }, [])}
        </VStack>

        <Box mt="auto" mb={4} p={4}>
          <Tooltip label="Logout" placement="right" isDisabled={isOpen}>
            <Button 
              leftIcon={<FaSignOutAlt />} 
              variant="ghost" 
              justifyContent={isOpen ? 'flex-start' : 'center'}
              w="100%"
              size="sm"
              color="gray.500"
              _hover={{ bg: isOpen ? '#E6EAF3' : 'transparent' }}
              _active={{ bg: isOpen ? '#E6EAF3' : 'transparent' }}
            >
              {isOpen && <Text ml={2}>Logout</Text>}
            </Button>
          </Tooltip>
        </Box>

        {!isOpen && (
          <Button
            onClick={toggleNav}
            variant="ghost"
            style={{ 
              position: 'absolute', 
              bottom: '10px', 
              left: '50%', 
              transform: 'translateX(-50%)' 
            }}
            _hover={{ bg: 'transparent' }}  // Prevent background color change on hover
            _active={{ bg: 'transparent' }} // Prevent background color change on active
          >
            <ChevronRightIcon />
          </Button>
        )}

        {isOpen && (
          <Button
            onClick={toggleNav}
            variant="ghost"
            style={{ 
              position: 'absolute', 
              top: '50%', 
              right: '-16px', 
              transform: 'translateY(-50%)'
            }}
            _hover={{ bg: 'transparent' }}  // Prevent background color change on hover
            _active={{ bg: 'transparent' }} // Prevent background color change on active
          >
            <ChevronLeftIcon />
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default SideNav;
