import { Flex, Image, Link } from "@chakra-ui/react";
import NextLink from "next/link";

const HeaderLoginMenu = () => {
  return (
    <>
      <Link as={NextLink} href="/login">
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
    </>
  );
};

export default HeaderLoginMenu;
