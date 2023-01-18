import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
} from "@chakra-ui/react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../../firebase";
import PrimaryButton from "../components/elements/Button/PrimaryButton";
import { useAuthContext } from "../context/AuthContext";
import { useMessage } from "../hooks/useMessage";

//ログインページ
const Login: NextPage = () => {
  const { showMessage } = useMessage();
  const { currentUser } = useAuthContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [isRevealPassword, setIsRevealPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  //通常ログイン処理
  const emailLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      if (currentUser !== null) {
        router.push("/");
        showMessage({ title: "ログインしました。", status: "success" });
      }
    } catch (err) {
      showMessage({ title: "ログインできませんでした。", status: "error" });
    }
    setLoading(false);
  };

  //Googleログイン処理
  const googleLogin = async (): Promise<void> => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const user = auth.currentUser.displayName;
      await updateProfile(auth.currentUser, {
        displayName: user,
      });
      if (currentUser !== null) {
        router.push("/");
        showMessage({ title: "ログインしました。", status: "success" });
      }
    } catch {
      showMessage({ title: "ログインできませんでした。", status: "error" });
    }
    setLoading(false);
  };

  //ゲストログイン処理
  const guestLogin = async (): Promise<void> => {
    const guestEmail = "guest@gmai.com";
    const guestPassword = "guest2234";
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, guestEmail, guestPassword);
      await updateProfile(auth.currentUser, {
        displayName: "Guest",
      });
      if (currentUser !== null) {
        router.push("/");
        showMessage({ title: "ログインしました。", status: "success" });
      }
    } catch (err) {
      showMessage({ title: "ログインできませんでした。", status: "error" });
    }
    setLoading(false);
  };

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box bg="white" w="md" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          ログインページ
        </Heading>
        <Divider my={4} />
        <Stack spacing={6} py={4} px={10}>
          {/* メールアドレス入力欄 */}
          <Input
            placeholder="メールアドレス"
            size="lg"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
          />

          {/* パスワード入力欄 */}
          <InputGroup>
            <Input
              placeholder="パスワード"
              size="lg"
              type={isRevealPassword ? "text" : "password"}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
              }}
            />
            {/* パスワード可視化ボタン */}
            <InputRightElement>
              <Button
                variant={"ghost"}
                onClick={() => setIsRevealPassword((isRevealPassword) => !isRevealPassword)}
                size="lg"
                mt={2}
                mr={2}
              >
                {isRevealPassword ? <ViewIcon /> : <ViewOffIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>

          {/* ログインボタン */}
          <PrimaryButton
            loading={loading}
            bg="orange.300"
            color="white"
            onClick={() => emailLogin(email, password)}
          >
            ログイン
          </PrimaryButton>

          {/* Googleログインボタン */}
          <PrimaryButton
            loading={loading}
            bg="green.300"
            color="white"
            leftIcon={<FcGoogle />}
            onClick={googleLogin}
          >
            Googleログイン
          </PrimaryButton>

          {/* ゲストログインボタン */}
          <PrimaryButton loading={loading} bg="blue.300" color="white" onClick={guestLogin}>
            ゲストログイン
          </PrimaryButton>
          <Box textAlign="center">
            <Link as={NextLink} href="/signup" _hover={{ opacity: 0.8 }} color="blue.600">
              新規登録はこちら
            </Link>
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Login;
