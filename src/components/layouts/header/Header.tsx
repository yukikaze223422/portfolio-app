import { Container, Flex, Image, Link, Text, useDisclosure } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import NextLink from "next/link";
import { NextRouter, useRouter } from "next/router";
import { MenuIconButton } from "../../elements/Button/MenuIconButton";
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
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const router: NextRouter = useRouter();

  const onLogout = () => {
    alert("ログアウトしました");
    router.push("/login");
  };

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
            <Link as={NextLink} href="/">
              <Image src="/logo.png" alt="logo" width="165px" height="55px" />
            </Link>
            <Flex justify="flex-end" fontSize="md" display={{ base: "none", md: "flex" }}>
              <Link
                as={NextLink}
                href="/login"
                pr={5}
                fontWeight="bold"
                color="gray.500"
                _hover={{ opacity: 0.8, color: "orange.300", textDecoration: "none" }}
              >
                ログイン
              </Link>
              <Link
                as={NextLink}
                href="/signup"
                fontWeight="bold"
                color="gray.500"
                _hover={{ opacity: 0.8, color: "orange.300", textDecoration: "none" }}
              >
                サインアップ
              </Link>
            </Flex>
            <MenuIconButton onOpen={onOpen} />
          </Flex>
        </Container>
      </Container>
      <MenuDrawer onClose={onClose} onToggle={onToggle} isOpen={isOpen} />
    </>
  );
};

export default Header;
