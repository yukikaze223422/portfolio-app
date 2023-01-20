import { Container, Flex } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Container
      bg="white"
      maxW="100%"
      fontSize="sm"
      textAlign="center"
      borderTop="1px"
      borderColor="gray.200"
    >
      <Flex justify="center">&copy; 2022 RamenSharing All rights reserved.</Flex>
    </Container>
  );
};

export default Footer;
