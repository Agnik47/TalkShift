import {
  Box,
  Flex,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  IconButton,
  useMediaQuery,
} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import { FiMenu, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

const ENDPOINT = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const MotionBox = motion(Box);

const Chat = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [socket, setSocket] = useState(null);
  const [groups, setGroups] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [sidebarVisible, setSidebarVisible] = useState(!isMobile);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const newSocket = io(ENDPOINT, {
      auth: { user: userInfo },
      transports: ["websocket", "polling"],
    });

    setSocket(newSocket);
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    setSidebarVisible(!isMobile);
  }, [isMobile]);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    if (isMobile) onClose();
  };

  return (
    <Flex
      h="100vh"
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      position="relative"
      overflow="hidden"
    >
      {/* Background Pattern - Simplified */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.05"
        bg="repeating-linear-gradient(45deg, #00000022 0px, #00000022 20px, transparent 20px, transparent 40px)"
      />

      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          aria-label="Toggle sidebar"
          icon={isOpen ? <FiX /> : <FiMenu />}
          onClick={isOpen ? onClose : onOpen}
          position="fixed"
          top="4"
          left="4"
          zIndex="1000"
          colorScheme="whiteAlpha"
          backdropFilter="blur(10px)"
          bg="rgba(255, 255, 255, 0.2)"
          _hover={{ bg: "rgba(255, 255, 255, 0.3)" }}
          size="lg"
          borderRadius="full"
          boxShadow="lg"
        />
      )}

      {/* Sidebar for Desktop */}
      {!isMobile && sidebarVisible && (
        <MotionBox
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          w={{ base: "100%", md: "380px" }}
          maxW="380px"
          position="relative"
          zIndex="10"
        >
          <Sidebar
            setSelectedGroup={handleGroupSelect}
            selectedGroup={selectedGroup}
            setGroups={setGroups}
          />
        </MotionBox>
      )}

      {/* Drawer for Mobile */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="full">
        <DrawerOverlay backdropFilter="blur(4px)" />
        <DrawerContent
          bg="rgba(255, 255, 255, 0.95)"
          backdropFilter="blur(10px)"
          maxW="380px"
        >
          <DrawerBody p="0">
            <Sidebar
              setSelectedGroup={handleGroupSelect}
              selectedGroup={selectedGroup}
              setGroups={setGroups}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Chat Area */}
      <AnimatePresence mode="wait">
        <MotionBox
          key={selectedGroup?._id || "no-group"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          flex="1"
          display="flex"
          flexDirection="column"
          position="relative"
          m={{ base: "4", md: "6" }}
          mb={{ base: "4", md: "6" }}
          borderRadius={{ base: "xl", md: "2xl" }}
          overflow="hidden"
          boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)"
          bg="white"
        >
          {socket && selectedGroup && (
            <ChatArea
              socket={socket}
              selectedGroup={selectedGroup}
              onMenuClick={onOpen}
              isMobile={isMobile}
            />
          )}

          {/* No Group Selected State */}
          {!selectedGroup && (
            <Flex
              flex="1"
              direction="column"
              align="center"
              justify="center"
              p="8"
              textAlign="center"
              bgGradient="linear(to-br, gray.50, white)"
            >
              <Box
                w="120px"
                h="120px"
                mb="6"
                bgGradient="linear(to-r, blue.100, purple.100)"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box as="span" fontSize="4xl" color="purple.500">
                  👋
                </Box>
              </Box>
              <Box fontSize="2xl" fontWeight="bold" color="gray.700" mb="2">
                Welcome to ChatSphere
              </Box>
              <Box color="gray.500" maxW="md" mb="6">
                {isMobile
                  ? "Tap on a group to start chatting!"
                  : "Select a group from the sidebar to start chatting"}
              </Box>
              <Box
                display="inline-flex"
                alignItems="center"
                gap="2"
                px="4"
                py="2"
                bgGradient="linear(to-r, blue.500, purple.500)"
                color="white"
                borderRadius="full"
                fontSize="sm"
                fontWeight="medium"
              >
                <Box as="span">💬</Box>
                {groups?.length || 0} groups available
              </Box>
            </Flex>
          )}
        </MotionBox>
      </AnimatePresence>
    </Flex>
  );
};

export default Chat;
