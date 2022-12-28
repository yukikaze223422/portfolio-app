import { Container } from "@chakra-ui/react";

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
      &copy; 2022 RamenSharing All rights reserved.
    </Container>
  );
};

export default Footer;
