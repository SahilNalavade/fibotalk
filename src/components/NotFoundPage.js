import React from 'react';
import { Box, Heading, Text, Button, VStack, Image, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const bgColor = useColorModeValue('white');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const buttonColor = useColorModeValue('blue.600', 'blue.400');
  const headingColor = useColorModeValue('black', 'white');
  
  // Framer Motion Variants
  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <Box 
      textAlign="center" 
      py={10} 
      px={6} 
      height="100vh"
      bg={bgColor}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <VStack spacing={4} maxW="lg" mx="auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <Image 
            src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif" 
            alt="404 Animated Image" 
            borderRadius="full"
            boxSize="120px"
            objectFit="cover"
            mb={4}
          />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={textVariants}
          whileHover={{ cursor: 'pointer', scale: 1.1 }}
          onClick={() => window.location.reload()}
        >
          <Heading 
            as="h1" 
            fontSize="8xl" 
            color={headingColor}  // Set the 404 text color to black or white based on mode
            textShadow="2px 2px 10px rgba(0, 0, 0, 0.3)"
          >
            404
          </Heading>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <Text 
            fontSize="lg" 
            color={textColor}
          >
            We couldn't find the page you're looking for.
          </Text>
          <Text 
            fontSize="md" 
            color={textColor}
            maxW="sm"
          >
Please check the URL or return to the homepage.
          </Text>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={textVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Link to="/">
            <Button 
              colorScheme="blue" 
              bg={'black'}
              color="white"
              variant="solid"
              size="md"
              mt={6}
            >
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </VStack>
    </Box>
  );
}

export default NotFoundPage;
