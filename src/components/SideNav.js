import { useState } from 'react';
import { Box, Button, VStack, Flex, Text, Tooltip } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaHome, FaArchive, FaStar, FaPlusSquare, FaHistory, FaDatabase, FaUser, FaUserCog, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { label: 'All Reports', icon: FaHome, section: 'Dashboard', path: '/' },
    { label: 'Archive', icon: FaArchive, section: 'Dashboard', path: '/archive' },
    { label: 'Favourites', icon: FaStar, section: 'Dashboard', path: '/favourites' },
    { label: 'New Report', icon: FaPlusSquare, section: 'Agent', path: '/chat-page' },
    { label: 'History', icon: FaHistory, section: 'Agent', path: '/history' },
    { label: 'Connection', icon: FaDatabase, section: 'Settings', path: '/connections' },
    { label: 'User', icon: FaUser, section: 'Settings', path: '/user' },
    { label: 'Accounts', icon: FaUserCog, section: 'Settings', path: '/accounts' },
    { label: 'Admin', icon: FaShieldAlt, section: 'Settings', path: '/admin' },
  ];

  return (
    <Box
      className={`transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      } h-screen pt-8`}
      style={{ background: '#F9FAFD' }}
    >
      <Flex direction="column" height="100%" position="relative">
        
        <VStack 
          align="start" 
          spacing={4} 
          mt={isOpen ? 20 : 8} // Adjust top margin when expanded
          p={4}
        >
          {navItems.reduce((acc, item, index) => {
            const isFirstOfSection = index === 0 || item.section !== navItems[index - 1].section;
            
            if (isFirstOfSection && isOpen) {
              acc.push(
                <Text key={item.section} fontSize="xs" color="gray.600" mt={index !== 0 ? 6 : 0}>
                  {item.section.toUpperCase()}
                </Text>
              );
            }

            acc.push(
              <Tooltip key={item.label} label={item.label} placement="right" isDisabled={isOpen}>
                <Link to={item.path} style={{ width: '100%' }}>
                  <Button 
                    leftIcon={<item.icon color="#4A90E2" />} 
                    variant="ghost" 
                    justifyContent={isOpen ? 'flex-start' : 'center'}
                    w="100%"
                    colorScheme="blue"
                    size="sm"
                    _hover={{ bg: isOpen ? '#E2E8F8' : 'transparent' }}
                    _active={{ bg: isOpen ? '#E2E8F8' : 'transparent' }}
                    bg="transparent"
                    color="gray.700"
                    borderRadius="md"
                    fontWeight="normal"
                    fontSize="sm"
                  >
                    {isOpen && <Text ml={2}>{item.label}</Text>}
                  </Button>
                </Link>
              </Tooltip>
            );

            return acc;
          }, [])}
        </VStack>

        <Box mt="auto" mb={4} p={4}>
          <Tooltip label="Logout" placement="right" isDisabled={isOpen}>
            <Flex justifyContent={isOpen ? 'flex-end' : 'center'}>
              <Button 
                leftIcon={<FaSignOutAlt />} 
                variant="ghost" 
                justifyContent="center"
                w={isOpen ? 'auto' : '100%'} // Adjust width based on open/closed state
                size="sm"
                color="gray.700"
                _hover={{ bg: isOpen ? '#E6EAF3' : 'transparent' }}
                _active={{ bg: isOpen ? '#E6EAF3' : 'transparent' }}
              >
                {isOpen && 
                <Text ml={2}>Logout</Text>}
              </Button>
            </Flex>
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
            _hover={{ bg: 'transparent' }}  
            _active={{ bg: 'transparent' }}
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
            _hover={{ bg: 'transparent' }} 
            _active={{ bg: 'transparent' }} 
          >
            <ChevronLeftIcon />
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default SideNav;
