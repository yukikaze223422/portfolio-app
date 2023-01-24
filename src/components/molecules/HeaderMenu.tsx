import { auth } from "@/../firebase";
import HeaderLink from "@/components/elements/Link/HeaderLink ";
import { useAuthContext } from "@/context/AuthContext";
import { useMessage } from "@/hooks/useMessage";
import { Flex, Image, Link } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import NextLink from "next/link";
import { NextRouter, useRouter } from "next/router";

const HeaderMenu = () => {
  const { showMessage } = useMessage();
  const { currentUser } = useAuthContext();
  const router: NextRouter = useRouter();

  const onClickLogout = () => {
    signOut(auth);
    if (currentUser === null) {
      router.push("/login");
    }
    showMessage({ title: "ログアウトしました。", status: "success" });
  };

  return (
    <>
      <Link as={NextLink} href="/">
        <Image src="/logo.png" alt="logo" width="165px" height="55px" />
      </Link>
      <Flex justify="flex-end" fontSize="md" display={{ base: "none", md: "flex" }}>
        <HeaderLink href="/">ホーム</HeaderLink>
        <HeaderLink href="/post">投稿する</HeaderLink>
        <HeaderLink href="/myposts">投稿管理</HeaderLink>
        <HeaderLink href={"/mypage"}>マイページ</HeaderLink>
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
