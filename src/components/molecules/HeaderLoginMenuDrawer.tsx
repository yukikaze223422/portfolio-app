import { Button } from "@chakra-ui/react";
import { NextRouter, useRouter } from "next/router";

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

export default HeaderLoginMenuDrawer;
