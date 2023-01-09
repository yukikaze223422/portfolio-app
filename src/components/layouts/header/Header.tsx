import { Container, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import { NextRouter, useRouter } from "next/router";
import { useAuthContext } from "../../../context/AuthContext";
import { MenuIconButton } from "../../elements/Button/MenuIconButton";
import { HeaderLoginMenu, HeaderMenu } from "../../molecules/HeaderMenu";
import MenuDrawer from "../../molecules/MenuDrawer";

type User = {
  name: string;
  email: string;
  uid: string;
  createTime: Timestamp;
  updateTime: Timestamp;
  username: string;
  userImg: string;
  text: string;
};

const Header = () => {
  const { currentUser } = useAuthContext();
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const router: NextRouter = useRouter();

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
