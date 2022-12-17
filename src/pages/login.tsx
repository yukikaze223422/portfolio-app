import { Box, Divider, Flex, Heading, Input, Link, Stack } from "@chakra-ui/react";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../../firebase";
import PrimaryButton from "../components/elements/Button/PrimaryButton";
import { useMessage } from "../hooks/useMessage";

//ログインページ
const Login: NextPage = () => {
  const { showMessage } = useMessage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  //通常ログイン処理
  const emailLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
      showMessage({ title: "ログインしました。", status: "success" });
    } catch (err) {
      showMessage({ title: "ログインできませんでした。", status: "error" });
    }
    setIsLoading(false);
  };

  //Googleログイン処理
  const googleLogin = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
      showMessage({ title: "ログインしました。", status: "success" });
    } catch (err) {
      showMessage({ title: "ログインできませんでした。", status: "error" });
    }
    setIsLoading(false);
  };

  //ゲストログイン処理
  const guestLogin = async (): Promise<void> => {
    const guestEmail = "guest@gmai.com";
    const guestPassword = "guest2234";
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, guestEmail, guestPassword);
      router.push("/");
      showMessage({ title: "ログインしました。", status: "success" });
    } catch (err) {
      showMessage({ title: "ログインできませんでした。", status: "error" });
    }
    setIsLoading(false);
  };

  return (
    <Flex align="center" justify="center" height="100vh" bg="orange.50">
      <Box bg="white" w="md" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          ログインページ
        </Heading>
        <Divider my={4} />
        <Stack spacing={6} py={4} px={10}>
          <Input
            placeholder="メールアドレス"
            size="lg"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            placeholder="パスワード"
            size="lg"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
          ></Input>
          <PrimaryButton
            loading={loading}
            bg="orange.300"
            color="white"
            onClick={() => emailLogin(email, password)}
          >
            ログイン
          </PrimaryButton>
          <PrimaryButton
            loading={loading}
            bg="green.300"
            color="white"
            leftIcon={<FcGoogle />}
            onClick={googleLogin}
          >
            Googleログイン
          </PrimaryButton>
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
