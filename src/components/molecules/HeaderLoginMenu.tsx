import HeaderLink from "@/components/elements/Link/HeaderLink ";
import { Flex, Image, Link } from "@chakra-ui/react";
import NextLink from "next/link";

const HeaderLoginMenu = () => {
  return (
    <>
      <Link as={NextLink} href="/login">
        <Image src="/logo.png" alt="logo" width="165px" height="55px" />
      </Link>
      <Flex justify="flex-end" fontSize="md" display={{ base: "none", md: "flex" }}>
        <HeaderLink href="/login">ログイン</HeaderLink>
        <HeaderLink href="/signup">サインアップ</HeaderLink>
      </Flex>
    </>
  );
};

export default HeaderLoginMenu;
