import { Flex, Image, Link } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import NextLink from "next/link";
import { NextRouter, useRouter } from "next/router";
import { auth } from "../../../firebase";
import { useMessage } from "../../hooks/useMessage";

const HeaderMenu = () => {
  const { showMessage } = useMessage();
  const router: NextRouter = useRouter();

  const onClickLogout = () => {
    signOut(auth);
    router.push("/login");
    console.log("aaaa");
    showMessage({ title: "ログアウトしました。", status: "success" });
  };

  return (
    <>
      <Link as={NextLink} href="/">
        <Image src="/logo.png" alt="logo" width="165px" height="55px" />
      </Link>
      <Flex justify="flex-end" fontSize="md" display={{ base: "none", md: "flex" }}>
        <Link
          as={NextLink}
          href="/post"
          pr={5}
          fontWeight="bold"
          color="gray.500"
          _hover={{ opacity: 0.8, color: "orange.300", textDecoration: "none" }}
        >
          投稿する
        </Link>
        <Link
          onClick={onClickLogout}
          fontWeight="bold"
          color="gray.500"
          _hover={{ opacity: 0.8, color: "orange.300", textDecoration: "none" }}
        >
          ログアウト
        </Link>
      </Flex>
    </>
  );
};

export default HeaderMenu;
