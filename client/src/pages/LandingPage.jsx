import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  Icon,
  SimpleGrid,
  Flex,
  VStack,
  HStack,
  Badge,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FiLogIn,
  FiUserPlus,
  FiActivity,
  FiSmartphone,
  FiShield,
  FiBell,
  FiCheckCircle,
} from "react-icons/fi";
import { RiRobot2Line, RiChatSmile3Line, RiGroupLine } from "react-icons/ri";
import { motion } from "framer-motion";
import PropTypes from 'prop-types';

const MotionBox = motion(Box);

const Feature = ({ title, text, icon, badge = null }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Stack
        bg={useColorModeValue("white", "gray.800")}
        rounded="2xl"
        p={8}
        spacing={5}
        border="1px solid"
        borderColor={useColorModeValue("gray.100", "gray.700")}
        boxShadow="lg"
        height="100%"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          bgGradient: "linear(to-r, blue.500, purple.500)",
        }}
      >
        <Flex
          w={16}
          h={16}
          align="center"
          justify="center"
          rounded="xl"
          bgGradient="linear(to-r, blue.100, purple.100)"
          color="purple.600"
        >
          {icon}
        </Flex>
        <Box>
          <HStack spacing={3} mb={3}>
            <Text fontWeight="bold" fontSize="xl">
              {title}
            </Text>
            {badge && (
              <Badge
                colorScheme={badge.color}
                variant="subtle"
                rounded="full"
                px={3}
                py={1}
                fontSize="xs"
              >
                {badge.text}
              </Badge>
            )}
          </HStack>
          <Text color={useColorModeValue("gray.600", "gray.300")} lineHeight="tall">
            {text}
          </Text>
        </Box>
      </Stack>
    </MotionBox>
  );
};

Feature.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  badge: PropTypes.shape({
    text: PropTypes.string,
    color: PropTypes.string,
  }),
};

const ChatPreview = () => {
  const messages = [
    { sender: "Anandu", message: "Just finished the new Design! 🎉", time: "10:30 AM", isUser: false },
    { sender: "You", message: "Amazing work! Can't wait to test it out", time: "10:31 AM", isUser: true },
    { sender: "Dev Agarwalla", message: "The design looks stunning! 🔥", time: "10:32 AM", isUser: false },
    { sender: "Somoudeep", message: "Team sync in 15 minutes?", time: "10:33 AM", isUser: false },
    { sender: "You", message: "Perfect timing, I'll be there", time: "10:34 AM", isUser: true },
  ];

  return (
    <Box
      w="100%"
      maxW="400px"
      h="500px"
      bg="white"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)"
      border="1px solid"
      borderColor="gray.200"
      position="relative"
    >
      {/* Chat Header */}
      <Box
        bgGradient="linear(to-r, blue.600, purple.600)"
        color="white"
        p={4}
        borderBottom="1px solid"
        borderColor="blue.700"
      >
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={3}>
            <Avatar size="sm" name="Team Alpha" bg="white" color="blue.600" />
            <Box>
              <Text fontWeight="bold" fontSize="lg">
                Design Team
              </Text>
              <Text fontSize="xs" opacity={0.9}>
                4 members • 3 online
              </Text>
            </Box>
          </Flex>
          <Badge colorScheme="green" variant="solid" px={3} py={1}>
            Active
          </Badge>
        </Flex>
      </Box>

      {/* Messages */}
      <VStack spacing={4} p={4} overflowY="auto" h="calc(100% - 120px)" bg="gray.50">
        {messages.map((msg, index) => (
          <MotionBox
            key={index}
            initial={{ opacity: 0, x: msg.isUser ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            w="100%"
          >
            <Flex justify={msg.isUser ? "flex-end" : "flex-start"}>
              <Box
                maxW="80%"
                bg={msg.isUser ? "blue.500" : "white"}
                color={msg.isUser ? "white" : "gray.800"}
                px={4}
                py={3}
                borderRadius="2xl"
                borderBottomLeftRadius={msg.isUser ? "2xl" : "0"}
                borderBottomRightRadius={msg.isUser ? "0" : "2xl"}
                boxShadow="sm"
                position="relative"
              >
                {!msg.isUser && (
                  <Text fontSize="xs" fontWeight="bold" color="blue.500" mb={1}>
                    {msg.sender}
                  </Text>
                )}
                <Text fontSize="md">{msg.message}</Text>
                <Text
                  fontSize="xs"
                  opacity={0.7}
                  mt={2}
                  textAlign={msg.isUser ? "right" : "left"}
                >
                  {msg.time}
                </Text>
              </Box>
            </Flex>
          </MotionBox>
        ))}
        
        {/* Typing Indicator */}
        <Flex justify="flex-start" w="100%">
          <Box bg="white" px={4} py={2} borderRadius="full" boxShadow="sm">
            <HStack spacing={2}>
              <MotionBox
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                <Box w="2" h="2" bg="blue.500" borderRadius="full" />
              </MotionBox>
              <MotionBox
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              >
                <Box w="2" h="2" bg="blue.500" borderRadius="full" />
              </MotionBox>
              <MotionBox
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              >
                <Box w="2" h="2" bg="blue.500" borderRadius="full" />
              </MotionBox>
              <Text fontSize="sm" color="gray.500" ml={2}>
                Anandu is typing...
              </Text>
            </HStack>
          </Box>
        </Flex>
      </VStack>

      {/* Message Input */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        bg="white"
        p={4}
        borderTop="1px solid"
        borderColor="gray.200"
      >
        <HStack spacing={2}>
          <Box flex="1" bg="gray.100" borderRadius="full" px={4} py={2}>
            <Text color="gray.500">Type your message...</Text>
          </Box>
          <Button
            size="md"
            bgGradient="linear(to-r, blue.500, purple.500)"
            color="white"
            _hover={{ bgGradient: "linear(to-r, blue.600, purple.600)" }}
            borderRadius="full"
            px={6}
          >
            Send
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default function LandingPage() {
  return (
    <Box minH="100vh" bg="gray.50" overflow="hidden">
      {/* Hero Section */}
      <Box position="relative" overflow="hidden">
        {/* Background Pattern */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity="0.05"
          bg="repeating-linear-gradient(45deg, #00000022 0px, #00000022 20px, transparent 20px, transparent 40px)"
        />

        {/* Floating Elements */}
        <MotionBox
          position="absolute"
          top="20%"
          left="10%"
          w="100px"
          h="100px"
          bg="whiteAlpha.200"
          borderRadius="xl"
          backdropFilter="blur(10px)"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <MotionBox
          position="absolute"
          bottom="30%"
          right="15%"
          w="80px"
          h="80px"
          bg="whiteAlpha.100"
          borderRadius="xl"
          backdropFilter="blur(10px)"
          animate={{ y: [0, 40, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        />

        <Container maxW="7xl" py={{ base: 20, md: 28 }} position="relative" zIndex="1">
          <Stack
            direction={{ base: "column", lg: "row" }}
            spacing={{ base: 10, lg: 20 }}
            align="center"
          >
            <Stack flex={1} spacing={{ base: 8, md: 12 }}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Flex align="center" gap={3} mb={6}>
                  <Icon as={RiRobot2Line} boxSize={10} color="purple.500" />
                  <Text fontSize="sm" fontWeight="bold" color="purple.500" letterSpacing="wider">
                    TALKSHIFT
                  </Text>
                </Flex>

                <Heading
                  fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                  fontWeight="bold"
                  lineHeight="shorter"
                  mb={6}
                >
                  Chat{" "}
                  <Text
                    as="span"
                    bgGradient="linear(to-r, blue.500, purple.500)"
                    bgClip="text"
                  >
                    Without Limits
                  </Text>
                </Heading>

                <Text fontSize={{ base: "lg", md: "xl" }} color="gray.600" mb={8} maxW="2xl">
                  Connect, collaborate, and communicate with your teams and friends in real-time. 
                  Experience seamless messaging with modern features and intuitive design.
                </Text>

                <Stack direction={{ base: "column", sm: "row" }} spacing={6}>
                  <Button
                    as={RouterLink}
                    to="/register"
                    size="lg"
                    fontSize="md"
                    fontWeight="semibold"
                    bgGradient="linear(to-r, blue.500, purple.500)"
                    color="white"
                    _hover={{
                      bgGradient: "linear(to-r, blue.600, purple.600)",
                      transform: "translateY(-2px)",
                      boxShadow: "xl",
                    }}
                    _active={{ transform: "translateY(0)" }}
                    transition="all 0.2s"
                    borderRadius="xl"
                    px={8}
                    py={6}
                    leftIcon={<FiUserPlus />}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/login"
                    size="lg"
                    fontSize="md"
                    fontWeight="semibold"
                    variant="outline"
                    colorScheme="blue"
                    _hover={{ transform: "translateY(-2px)" }}
                    transition="all 0.2s"
                    borderRadius="xl"
                    px={8}
                    py={6}
                    leftIcon={<FiLogIn />}
                  >
                    Sign In
                  </Button>
                </Stack>

                <HStack spacing={6} mt={10} flexWrap="wrap">
                  <Flex align="center" gap={2}>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text fontSize="sm" color="gray.600">No credit card required</Text>
                  </Flex>
                  <Flex align="center" gap={2}>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text fontSize="sm" color="gray.600">Free forever plan</Text>
                  </Flex>
                  <Flex align="center" gap={2}>
                    <Icon as={FiCheckCircle} color="green.500" />
                    <Text fontSize="sm" color="gray.600">24/7 Support</Text>
                  </Flex>
                </HStack>
              </MotionBox>
            </Stack>

            {/* Chat Preview */}
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              flex={1}
              display="flex"
              justifyContent="center"
            >
              <ChatPreview />
            </MotionBox>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={{ base: 16, md: 24 }} bg="white">
        <Container maxW="7xl">
          <VStack spacing={3} textAlign="center" mb={{ base: 10, md: 16 }}>
            <Text fontSize="sm" fontWeight="semibold" color="purple.500" letterSpacing="wide">
              WHY TALKSHIT
            </Text>
            <Heading fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold">
              Everything You Need for{" "}
              <Text as="span" color="blue.500">
                Modern Chatting
              </Text>
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Designed for teams, friends, and communities who value seamless communication
            </Text>
          </VStack>

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={{ base: 8, md: 10 }}
          >
            <Feature
              icon={<Icon as={RiGroupLine} boxSize={8} />}
              title="Group Management"
              badge={{ text: "Smart", color: "blue" }}
              text="Create unlimited groups, manage permissions, and organize conversations effortlessly."
            />
            <Feature
              icon={<Icon as={FiSmartphone} boxSize={8} />}
              title="Mobile Ready"
              badge={{ text: "Responsive", color: "green" }}
              text="Access your chats from any device with our fully responsive design that works everywhere."
            />
            <Feature
              icon={<Icon as={FiShield} boxSize={8} />}
              title="Secure & Private"
              badge={{ text: "Encrypted", color: "purple" }}
              text="Your conversations are protected with end-to-end encryption and secure authentication."
            />
            <Feature
              icon={<Icon as={FiActivity} boxSize={8} />}
              title="Real-time Updates"
              badge={{ text: "Live", color: "orange" }}
              text="Instant message delivery, typing indicators, and online status updates in real-time."
            />
            <Feature
              icon={<Icon as={RiChatSmile3Line} boxSize={8} />}
              title="Rich Messaging"
              badge={{ text: "Modern", color: "pink" }}
              text="Send messages, emojis, files, and more with our intuitive chat interface."
            />
            <Feature
              icon={<Icon as={FiBell} boxSize={8} />}
              title="Smart Notifications"
              badge={{ text: "Smart", color: "teal" }}
              text="Customizable notifications to stay updated without being overwhelmed."
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={{ base: 16, md: 24 }} bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)">
        <Container maxW="4xl">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Stack
              direction={{ base: "column", lg: "row" }}
              spacing={{ base: 10, lg: 16 }}
              align="center"
              justify="space-between"
              bg="white"
              p={{ base: 8, md: 12 }}
              borderRadius="3xl"
              boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)"
            >
              <Box flex={1}>
                <Heading fontSize={{ base: "2xl", md: "3xl" }} mb={4}>
                  Ready to Start Talking?
                </Heading>
                <Text fontSize="lg" color="gray.600">
                  Join thousands of users who have already upgraded their chat experience with TalkShit.
                  No setup required, just sign up and start chatting!
                </Text>
              </Box>
              <Stack spacing={4} minW={{ md: "300px" }}>
                <Button
                  as={RouterLink}
                  to="/register"
                  size="lg"
                  fontSize="md"
                  fontWeight="semibold"
                  bgGradient="linear(to-r, blue.500, purple.500)"
                  color="white"
                  _hover={{
                    bgGradient: "linear(to-r, blue.600, purple.600)",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s"
                  borderRadius="xl"
                  py={6}
                  leftIcon={<FiUserPlus />}
                >
                  Create Free Account
                </Button>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Already have an account?{" "}
                  <Button
                    as={RouterLink}
                    to="/login"
                    variant="link"
                    color="blue.500"
                    fontWeight="semibold"
                  >
                    Sign In
                  </Button>
                </Text>
              </Stack>
            </Stack>
          </MotionBox>
        </Container>
      </Box>

      {/* Footer */}
      <Box py={10} bg="gray.900" color="white">
        <Container maxW="7xl">
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={8}
            justify="space-between"
            align="center"
          >
            <Flex align="center" gap={3}>
              <Icon as={RiRobot2Line} boxSize={8} color="purple.400" />
              <Box>
                <Text fontSize="xl" fontWeight="bold">
                  TalkShit
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Modern chat for modern teams
                </Text>
              </Box>
            </Flex>
            <Text fontSize="sm" color="gray.400">
              © {new Date().getFullYear()} TalkShit. All rights reserved.
            </Text>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}