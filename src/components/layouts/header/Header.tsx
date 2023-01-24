import { MenuIconButton } from "@/components/elements/Button/MenuIconButton";
import HeaderLoginMenu from "@/components/molecules/HeaderLoginMenu";
import HeaderMenu from "@/components/molecules/HeaderMenu";
import MenuDrawer from "@/components/molecules/MenuDrawer";
import { useAuthContext } from "@/context/AuthContext";
import { Container, Flex, Text, useDisclosure } from "@chakra-ui/react";

const Header = () => {
  const { currentUser } = useAuthContext();
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();

  return (
    <>
      <Container p={0} borderBottom="1px" borderColor="gray.200" maxW="100%">
        <Container bg="orange.500" maxW="100%" p={1}>
          <Text color="white" fontSize="sm" align="center">
            おすすめのラーメンを共有するサイト
          </Text>
        </Container>
        <Container bg="white" py={2} px={4} maxW="100%">
          <Flex as="nav" justify="space-between" align="center">
            {currentUser === null ? <HeaderLoginMenu /> : <HeaderMenu />}
            <MenuIconButton onOpen={onOpen} />
          </Flex>
        </Container>
      </Container>
      <MenuDrawer onClose={onClose} onToggle={onToggle} isOpen={isOpen} />
    </>
  );
};

export default Header;
