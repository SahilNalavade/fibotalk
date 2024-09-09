import { useState } from 'react';
import { Box, Button, VStack, Flex, Text, Tooltip } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaHome, FaArchive, FaStar, FaPlusSquare, FaHistory, FaDatabase, FaUser, FaUserCog, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useClerk } from '@clerk/clerk-react'; // Import useClerk
import { v4 as uuidv4 } from 'uuid'; // Import uuid to generate unique IDs

const SideNav = () => {
  const navigate = useNavigate(); // Initialize the navigate hook
  const [isOpen, setIsOpen] = useState(true);
  const { signOut } = useClerk(); // Destructure signOut from useClerk

  // Function to start a new chat and navigate to the new chat URL
  const startNewChat = () => {
    const chatId = uuidv4(); // Generate a unique chat ID
    navigate(`/chat-page/${chatId}`); // Navigate to the new chat URL with the unique chat ID
  };

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { label: 'All Reports', icon: FaHome, section: 'Dashboard', path: '/' },
    { label: 'Archive', icon: FaArchive, section: 'Dashboard', path: '/archive' },
    { label: 'Favourites', icon: FaStar, section: 'Dashboard', path: '/favourites' },
    // Change the New Report button to use the startNewChat function
    { label: 'New Report', icon: FaPlusSquare, section: 'Agent', onClick: startNewChat },
    { label: 'History', icon: FaHistory, section: 'Agent', path: '/history' },
    { label: 'Connection', icon: FaDatabase, section: 'Settings', path: '/connections' },
    { label: 'User', icon: FaUser, section: 'Settings', path: '/user' },
    { label: 'Accounts', icon: FaUserCog, section: 'Settings', path: '/accounts' },
    { label: 'Admin', icon: FaShieldAlt, section: 'Settings', path: '/admin' },
  ];

  return (
    <Box
      className={`transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} h-screen pt-8`}
      style={{ background: '#F9FAFD' }}
    >
      <Flex direction="column" height="100%" position="relative">
        <VStack align="start" spacing={4} mt={isOpen ? 20 : 8} p={4}>
          {navItems.reduce((acc, item, index) => {
            const isFirstOfSection = index === 0 || item.section !== navItems[index - 1].section;

            if (isFirstOfSection && isOpen) {
              acc.push(
                <Text key={item.section} fontSize="xs" color="gray.600" mt={index !== 0 ? 6 : 0}>
                  {item.section.toUpperCase()}
                </Text>
              );
            }

            // Conditionally render the button with a click handler if onClick is defined, otherwise use Link
            acc.push(
              <Tooltip key={item.label} label={item.label} placement="right" isDisabled={isOpen}>
                {item.onClick ? (
                  <Button
                    leftIcon={<item.icon color="#4A90E2" />}
                    variant="ghost"
                    justifyContent={isOpen ? 'flex-start' : 'center'}
                    w="100%"
                    colorScheme="blue"
                    size="sm"
                    onClick={item.onClick} // Use onClick if defined
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
                ) : (
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
                )}
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
                w={isOpen ? 'auto' : '100%'}
                size="sm"
                color="gray.700"
                _hover={{ bg: isOpen ? '#E6EAF3' : 'transparent' }}
                _active={{ bg: isOpen ? '#E6EAF3' : 'transparent' }}
                onClick={signOut} // Call signOut on click
              >
                {isOpen && <Text ml={2}>Logout</Text>}
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
              transform: 'translateX(-50%)',
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
              transform: 'translateY(-50%)',
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
