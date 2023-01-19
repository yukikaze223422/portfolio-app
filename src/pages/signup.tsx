import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
} from "@chakra-ui/react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineMail } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FiUser } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import { auth, db } from "../../firebase";
import PrimaryButton from "../components/elements/Button/PrimaryButton";
import { useAuthContext } from "../context/AuthContext";
import { useMessage } from "../hooks/useMessage";

type LoginUser = {
  username: string;
  email: string;
  password: string;
};

//サインアップページ
const SignUp: NextPage = () => {
  const { showMessage } = useMessage();
  const { currentUser } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUser>();

  const [loading, setLoading] = useState<boolean>(false);
  const [isRevealPassword, setIsRevealPassword] = useState<boolean>(false);
  const router = useRouter();

  //ログインユーザー登録処理
  const onSubmit: SubmitHandler<LoginUser> = async (data) => {
    try {
      setLoading(true);
      const newUser = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const uid = newUser.user.uid;
      if (newUser) {
        await setDoc(doc(db, "users", uid), {
          uid: uid,
          username: data.username,
          email: data.email,
          photoUrl: newUser.user.photoURL,
        });

        await updateProfile(auth.currentUser, {
          displayName: data.username,
        });
      }
      if (currentUser !== null) {
        router.push("/mypage");
        showMessage({ title: "登録が完了しました。", status: "success" });
      }
      setLoading(false);
    } catch (err) {
      showMessage({ title: "登録できませんでした。", status: "error" });
    }
  };

  //Googleログイン処理
  const googleRegister = async (): Promise<void> => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const user = auth.currentUser.displayName;
      await updateProfile(auth.currentUser, {
        displayName: user,
      });
      if (currentUser !== null) {
        router.push("/mypage");
        showMessage({ title: "登録しました。", status: "success" });
      }
    } catch {
      showMessage({ title: "登録できませんでした。", status: "error" });
    }
    setLoading(false);
  };

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box bg="white" w="md" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          新規登録
        </Heading>
        <Divider my={4} />
        <Stack spacing={6} py={4} px={10}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ユーザ名入力欄 */}
            <FormControl isInvalid={errors.username ? true : false}>
              <HStack mb={2}>
                <FiUser />
                <FormLabel htmlFor="username" fontWeight="bold">
                  ユーザー名
                </FormLabel>
              </HStack>
              <Input
                id="username"
                {...register("username", {
                  required: "ユーザー名を入力してください",
                  maxLength: {
                    value: 10,
                    message: "10文字以内で入力してください",
                  },
                })}
                placeholder="ユーザー名"
                size="lg"
                autoComplete="off"
              />
              <FormErrorMessage>
                {errors.username?.message && errors.username.message}
              </FormErrorMessage>
            </FormControl>

            <Stack py={2}>
              {/* メールアドレス入力欄 */}
              <FormControl isInvalid={errors.email ? true : false}>
                <HStack my={2}>
                  <AiOutlineMail />
                  <FormLabel htmlFor="email" fontWeight="bold">
                    メールアドレス
                  </FormLabel>
                </HStack>
                <Input
                  id="email"
                  placeholder="メールアドレス"
                  {...register("email", {
                    required: "メールアドレスを入力してください。",
                    pattern: {
                      value: /^[\w\-._]+@[\w\-._]+\.[A-Za-z]+/,
                      message: "正しいメールアドレスの形式で入力してください。",
                    },
                  })}
                  size="lg"
                  type="email"
                  autoComplete="off"
                />
                <FormErrorMessage>{errors.email?.message && errors.email.message}</FormErrorMessage>
              </FormControl>

              {/* パスワード入力欄 */}
              <FormControl isInvalid={errors.email ? true : false}>
                <HStack my={2}>
                  <RiLockPasswordLine />
                  <FormLabel htmlFor="password" fontWeight="bold">
                    パスワード
                  </FormLabel>
                </HStack>
                <InputGroup>
                  <Input
                    id="password"
                    {...register("password", {
                      required: "パスワードを入力してください。",
                      minLength: {
                        value: 6,
                        message: "６文字以上で入力してください。",
                      },
                    })}
                    placeholder="パスワード"
                    size="lg"
                    type={isRevealPassword ? "text" : "password"}
                    autoComplete="off"
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
                <FormErrorMessage>
                  {errors.password?.message && errors.password.message}
                </FormErrorMessage>
              </FormControl>
            </Stack>

            {/* 登録ボタン */}
            <Stack pt={4}>
              <PrimaryButton loading={loading} bg="orange.300" color="white" type="submit">
                登録
              </PrimaryButton>
            </Stack>
          </form>

          {/* Google登録ボタン */}
          <PrimaryButton
            loading={loading}
            bg="green.300"
            color="white"
            leftIcon={<FcGoogle />}
            onClick={googleRegister}
          >
            Google登録
          </PrimaryButton>

          {/* ログイン画面遷移ボタン */}
          <Box textAlign="center">
            <Link as={NextLink} href="/login" _hover={{ opacity: 0.8 }} color="blue.600">
              ログインはこちら
            </Link>
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
};

export default SignUp;
