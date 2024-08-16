import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Switch,
  Flex,
  useToast,
} from '@chakra-ui/react';

const APIKeysPage = () => {
  const [apiKeys, setApiKeys] = useState([
    { name: 'PrimeAPI', secretKey: 'skssdsdsfdsfdf-12345678cTIV', tracking: false, lastUsed: '29/07/2024 2:07 PM' },
    { name: 'AuraAPI', secretKey: '2sk-87654321mAi8', tracking: false, lastUsed: '29/07/2024 2:07 PM' },
    { name: 'BreezeAPI', secretKey: '2sk-abcdefXico', tracking: false, lastUsed: '29/07/2024 2:07 PM' },
    { name: 'MyAPI', secretKey: '2sk-1234abcdXico', tracking: false, lastUsed: '29/07/2024 2:07 PM' },
    { name: 'NewAPI', secretKey: '2sk-zyxwvutsjv23', tracking: true, lastUsed: '29/07/2024 2:07 PM' },
  ]);

  const toast = useToast();

  const handleToggle = (index) => {
    const updatedKeys = apiKeys.map((key, i) => ({
      ...key,
      tracking: i === index ? !key.tracking : false,
    }));
    setApiKeys(updatedKeys);

    const toggledKey = updatedKeys[index];
    toast({
      title: 'API Key Status Updated',
      description: `Tracking has been ${toggledKey.tracking ? 'enabled' : 'disabled'} for ${toggledKey.name}.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return (
    <TableContainer boxShadow="lg" borderRadius="lg">
      <Table variant="simple" size="md">
        <Thead bg="gray.100">
          <Tr>
            <Th fontSize="md">NAME</Th>
            <Th fontSize="md">SECRET KEY</Th>
            <Th fontSize="md">TRACKING</Th>
            <Th fontSize="md">LAST USED</Th>
          </Tr>
        </Thead>
        <Tbody>
          {apiKeys.map((key, index) => (
            <Tr
              key={index}
              _hover={{ bg: 'gray.50' }}
              transition="all 0.2s"
            >
              <Td fontWeight="medium">{key.name}</Td>
              <Td>
                <Text as="span" bg="gray.100" p={1} borderRadius="md">
                  {key.secretKey}
                </Text>
              </Td>
              <Td>
                <Flex alignItems="center">
                  <Switch
                    colorScheme="teal"
                    isChecked={key.tracking}
                    onChange={() => handleToggle(index)}
                  />
                  <Text
                    color={key.tracking ? 'green.500' : 'red.500'}
                    ml={3}
                    fontWeight="medium"
                  >
                    {key.tracking ? 'Enabled' : 'Disabled'}
                  </Text>
                </Flex>
              </Td>
              <Td>
                <Text fontSize="sm" color="gray.600">
                  {key.lastUsed}
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default APIKeysPage;
