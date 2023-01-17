import { Button } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { NextRouter, useRouter } from "next/router";
import { auth } from "../../../firebase";
import { useAuthContext } from "../../context/AuthContext";
import { useMessage } from "../../hooks/useMessage";

const HeaderMenuDrawer = () => {
  const { showMessage } = useMessage();
  const { currentUser } = useAuthContext();
  const router: NextRouter = useRouter();

  const onClickHome = () => {
    router.push("/");
  };

  const onClickPost = () => {
    router.push("/post");
  };

  const onClickLogout = async () => {
    signOut(auth);
    if (currentUser === null) {
      router.push("/login");
    }

    showMessage({ title: "ログアウトしました。", status: "success" });
  };

  return (
    <>
      <Button w="80%" bg="white" borderBottom="1px" borderColor="gray.200" onClick={onClickHome}>
        ホーム
      </Button>
      <Button w="80%" bg="white" borderBottom="1px" borderColor="gray.200" onClick={onClickPost}>
        投稿する
      </Button>
      <Button w="80%" bg="white" borderBottom="1px" borderColor="gray.200" onClick={onClickLogout}>
        ログアウト
      </Button>
    </>
  );
};

export default HeaderMenuDrawer;
