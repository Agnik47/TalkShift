import {
  Box,
  VStack,
  Text,
  Badge,
  Flex,
  Icon,
  Avatar,
  IconButton,
  InputGroup,
  InputLeftElement,
  Input,
  HStack,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiCircle,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";

const MotionBox = motion(Box);

const UsersList = ({ onlineUsers = [], allMembers = [], onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate offline members
  const offlineMembers = allMembers.filter(
    (member) => !onlineUsers.find((online) => online._id === member._id)
  );

  // Filter users based on search query
  const filteredOnlineUsers = onlineUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOfflineMembers = offlineMembers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      h="100%"
      w="100%"
      bg="white"
      display="flex"
      flexDirection="column"
      boxShadow="xl"
    >
      {/* Header */}
      <Flex
        p="6"
        borderBottom="1px solid"
        borderColor="gray.100"
        align="center"
        justify="space-between"
        position="sticky"
        top="0"
        bg="white"
        zIndex="10"
      >
        <Flex align="center" gap="3">
          <Icon as={FiUsers} fontSize="20px" color="purple.500" />
          <Box>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              Members
            </Text>
            <HStack spacing="1">
              <Badge
                colorScheme="green"
                borderRadius="full"
                px="2"
                py="0.5"
                fontSize="xs"
              >
                {onlineUsers.length} online
              </Badge>
              <Badge
                colorScheme="gray"
                borderRadius="full"
                px="2"
                py="0.5"
                fontSize="xs"
              >
                {offlineMembers.length} offline
              </Badge>
            </HStack>
          </Box>
        </Flex>
        {onClose && (
          <IconButton
            aria-label="Close members"
            icon={<FiX />}
            variant="ghost"
            size="sm"
            onClick={onClose}
            borderRadius="full"
          />
        )}
      </Flex>

      {/* Search */}
      <Box p="4" pb="0">
        <InputGroup size="sm">
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search members..."
            borderRadius="full"
            bg="gray.50"
            border="none"
            focusBorderColor="purple.500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </Box>

      {/* Users List */}
      <Box flex="1" overflowY="auto" p="4">
        <VStack align="stretch" spacing="4">
          {/* Online Users Section */}
          {filteredOnlineUsers.length > 0 && (
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="green.600" mb="2">
                Online
              </Text>
              <VStack align="stretch" spacing="3">
                {filteredOnlineUsers.map((user) => (
                  <MotionBox
                    key={user._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Flex
                      p="3"
                      bg="white"
                      borderRadius="xl"
                      align="center"
                      borderWidth="1px"
                      borderColor="gray.100"
                      _hover={{
                        bg: "gray.50",
                        borderColor: "purple.200",
                        transform: "translateY(-2px)",
                      }}
                      transition="all 0.2s"
                      cursor="pointer"
                      position="relative"
                    >
                      <Avatar
                        size="md"
                        name={user.username}
                        bgGradient="linear(to-r, blue.500, purple.500)"
                        color="white"
                        mr="3"
                      />

                      <Box flex="1">
                        <Flex align="center" gap="2" mb="1">
                          <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            color="gray.800"
                          >
                            {user.username}
                          </Text>
                          {user.isAdmin && (
                            <Badge
                              colorScheme="purple"
                              borderRadius="full"
                              px="2"
                              fontSize="xs"
                            >
                              Admin
                            </Badge>
                          )}
                        </Flex>
                        <Text fontSize="xs" color="gray.500" noOfLines={1}>
                          {user.email}
                        </Text>
                      </Box>

                      <HStack spacing="1">
                       
                        
                        <Flex
                          align="center"
                          bg="green.50"
                          px="3"
                          py="1"
                          borderRadius="full"
                          ml="2"
                        >
                          <Icon
                            as={FiCircle}
                            color="green.400"
                            fontSize="8px"
                            mr="1"
                          />
                          <Text
                            fontSize="xs"
                            color="green.600"
                            fontWeight="medium"
                          >
                            online
                          </Text>
                        </Flex>
                      </HStack>
                    </Flex>
                  </MotionBox>
                ))}
              </VStack>
            </Box>
          )}

          {/* Offline Users Section */}
          {filteredOfflineMembers.length > 0 && (
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="gray.500" mb="2">
                Offline
              </Text>
              <VStack align="stretch" spacing="3">
                {filteredOfflineMembers.map((user) => (
                  <MotionBox
                    key={user._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Flex
                      p="3"
                      bg="gray.50"
                      borderRadius="xl"
                      align="center"
                      borderWidth="1px"
                      borderColor="gray.200"
                      opacity="0.6"
                      _hover={{
                        bg: "gray.100",
                        borderColor: "gray.300",
                        transform: "translateY(-2px)",
                      }}
                      transition="all 0.2s"
                      cursor="default"
                      position="relative"
                    >
                      <Avatar
                        size="md"
                        name={user.username}
                        bgGradient="linear(to-r, gray.400, gray.500)"
                        color="white"
                        mr="3"
                      />

                      <Box flex="1">
                        <Flex align="center" gap="2" mb="1">
                          <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            color="gray.600"
                          >
                            {user.username}
                          </Text>
                          {user.isAdmin && (
                            <Badge
                              colorScheme="purple"
                              borderRadius="full"
                              px="2"
                              fontSize="xs"
                            >
                              Admin
                            </Badge>
                          )}
                        </Flex>
                        <Text fontSize="xs" color="gray.400" noOfLines={1}>
                          {user.email}
                        </Text>
                      </Box>

                      <Flex
                        align="center"
                        bg="gray.200"
                        px="3"
                        py="1"
                        borderRadius="full"
                        ml="2"
                      >
                        <Icon
                          as={FiCircle}
                          color="gray.400"
                          fontSize="8px"
                          mr="1"
                        />
                        <Text
                          fontSize="xs"
                          color="gray.500"
                          fontWeight="medium"
                        >
                          offline
                        </Text>
                      </Flex>
                    </Flex>
                  </MotionBox>
                ))}
              </VStack>
            </Box>
          )}

          {/* Empty state */}
          {filteredOnlineUsers.length === 0 &&
            filteredOfflineMembers.length === 0 && (
              <Flex
                direction="column"
                align="center"
                justify="center"
                py="10"
                textAlign="center"
              >
                <Box
                  w="80px"
                  h="80px"
                  borderRadius="full"
                  bgGradient="linear(to-r, gray.100, gray.200)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb="4"
                >
                  <Icon as={FiUsers} boxSize="8" color="gray.400" />
                </Box>
                <Text color="gray.600" fontWeight="medium">
                  {searchQuery ? "No members found" : "No members"}
                </Text>
                <Text fontSize="sm" color="gray.400" mt="1">
                  {searchQuery
                    ? "Try a different search"
                    : "Invite people to join this group"}
                </Text>
              </Flex>
            )}
        </VStack>
      </Box>

      {/* Footer */}
      <Box p="4" borderTop="1px solid" borderColor="gray.100">
        <Text fontSize="xs" color="gray.500" textAlign="center">
          {onlineUsers.length + offlineMembers.length} members •{" "}
          {onlineUsers.length} online
        </Text>
      </Box>
    </Box>
  );
};

export default UsersList;
