import { auth } from "@/../firebase";
import { useAuthContext } from "@/context/AuthContext";
import { useAlertMessage } from "@/hooks/useAlertMessage";
import { Button } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { NextRouter, useRouter } from "next/router";

const HeaderMenuDrawer = () => {
  const { showMessage } = useAlertMessage();
  const { currentUser } = useAuthContext();
  const router: NextRouter = useRouter();

  const onClickLogout = async () => {
    signOut(auth);
    if (currentUser === null) {
      router.push("/login");
    }

    showMessage({ title: "ログアウトしました。", status: "success" });
  };

  return (
    <>
      <Button
        w="80%"
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        onClick={() => router.push("/")}
      >
        ホーム
      </Button>
      <Button
        w="80%"
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        onClick={() => router.push("/post")}
      >
        投稿する
      </Button>
      <Button
        w="80%"
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        onClick={() => router.push("/myposts")}
      >
        投稿管理
      </Button>
      <Button
        w="80%"
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        onClick={() => router.push("/mypage")}
      >
        マイページ
      </Button>
      <Button w="80%" bg="white" borderBottom="1px" borderColor="gray.200" onClick={onClickLogout}>
        ログアウト
      </Button>
    </>
  );
};

export default HeaderMenuDrawer;
