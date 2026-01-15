import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Flex,
  Icon,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Divider,
  useMediaQuery,
} from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom";
import {
  FiLogIn,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiMessageSquare,
} from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${URL}/api/users/login`, {
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast({
        title: "Login Successful",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      setLoading(false);
      navigate("/chat");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid credentials",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <Box
      w="100%"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
      position="relative"
      overflow="hidden"
      p={{ base: 4, md: 0 }}
    >
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

      {/* Floating Chat Bubbles */}
      {!isMobile && (
        <>
          <MotionBox
            position="absolute"
            top="20%"
            left="10%"
            w="60px"
            h="60px"
            bg="whiteAlpha.200"
            borderRadius="xl"
            backdropFilter="blur(10px)"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
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
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        w={{ base: "100%", md: "450px", lg: "500px" }}
        bg="white"
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)"
      >
        {/* Header */}
        <Box
          bgGradient="linear(to-r, blue.600, purple.600)"
          color="white"
          p={{ base: 6, md: 8 }}
          textAlign="center"
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top="-50px"
            right="-50px"
            w="100px"
            h="100px"
            bg="whiteAlpha.100"
            borderRadius="full"
          />
          <Box
            position="absolute"
            bottom="-30px"
            left="-30px"
            w="80px"
            h="80px"
            bg="whiteAlpha.100"
            borderRadius="full"
          />

          <Flex
            direction="column"
            align="center"
            position="relative"
            zIndex="1"
          >
            <MotionBox
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Icon as={RiRobot2Line} boxSize={12} mb={4} />
            </MotionBox>
            <Text fontSize="3xl" fontWeight="bold" mb={2}>
              Welcome Back
            </Text>
            <Text fontSize="md" opacity="0.9">
              Sign in to continue to ChatSphere
            </Text>
          </Flex>
        </Box>

        {/* Form */}
        <Box p={{ base: 6, md: 8 }}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl id="email" isRequired>
                <FormLabel fontWeight="medium" color="gray.700">
                  Email Address
                </FormLabel>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiMail} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    bg="gray.50"
                    borderColor="gray.200"
                    _hover={{ borderColor: "blue.300" }}
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                    }}
                    borderRadius="xl"
                  />
                </InputGroup>
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel fontWeight="medium" color="gray.700">
                  Password
                </FormLabel>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiLock} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    bg="gray.50"
                    borderColor="gray.200"
                    _hover={{ borderColor: "blue.300" }}
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                    }}
                    borderRadius="xl"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      icon={showPassword ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      _hover={{ bg: "transparent" }}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                isLoading={loading}
                width="100%"
                size="lg"
                fontSize="md"
                fontWeight="semibold"
                leftIcon={<FiLogIn />}
                bgGradient="linear(to-r, blue.500, purple.500)"
                _hover={{
                  bgGradient: "linear(to-r, blue.600, purple.600)",
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                transition="all 0.2s"
                borderRadius="xl"
                mt={4}
              >
                Sign In
              </Button>
            </VStack>
          </form>

          <Divider my={8} />

          {/* Footer Links */}
          <VStack spacing={4}>
            <Flex align="center" gap={2} color="gray.600" fontSize="sm">
              <Icon as={FiMessageSquare} />
              <Text>Do not have an account?</Text>
              <Link className="cursor-pointer text-blue-500" to="/register">
                Create Account
              </Link>
            </Flex>

            <Text
              fontSize="xs"
              color="gray.500"
              textAlign="center"
              maxW="sm"
              mx="auto"
            >
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </Text>
          </VStack>
        </Box>

        {/* Bottom Decoration */}
        <Box h="4px" bgGradient="linear(to-r, blue.500, purple.500)" />
      </MotionBox>

      {/* Brand Tagline */}
      {!isMobile && (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          position="absolute"
          bottom="8"
          color="white"
          textAlign="center"
          fontSize="sm"
          fontWeight="medium"
          backdropFilter="blur(10px)"
          bg="whiteAlpha.100"
          px="4"
          py="2"
          borderRadius="full"
        >
          <Flex align="center" gap={2}>
            <Icon as={RiRobot2Line} />
            <Text>Connect • Chat • Collaborate</Text>
          </Flex>
        </MotionBox>
      )}
    </Box>
  );
};

export default Login;
