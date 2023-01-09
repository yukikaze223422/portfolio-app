import { Button } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { NextRouter, useRouter } from "next/router";
import { auth } from "../../../firebase";
import { useMessage } from "../../hooks/useMessage";

const HeaderLoginMenuDrawer = () => {
  const router: NextRouter = useRouter();

  const onClickLogin = () => {
    router.push("/login");
  };

  const onClickSignup = () => {
    router.push("/signup");
  };

  return (
    <>
      <Button w="80%" bg="white" borderBottom="1px" borderColor="gray.200" onClick={onClickLogin}>
        ログイン
      </Button>
      <Button w="80%" bg="white" borderBottom="1px" borderColor="gray.200" onClick={onClickSignup}>
        サインイン
      </Button>
    </>
  );
};

const HeaderMenuDrawer = () => {
  const { showMessage } = useMessage();
  const router: NextRouter = useRouter();

  const onClickHome = () => {
    router.push("/");
  };

  const onClickPost = () => {
    router.push("/post");
  };

  const onClickLogout = async () => {
    signOut(auth);
    router.push("/login");
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

export { HeaderLoginMenuDrawer, HeaderMenuDrawer };
