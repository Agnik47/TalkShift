import {
  Box,
  VStack,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Flex,
  Icon,
  Tooltip,
  Avatar,
  Badge,
  InputGroup,
  InputLeftElement,
  Divider,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import {
  FiLogOut,
  FiPlus,
  FiUsers,
  FiSearch,
  FiMessageSquare,
  FiGlobe,
} from "react-icons/fi";
import { RiGroupFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import PropTypes from 'prop-types';

const MotionBox = motion(Box);

const Sidebar = ({ setSelectedGroup, selectedGroup }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const URL = "http://localhost:5000";

  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const token = userInfo?.token;
  const navigate = useNavigate();

  const fetchGroups = useCallback(async () => {
    try {
      const { data } = await axios.get(`${URL}/api/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGroups(data);

      const joined = data
        .filter((group) => group.members.some((m) => m._id === userInfo._id))
        .map((group) => group._id);

      setUserGroups(joined);
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to load groups",
        status: "error",
        duration: 3000,
      });
    }
  }, [token, userInfo._id, toast]);

  useEffect(() => {
    setIsAdmin(userInfo?.isAdmin || false);
    fetchGroups();
  }, [userInfo?.isAdmin, fetchGroups]);

  const createGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      await axios.post(
        `${URL}/api/groups`,
        {
          name: newGroupName,
          description: newGroupDescription,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Group created",
        status: "success",
        duration: 3000,
      });

      onClose();
      setNewGroupName("");
      setNewGroupDescription("");
      fetchGroups();
    } catch (err) {
      toast({
        title: err.response?.data?.message || "Error creating group",
        status: "error",
      });
    }
  };

  const joinGroup = async (groupId) => {
    try {
      await axios.post(
        `${URL}/api/groups/${groupId}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Joined group",
        status: "success",
        duration: 2000,
        position: "top-right",
      });

      fetchGroups();
    } catch (err) {
      toast({
        title: err.response?.data?.message || "Join failed",
        status: "error",
      });
    }
  };

  const leaveGroup = async (groupId) => {
    try {
      await axios.post(
        `${URL}/api/groups/${groupId}/leave`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Left group",
        status: "info",
        duration: 2000,
        position: "top-right",
      });

      fetchGroups();
    } catch (err) {
      toast({
        title: err.response?.data?.message || "Leave failed",
        status: "error",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const joinedGroups = filteredGroups.filter((group) =>
    userGroups.includes(group._id)
  );
  const availableGroups = filteredGroups.filter(
    (group) => !userGroups.includes(group._id)
  );

  return (
    <Box
      h="100%"
      display="flex"
      flexDirection="column"
      bg="white"
      boxShadow="xl"
      position="relative"
    >
      {/* Header */}
      <Box
        p={{ base: "4", md: "6" }}
        pb="4"
        bgGradient="linear(to-r, blue.600, purple.600)"
        color="white"
        borderBottomRadius="xl"
      >
        <Flex justify="space-between" align="center" mb="4">
          <Flex align="center" gap="3">
            <Avatar
              size="sm"
              name={userInfo?.username}
              bg="white"
              color="blue.600"
              fontWeight="bold"
            />
            <Box>
              <Text fontWeight="bold" fontSize="lg">
                {userInfo?.username || "User"}
              </Text>
              <Text fontSize="xs" opacity="0.9">
                {userInfo?.email || "user@example.com"}
              </Text>
            </Box>
          </Flex>
          {isAdmin && (
            <Tooltip label="Create Group" placement="bottom">
              <Button
                size="sm"
                onClick={onOpen}
                colorScheme="whiteAlpha"
                _hover={{ bg: "whiteAlpha.300" }}
                borderRadius="full"
              >
                <FiPlus />
              </Button>
            </Tooltip>
          )}
        </Flex>

        <InputGroup size="sm">
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="whiteAlpha.700" />
          </InputLeftElement>
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            color="white"
            _placeholder={{ color: "whiteAlpha.700" }}
            bg="whiteAlpha.200"
            border="none"
            borderRadius="full"
            focusBorderColor="white"
            _hover={{ bg: "whiteAlpha.300" }}
          />
        </InputGroup>
      </Box>

      {/* Group Lists */}
      <Box flex="1" overflowY="auto" p={{ base: "4", md: "6" }}>
        {/* Joined Groups */}
        {joinedGroups.length > 0 && (
          <Box mb="6">
            <Flex align="center" gap="2" mb="3">
              <Icon as={FiMessageSquare} color="green.500" />
              <Text fontWeight="semibold" color="gray.700">
                Your Groups
              </Text>
              <Badge
                colorScheme="green"
                borderRadius="full"
                px="2"
                fontSize="xs"
              >
                {joinedGroups.length}
              </Badge>
            </Flex>
            <VStack spacing="3" align="stretch">
              {joinedGroups.map((group) => (
                <MotionBox
                  key={group._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Box
                    p="3"
                    borderRadius="xl"
                    bg={
                      selectedGroup?._id === group._id ? "blue.50" : "gray.50"
                    }
                    border="2px solid"
                    borderColor={
                      selectedGroup?._id === group._id
                        ? "blue.200"
                        : "transparent"
                    }
                    cursor="pointer"
                    onClick={() => setSelectedGroup(group)}
                    transition="all 0.2s"
                    _hover={{
                      bg:
                        selectedGroup?._id === group._id
                          ? "blue.100"
                          : "gray.100",
                      borderColor: "blue.300",
                    }}
                  >
                    <Flex justify="space-between" align="center">
                      <Flex align="center" gap="3">
                        <Avatar
                          size="sm"
                          name={group.name}
                          bgGradient="linear(to-r, blue.500, purple.500)"
                          color="white"
                          icon={<RiGroupFill />}
                        />
                        <Box>
                          <Flex align="center" gap="2">
                            <Text fontWeight="semibold" color="gray.800">
                              {group.name}
                            </Text>
                            <Badge
                              size="xs"
                              colorScheme="green"
                              borderRadius="full"
                              variant="subtle"
                            >
                              Joined
                            </Badge>
                          </Flex>
                          <Text fontSize="xs" color="gray.600" noOfLines={1}>
                            {group.description || "No description"}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {group.members?.length || 0} members
                          </Text>
                        </Box>
                      </Flex>
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          leaveGroup(group._id);
                        }}
                        borderRadius="full"
                        px="4"
                      >
                        Leave
                      </Button>
                    </Flex>
                  </Box>
                </MotionBox>
              ))}
            </VStack>
          </Box>
        )}

        <Divider my="4" />

        {/* Available Groups */}
        {availableGroups.length > 0 && (
          <Box>
            <Flex align="center" gap="2" mb="3">
              <Icon as={FiGlobe} color="blue.500" />
              <Text fontWeight="semibold" color="gray.700">
                Discover Groups
              </Text>
              <Badge
                colorScheme="blue"
                borderRadius="full"
                px="2"
                fontSize="xs"
              >
                {availableGroups.length}
              </Badge>
            </Flex>
            <VStack spacing="3" align="stretch">
              {availableGroups.map((group) => {
                const joined = userGroups.includes(group._id);
                return (
                  <MotionBox
                    key={group._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Box
                      p="3"
                      borderRadius="xl"
                      bg="gray.50"
                      cursor="pointer"
                      onClick={async () => {
                        if (!joined) {
                          await joinGroup(group._id);
                        }
                        setSelectedGroup(group);
                      }}
                      transition="all 0.2s"
                      _hover={{ bg: "gray.100" }}
                    >
                      <Flex justify="space-between" align="center">
                        <Flex align="center" gap="3">
                          <Avatar
                            size="sm"
                            name={group.name}
                            bgGradient="linear(to-r, gray.500, gray.600)"
                            color="white"
                            icon={<RiGroupFill />}
                          />
                          <Box>
                            <Text fontWeight="semibold" color="gray.800">
                              {group.name}
                            </Text>
                            <Text fontSize="xs" color="gray.600" noOfLines={1}>
                              {group.description || "No description"}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {group.members?.length || 0} members
                            </Text>
                          </Box>
                        </Flex>
                        <Button
                          size="sm"
                          colorScheme={joined ? "red" : "blue"}
                          variant={joined ? "outline" : "solid"}
                          onClick={(e) => {
                            e.stopPropagation();
                            joined
                              ? leaveGroup(group._id)
                              : joinGroup(group._id);
                          }}
                          borderRadius="full"
                          px="4"
                        >
                          {joined ? "Leave" : "Join"}
                        </Button>
                      </Flex>
                    </Box>
                  </MotionBox>
                );
              })}
            </VStack>
          </Box>
        )}

        {filteredGroups.length === 0 && (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py="10"
            textAlign="center"
          >
            <Icon as={FiUsers} boxSize="12" color="gray.300" mb="3" />
            <Text color="gray.500" fontWeight="medium">
              No groups found
            </Text>
            <Text fontSize="sm" color="gray.400" mt="1">
              {searchQuery
                ? "Try a different search"
                : "Create your first group!"}
            </Text>
          </Flex>
        )}
      </Box>

      {/* Logout Button */}
      <Box p={{ base: "4", md: "6" }} pt="0">
        <Button
          onClick={logout}
          colorScheme="red"
          variant="ghost"
          width="full"
          leftIcon={<FiLogOut />}
          borderRadius="xl"
          size="lg"
          _hover={{ bg: "red.50", transform: "translateY(-2px)" }}
          transition="all 0.2s"
        >
          Logout
        </Button>
      </Box>

      {/* Create Group Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" overflow="hidden">
          <Box
            bgGradient="linear(to-r, blue.600, purple.600)"
            color="white"
            p="6"
          >
            <ModalHeader p="0" mb="2">
              Create New Group
            </ModalHeader>
            <ModalCloseButton color="white" />
            <Text fontSize="sm" opacity="0.9">
              Start a new conversation with your team
            </Text>
          </Box>
          <ModalBody p="6">
            <FormControl mb="4">
              <FormLabel fontWeight="medium">Group Name</FormLabel>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiUsers} color="gray.400" />
                </InputLeftElement>
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name"
                  borderRadius="xl"
                  focusBorderColor="blue.500"
                />
              </InputGroup>
            </FormControl>

            <FormControl mb="6">
              <FormLabel fontWeight="medium">Description</FormLabel>
              <Input
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                placeholder="What's this group about?"
                size="lg"
                borderRadius="xl"
                focusBorderColor="blue.500"
              />
            </FormControl>

            <HStack spacing="4">
              <Button
                flex="1"
                onClick={onClose}
                size="lg"
                borderRadius="xl"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                flex="1"
                onClick={createGroup}
                size="lg"
                borderRadius="xl"
                bgGradient="linear(to-r, blue.500, purple.500)"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, blue.600, purple.600)",
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                transition="all 0.2s"
                isDisabled={!newGroupName.trim()}
              >
                Create Group
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

Sidebar.propTypes = {
  setSelectedGroup: PropTypes.func.isRequired,
  selectedGroup: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    members: PropTypes.array,
  }),
};

export default Sidebar;