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
  InputRightElement,
  IconButton,
  Divider,
  useMediaQuery,
  InputLeftElement,
  HStack,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiMessageSquare,
  FiCheck,
} from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${URL}/api/users/register`, {
        username,
        email,
        password,
      });
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      setLoading(false);
      navigate("/login");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (password.length === 0) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getStrengthColor = (strength) => {
    if (strength < 50) return "red";
    if (strength < 75) return "orange";
    return "green";
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

      {/* Floating Elements */}
      {!isMobile && (
        <>
          <MotionBox
            position="absolute"
            top="15%"
            right="10%"
            w="70px"
            h="70px"
            bg="whiteAlpha.200"
            borderRadius="xl"
            backdropFilter="blur(10px)"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <MotionBox
            position="absolute"
            bottom="25%"
            left="10%"
            w="90px"
            h="90px"
            bg="whiteAlpha.100"
            borderRadius="xl"
            backdropFilter="blur(10px)"
            animate={{ y: [0, 40, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </>
      )}

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        w={{ base: "100%", md: "500px", lg: "550px" }}
        bg="white"
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)"
      >
        {/* Header */}
        <Box
          bgGradient="linear(to-r, purple.600, pink.600)"
          color="white"
          p={{ base: 6, md: 8 }}
          textAlign="center"
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top="-40px"
            left="-40px"
            w="80px"
            h="80px"
            bg="whiteAlpha.100"
            borderRadius="full"
          />
          <Box
            position="absolute"
            bottom="-40px"
            right="-40px"
            w="100px"
            h="100px"
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
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon as={RiRobot2Line} boxSize={12} mb={4} />
            </MotionBox>
            <Text fontSize="3xl" fontWeight="bold" mb={2}>
              Join ChatSphere
            </Text>
            <Text fontSize="md" opacity="0.9">
              Create your account to start chatting
            </Text>
          </Flex>
        </Box>

        {/* Form */}
        <Box p={{ base: 6, md: 8 }}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={5}>
              <FormControl id="username" isRequired>
                <FormLabel fontWeight="medium" color="gray.700">
                  Username
                </FormLabel>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiUser} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    bg="gray.50"
                    borderColor="gray.200"
                    _hover={{ borderColor: "purple.300" }}
                    _focus={{
                      borderColor: "purple.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
                    }}
                    borderRadius="xl"
                  />
                </InputGroup>
              </FormControl>

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
                    _hover={{ borderColor: "purple.300" }}
                    _focus={{
                      borderColor: "purple.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
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
                    placeholder="Create a strong password"
                    bg="gray.50"
                    borderColor="gray.200"
                    _hover={{ borderColor: "purple.300" }}
                    _focus={{
                      borderColor: "purple.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
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

                {password.length > 0 && (
                  <Box mt={2}>
                    <Flex align="center" justify="space-between" mb={1}>
                      <Text fontSize="xs" color="gray.600">
                        Password strength
                      </Text>
                      <Text
                        fontSize="xs"
                        fontWeight="medium"
                        color={getStrengthColor(passwordStrength())}
                      >
                        {passwordStrength()}%
                      </Text>
                    </Flex>
                    <Box
                      w="100%"
                      h="2px"
                      bg="gray.200"
                      borderRadius="full"
                      overflow="hidden"
                    >
                      <Box
                        h="100%"
                        w={`${passwordStrength()}%`}
                        bg={getStrengthColor(passwordStrength())}
                        transition="width 0.3s"
                      />
                    </Box>
                    <HStack spacing={4} mt={2}>
                      <Flex align="center" gap={1}>
                        <Icon
                          as={FiCheck}
                          color={
                            password.length >= 6 ? "green.500" : "gray.300"
                          }
                        />
                        <Text
                          fontSize="xs"
                          color={
                            password.length >= 6 ? "green.600" : "gray.400"
                          }
                        >
                          6+ characters
                        </Text>
                      </Flex>
                    </HStack>
                  </Box>
                )}
              </FormControl>

              <FormControl id="confirmPassword" isRequired>
                <FormLabel fontWeight="medium" color="gray.700">
                  Confirm Password
                </FormLabel>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiLock} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    bg="gray.50"
                    borderColor={
                      confirmPassword && password !== confirmPassword
                        ? "red.300"
                        : "gray.200"
                    }
                    _hover={{ borderColor: "purple.300" }}
                    _focus={{
                      borderColor:
                        confirmPassword && password !== confirmPassword
                          ? "red.500"
                          : "purple.500",
                      boxShadow:
                        confirmPassword && password !== confirmPassword
                          ? "0 0 0 1px var(--chakra-colors-red-500)"
                          : "0 0 0 1px var(--chakra-colors-purple-500)",
                    }}
                    borderRadius="xl"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      _hover={{ bg: "transparent" }}
                    />
                  </InputRightElement>
                </InputGroup>
                {confirmPassword && password !== confirmPassword && (
                  <Text fontSize="sm" color="red.500" mt={2}>
                    Passwords don't match
                  </Text>
                )}
              </FormControl>

              <Button
                type="submit"
                colorScheme="purple"
                isLoading={loading}
                width="100%"
                size="lg"
                fontSize="md"
                fontWeight="semibold"
                leftIcon={<FiCheck />}
                bgGradient="linear(to-r, purple.500, pink.500)"
                _hover={{
                  bgGradient: "linear(to-r, purple.600, pink.600)",
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                transition="all 0.2s"
                borderRadius="xl"
                mt={4}
                isDisabled={password !== confirmPassword || password.length < 6}
              >
                Create Account
              </Button>
            </VStack>
          </form>

          <Divider my={8} />

          {/* Footer Links */}
          <VStack spacing={4}>
            <Flex align="center" gap={2} color="gray.600" fontSize="sm">
              <Icon as={FiMessageSquare} />
              <Text>Already have an account?</Text>
              <Link to="/login">
                <Text
                  color="purple.500"
                  fontWeight="semibold"
                  _hover={{ color: "purple.600", textDecoration: "underline" }}
                >
                  Sign In
                </Text>
              </Link>
            </Flex>

            <Text
              fontSize="xs"
              color="gray.500"
              textAlign="center"
              maxW="sm"
              mx="auto"
            >
              By creating an account, you agree to our Terms of Service and
              Privacy Policy
            </Text>
          </VStack>
        </Box>

        {/* Bottom Decoration */}
        <Box h="4px" bgGradient="linear(to-r, purple.500, pink.500)" />
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
            <Text>Join thousands of users chatting daily</Text>
          </Flex>
        </MotionBox>
      )}
    </Box>
  );
};

export default Register;
