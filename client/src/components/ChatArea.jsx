import {
  Box,
  VStack,
  Text,
  Flex,
  Avatar,
  Badge,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  IconButton,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  HStack,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import {
  FiSend,
  FiPaperclip,
  FiSmile,
  FiMoreVertical,
  FiUserPlus,
  FiSettings,
  FiBell,
  FiVideo,
  FiPhone,
  FiMic,
  FiChevronLeft,
} from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import UsersList from "./UsersList";
import axios from "axios";

const MotionBox = motion(Box);

const ChatArea = ({ socket, selectedGroup, onMenuClick, isMobile }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]); // Only online users
  const [groupMembers, setGroupMembers] = useState([]); // All group members
  const [loading, setLoading] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const token = userInfo?.token;

  useEffect(() => {
    if (!selectedGroup || !socket) return;

    console.log("Setting up socket listeners for group:", selectedGroup._id);

    fetchMessages();
    fetchGroupMembers();

    // Join room
    socket.emit("join room", selectedGroup._id);

    // Cleanup old listeners first to prevent duplicates
    socket.off("message recived");
    socket.off("usersInRoom");
    socket.off("notification");
    socket.off("user typing");
    socket.off("user stop typing");

    // Listen for messages
    socket.on("message recived", (message) => {
      console.log("Message received on socket:", message);
      setMessages((prev) => [...prev, message]);
    });

    // Listen for user list updates (only online/connected users)
    socket.on("usersInRoom", (users) => {
      console.log("Users in room:", users);
      setConnectedUsers(users);
    });

    // Listen for notifications
    socket.on("notification", (notification) => {
      console.log("Notification received:", notification);
      toast({
        title:
          notification.type === "USER_JOINED" ? "User Joined" : "User Left",
        description: notification.message,
        status: notification.type === "USER_JOINED" ? "success" : "warning",
        duration: 2000,
        position: "top-right",
      });
    });

    // Typing indicator
    socket.on("user typing", ({ username }) => {
      console.log("User typing:", username);
      setTypingUsers((prev) => {
        if (!prev.includes(username)) {
          return [...prev, username];
        }
        return prev;
      });
    });

    // Stop typing
    socket.on("user stop typing", ({ username }) => {
      console.log("User stopped typing:", username);
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    });

    return () => {
      console.log("Cleaning up socket listeners for group:", selectedGroup._id);
      socket.emit("leave room", selectedGroup._id);
      socket.off("message recived");
      socket.off("usersInRoom");
      socket.off("notification");
      socket.off("user typing");
      socket.off("user stop typing");
    };
  }, [selectedGroup, socket, toast]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${URL}/api/messages/${selectedGroup._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMessages(data.reverse());
    } catch (err) {
      console.error("Error fetching messages:", err);
      toast({
        title: "Failed to load messages",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupMembers = async () => {
    try {
      const { data } = await axios.get(`${URL}/api/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const group = data.find((g) => g._id === selectedGroup._id);
      if (group) {
        setGroupMembers(group.members || []);
      }
    } catch (err) {
      console.error("Error fetching members:", err);
    }
  };

  // ✅ AI SUMMARY FUNCTION
  const generateSummary = async () => {
    try {
      console.log("Generating AI Summary for group:", selectedGroup._id);

      const { data } = await axios.post(
        `${URL}/api/ai/summary/${selectedGroup._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log("Summary Response:", data);

      const aiMessage = {
        _id: `ai-${Date.now()}`,
        sender: {
          _id: "ai-bot",
          username: "AI Assistant",
          avatar: null,
        },
        content: data.summary,
        createdAt: new Date().toISOString(),
        isSystem: true,
      };

      console.log("AI Message Object:", aiMessage);

      // Add locally first
      setMessages((prev) => {
        console.log("Adding AI message to local state");
        return [...prev, aiMessage];
      });

      // Emit to other users
      if (socket && socket.connected) {
        console.log("Emitting AI message through socket");
        socket.emit("message recived", {
          groupId: selectedGroup._id,
          message: aiMessage,
        });
      } else {
        console.warn("Socket not connected");
      }

      toast({
        title: "AI Summary Generated",
        status: "success",
        duration: 2000,
        position: "top-right",
      });
    } catch (err) {
      console.error("AI Summary Error:", err);
      toast({
        title: "AI Summary Failed",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !socket || !selectedGroup) return;

    const trimmedMessage = newMessage.trim();

    // ✅ Command detection - More robust check
    if (
      trimmedMessage === "\\summary" ||
      trimmedMessage === "\\summary" ||
      trimmedMessage.toLowerCase() === "/summary"
    ) {
      console.log("Summary command detected");
      setNewMessage("");
      await generateSummary();
      return;
    }

    try {
      const { data } = await axios.post(
        `${URL}/api/messages`,
        {
          content: newMessage,
          groupId: selectedGroup._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Emit to other users in the room
      socket.emit("message recived", {
        groupId: selectedGroup._id,
        message: data,
      });

      // Add to local messages
      setMessages((prev) => [...prev, data]);
      setNewMessage("");

      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast({
        title: "Failed to send message",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!selectedGroup) {
    return null;
  }

  return (
    <Flex h="100%" direction="column" position="relative">
      {/* Chat Header */}
      <Box
        p={{ base: "4", md: "6" }}
        borderBottom="1px solid"
        borderColor="gray.100"
        bg="white"
        position="sticky"
        top="0"
        zIndex="10"
        backdropFilter="blur(10px)"
      >
        <Flex justify="space-between" align="center">
          <Flex align="center" gap="3">
            {isMobile && (
              <IconButton
                aria-label="Back to groups"
                icon={<FiChevronLeft />}
                variant="ghost"
                onClick={onMenuClick}
                size="sm"
              />
            )}
            <Avatar
              size="md"
              name={selectedGroup.name}
              bgGradient="linear(to-r, blue.500, purple.500)"
              color="white"
              icon={<RiRobot2Line />}
            />
            <Box>
              <Flex align="center" gap="2">
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  {selectedGroup.name}
                </Text>
                <Badge
                  colorScheme="green"
                  borderRadius="full"
                  px="2"
                  fontSize="xs"
                >
                  {connectedUsers.length} online
                </Badge>
              </Flex>
              <Text fontSize="sm" color="gray.500">
                {selectedGroup.description || "Group chat"}
              </Text>
            </Box>
          </Flex>

          <HStack spacing="2">
            <Tooltip label="AI Summary">
              <IconButton
                aria-label="Generate AI summary"
                icon={<RiRobot2Line />}
                variant="ghost"
                colorScheme="purple"
                size="sm"
                onClick={generateSummary}
              />
            </Tooltip>
            <Tooltip label="Voice Call">
              <IconButton
                aria-label="Voice call"
                icon={<FiPhone />}
                variant="ghost"
                colorScheme="blue"
                size="sm"
              />
            </Tooltip>
            <Tooltip label="Video Call">
              <IconButton
                aria-label="Video call"
                icon={<FiVideo />}
                variant="ghost"
                colorScheme="purple"
                size="sm"
              />
            </Tooltip>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<FiMoreVertical />}
                variant="ghost"
                size="sm"
              />
              <MenuList minW="200px" borderRadius="xl">
                <MenuItem icon={<FiUserPlus />} onClick={onOpen}>
                  Invite People
                </MenuItem>
                <MenuItem
                  icon={<FiSettings />}
                  onClick={() => setShowMembers(!showMembers)}
                >
                  View Members
                </MenuItem>
                <MenuItem icon={<FiBell />}>Notification Settings</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Box>

      {/* Messages Area */}
      <Box
        flex="1"
        overflowY="auto"
        p={{ base: "4", md: "6" }}
        bgGradient="linear(to-b, gray.50, white)"
        position="relative"
      >
        {loading ? (
          <Flex justify="center" align="center" h="100%">
            <Box textAlign="center">
              <MotionBox
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                display="inline-block"
                mb="4"
              >
                <Icon as={RiRobot2Line} boxSize={10} color="blue.500" />
              </MotionBox>
              <Text color="gray.500">Loading messages...</Text>
            </Box>
          </Flex>
        ) : (
          <AnimatePresence>
            <VStack spacing="4" align="stretch">
              {messages.map((message, index) => {
                const isAI = message.sender?.username === "AI Assistant" || message.isSystem === true;
                const isCurrentUser = message.sender?._id === userInfo._id && !isAI;
                const showAvatar =
                  index === 0 ||
                  messages[index - 1]?.sender?._id !== message.sender?._id;

                if (!message || !message.content) {
                  console.warn("Invalid message object:", message);
                  return null;
                }

                return (
                  <MotionBox
                    key={message._id || `msg-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Flex
                      justify={
                        isAI
                          ? "center"
                          : isCurrentUser
                            ? "flex-end"
                            : "flex-start"
                      }
                      gap="3"
                    >
                      {!isCurrentUser && showAvatar && !isAI && (
                        <Avatar
                          size="sm"
                          name={message.sender?.username}
                          src={message.sender?.avatar}
                          mt="2"
                        />
                      )}

                      {!isCurrentUser && !showAvatar && !isAI && (
                        <Box w="32px" />
                      )}

                      <Box
                        maxW={{ base: "80%", md: "70%" }}
                        bg={
                          isAI
                            ? "linear(135deg, purple.50 0%, indigo.50 100%)"
                            : isCurrentUser
                              ? "blue.500"
                              : "white"
                        }
                        bgGradient={
                          isAI
                            ? "linear(135deg, purple.50 0%, indigo.50 100%)"
                            : "transparent"
                        }
                        color={
                          isAI
                            ? "purple.900"
                            : isCurrentUser
                              ? "white"
                              : "gray.800"
                        }
                        px="4"
                        py="3"
                        borderRadius="2xl"
                        borderBottomLeftRadius={
                          isAI ? "2xl" : isCurrentUser ? "2xl" : "0"
                        }
                        borderBottomRightRadius={
                          isAI ? "2xl" : isCurrentUser ? "0" : "2xl"
                        }
                        boxShadow={isAI ? "md" : "sm"}
                        border={isAI ? "2px solid" : "none"}
                        borderColor={isAI ? "purple.200" : "transparent"}
                        position="relative"
                      >
                        {isAI && (
                          <Flex
                            fontSize="xs"
                            fontWeight="bold"
                            mb="2"
                            color="purple.700"
                            alignItems="center"
                            gap="1"
                          >
                            <Icon as={RiRobot2Line} />
                            <Text>AI Assistant</Text>
                          </Flex>
                        )}

                        {!isCurrentUser && showAvatar && !isAI && (
                          <Text
                            fontSize="xs"
                            fontWeight="medium"
                            mb="1"
                            color="blue.500"
                          >
                            {message.sender?.username}
                          </Text>
                        )}

                        <Text fontSize="md">{message.content}</Text>

                        <Text
                          fontSize="xs"
                          opacity="0.7"
                          mt="2"
                          textAlign={isCurrentUser ? "right" : "left"}
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </Box>

                      {isCurrentUser && showAvatar && !isAI && (
                        <Avatar
                          size="sm"
                          name={userInfo.username}
                          src={userInfo.avatar}
                          mt="2"
                        />
                      )}
                    </Flex>
                  </MotionBox>
                );
              })}
              <div ref={messagesEndRef} />
            </VStack>
          </AnimatePresence>
        )}

        {/* Welcome message for empty chat */}
        {!loading && messages.length === 0 && (
          <Flex
            direction="column"
            align="center"
            justify="center"
            h="100%"
            textAlign="center"
            p="8"
          >
            <MotionBox
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Box
                w="100px"
                h="100px"
                borderRadius="full"
                bgGradient="linear(to-r, blue.100, purple.100)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb="6"
              >
                <Icon as={RiRobot2Line} boxSize={12} color="blue.500" />
              </Box>
            </MotionBox>
            <Text fontSize="xl" fontWeight="bold" color="gray.700" mb="2">
              Welcome to #{selectedGroup.name}
            </Text>
            <Text color="gray.500" maxW="md">
              This is the beginning of your conversation. Send a message to get
              started!
            </Text>
          </Flex>
        )}
      </Box>

      {/* Message Input */}
      <Box
        p={{ base: "4", md: "6" }}
        borderTop="1px solid"
        borderColor="gray.100"
        bg="white"
      >
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <Box mb="3" px="4" py="2" bg="gray.50" borderRadius="md">
            <Text fontSize="sm" color="gray.600" fontStyle="italic">
              {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
              typing...
            </Text>
          </Box>
        )}

        <Flex gap="3" align="center">
          <HStack spacing="2" flex="1">
            <Tooltip label="Attach file">
              <IconButton
                aria-label="Attach file"
                icon={<FiPaperclip />}
                variant="ghost"
                colorScheme="gray"
                size="lg"
                borderRadius="full"
              />
            </Tooltip>
            <Tooltip label="Emoji">
              <IconButton
                aria-label="Emoji"
                icon={<FiSmile />}
                variant="ghost"
                colorScheme="gray"
                size="lg"
                borderRadius="full"
              />
            </Tooltip>
            <InputGroup size="lg" flex="1">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);

                  socket.emit("typing", selectedGroup._id, userInfo.username);

                  if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                  }

                  typingTimeoutRef.current = setTimeout(() => {
                    socket.emit("stopTyping", selectedGroup._id);
                  }, 3000);
                }}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (type /summary or \summary for AI)"
                borderRadius="full"
                focusBorderColor="blue.500"
                bg="gray.50"
                pr="20"
                _hover={{ bg: "gray.100" }}
              />
              <InputRightElement width="auto" mr="2">
                <HStack spacing="1">
                  <Tooltip label="Voice message">
                    <IconButton
                      aria-label="Voice message"
                      icon={<FiMic />}
                      variant="ghost"
                      colorScheme="gray"
                      size="sm"
                      borderRadius="full"
                    />
                  </Tooltip>
                  <Button
                    leftIcon={<FiSend />}
                    colorScheme="blue"
                    borderRadius="full"
                    size="sm"
                    onClick={sendMessage}
                    isDisabled={!newMessage.trim()}
                    px="4"
                    bgGradient="linear(to-r, blue.500, purple.500)"
                    _hover={{
                      bgGradient: "linear(to-r, blue.600, purple.600)",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s"
                  >
                    Send
                  </Button>
                </HStack>
              </InputRightElement>
            </InputGroup>
          </HStack>
        </Flex>
      </Box>

      {/* Members Panel */}
      <AnimatePresence>
        {showMembers && (
          <MotionBox
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            position="absolute"
            top="0"
            right="0"
            bottom="0"
            w={{ base: "100%", md: "320px" }}
            zIndex="20"
            boxShadow="xl"
          >
            <UsersList
              onlineUsers={connectedUsers}
              allMembers={groupMembers}
              onClose={() => setShowMembers(false)}
            />
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Invite Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>Invite People</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="6">
            <Text color="gray.600" mb="4">
              Share this code with others to join the group:
            </Text>
            <Box
              p="4"
              bg="blue.50"
              borderRadius="xl"
              border="2px dashed"
              borderColor="blue.200"
              textAlign="center"
            >
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {selectedGroup._id?.slice(0, 8).toUpperCase()}
              </Text>
              <Text fontSize="sm" color="gray.500" mt="2">
                Group Invite Code
              </Text>
            </Box>
            <Button
              mt="6"
              w="full"
              colorScheme="blue"
              borderRadius="xl"
              size="lg"
              onClick={() => {
                navigator.clipboard.writeText(selectedGroup._id);
                toast({
                  title: "Invite code copied!",
                  status: "success",
                  duration: 2000,
                });
              }}
            >
              Copy Invite Code
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

ChatArea.propTypes = {
  socket: PropTypes.object,
  selectedGroup: PropTypes.object,
  onMenuClick: PropTypes.func,
  isMobile: PropTypes.bool,
};

export default ChatArea;
