import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { updateProfile } from "firebase/auth";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { validateImage } from "image-validator";
import type { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { db, storage } from "../../firebase";
import { useAuthContext } from "../context/AuthContext";

/**
    ユーザープロフィールページ
 */
const MyPage: NextPage = () => {
  const { currentUser } = useAuthContext();

  const [username, setUsername] = useState("");
  const [file, setFile] = useState<File>(null!);
  const [isUploaded, setIsUploaded] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  // アップロードされたファイルのバリデーション関数
  const validateFile = async (file: File) => {
    // 3GBを最大のファイルサイズに設定
    const limitFileSize = 5 * 1024 * 1024;
    if (file.size > limitFileSize) {
      alert("ファイルサイズが大きすぎます。\n5メガバイト以下にしてください。");
      return false;
    }
    const isValidImage = await validateImage(file);
    if (!isValidImage) {
      alert("画像ファイル以外はアップロードできません。");
      return false;
    }
    return true;
  };

  // 画像選択関数
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsUploaded(false);
    const reader = new FileReader();
    if (e.target.files !== null) {
      const file = e.target.files[0];
      if (!(await validateFile(file))) {
        return;
      }
      reader.onloadend = async () => {
        setFile(file);
      };
      reader.readAsDataURL(file);
    }
    setIsUploaded(true);
  };

  const handleUpdateButtonClick = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);

      // 画像アップロード
      if (file != null) {
        const storageRef = ref(storage, `icons/${file.name}_${file.lastModified}`);
        await uploadBytes(storageRef, file)
          .then((snapshot) => {
            console.log(`アップロードに成功しました: ${snapshot}`);
          })
          .catch((error) => {
            console.log(`アップロードに失敗しました: ${error}`);
          });
      }

      //firestore storageより画像データ取得(画像未選択時はロゴ表示)
      const gsReference = ref(
        storage,
        file !== null
          ? `gs://portfolio-app-9fa16.appspot.com/icons/${file.name}_${file.lastModified}`
          : currentUser.photoURL
      );

      await getDownloadURL(gsReference)
        .then(async (url) => {
          await updateProfile(currentUser, {
            displayName: username,
            photoURL: url,
          });
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log("エラー");
    }
    console.log("currentUser:" + currentUser.photoURL);
    console.log("currentUser:" + currentUser.displayName);
    const q = query(collection(db, "ramenData"), where("uid", "==", currentUser.uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (data) => {
      const washingtonRef = doc(db, "ramenData", data.id);
      await updateDoc(washingtonRef, {
        photoURL: currentUser.photoURL,
        contributor: currentUser.displayName,
      });
      console.log(data.data().photoURL);
      console.log(data.data().contributor);
    });

    setLoading(false);
  };

  return (
    <Flex flexDirection={"column"} align={"center"} w={"full"} p={{ base: 2, sm: 4, md: 8 }}>
      <Heading fontSize={"4xl"} mb={8}>
        マイページ
      </Heading>

      <Box
        rounded={"lg"}
        bg={"white"}
        boxShadow={"lg"}
        py={10}
        px={{ base: 4, sm: 4, md: 14 }}
        w={{ base: "100%", sm: "80%", md: "55%" }}
        maxW={"lg"}
      >
        {/* プロフィールアイコン */}
        <VStack mb={8}>
          <Image
            src={currentUser.photoURL ? currentUser.photoURL : "/user.png"}
            alt={`profile icon of ${username}`}
            borderRadius={"100%"}
            maxW={40}
            maxH={40}
          />
          <Text fontSize={"sm"}>
            {!currentUser.photoURL && "プロフィールアイコンが設定されていません"}
          </Text>
        </VStack>
        <Box mb={8}>
          <Text fontWeight={"bold"} color={"blue.400"}>
            メールアドレス
          </Text>
          <Text mt={2}>{currentUser.email}</Text>
        </Box>
        {/* プロフィール編集フォーム */}
        <form onSubmit={(e) => handleUpdateButtonClick(e)}>
          {/* ユーザーネーム入力欄 */}
          <FormControl id="username" isRequired mb={8}>
            <FormLabel fontWeight={"bold"} color={"blue.400"}>
              ユーザーネーム
            </FormLabel>
            <Input
              id="username"
              type="username"
              placeholder="Usernameを入力"
              defaultValue={currentUser.displayName ? currentUser.displayName : ""}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
            />
          </FormControl>

          {/* アイコン設定 */}
          <FormControl mb={8}>
            <FormLabel fontWeight={"bold"} color={"blue.400"}>
              プロフィールアイコンを変更する
            </FormLabel>
            <input type="file" onChange={handleImageSelect} />
            <Text fontSize={"sm"} mt={2} color={"red.500"}>
              {!isUploaded && "画像をアップロードしています..."}
            </Text>
          </FormControl>

          {/* 更新ボタン */}
          <Button
            type="submit"
            bg={"blue.400"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
            mr={4}
          >
            更新
          </Button>

          {/* 戻るボタン */}
          <NextLink href="/" passHref>
            <Button
              loadingText="Submitting"
              bg={"gray.400"}
              color={"white"}
              _hover={{
                bg: "gray.500",
              }}
            >
              TOPへ
            </Button>
          </NextLink>
        </form>
      </Box>
    </Flex>
  );
};

export default MyPage;
