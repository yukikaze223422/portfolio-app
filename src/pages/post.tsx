import {
  Badge,
  Box,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { validateImage } from "image-validator";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { db, storage } from "../../firebase";
import PrimaryButton from "../components/elements/Button/PrimaryButton";
import { useAuthContext } from "../context/AuthContext";
import { useMessage } from "../hooks/useMessage";

type Inputs = {
  storeName: string;
  ramenName: string;
  base: string;
  review: string;
  picture: string;
  address: string;
};

const Post: NextPage = () => {
  const { showMessage } = useMessage();
  const { currentUser } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [loading, setIsLoading] = useState<boolean>(false);
  const [base, setBase] = useState<string>("とんこつ");
  const [file, setFile] = useState<File>(null!);
  const router = useRouter();

  // ファイルのバリデーション関数
  const validateFile = async (file: File) => {
    // 3GBを最大のファイルサイズに設定
    const limitFileSize = 3 * 1024 * 1024;
    if (file.size > limitFileSize) {
      showMessage({
        title: "ファイルサイズが大きすぎます。\n3メガバイト以下にしてください。",
        status: "error",
      });
      return false;
    }
    const isValidImage = await validateImage(file);
    if (!isValidImage) {
      showMessage({ title: "画像ファイル以外はアップロードできません。", status: "error" });
      return false;
    }
    return true;
  };

  // 画像選択関数
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files![0];
    if (!(await validateFile(file))) {
      return;
    }
    reader.onloadend = async () => {
      setFile(file);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading(true);

      // 画像アップロード
      if (file != null) {
        const storageRef = await ref(storage, `images/${file.name}_${file.lastModified}`);
        await uploadBytes(storageRef, file)
          .then((snapshot) => {
            console.log(`アップロードに成功しました: ${snapshot}`);
          })
          .catch((error) => {
            console.log(`アップロードに失敗しました: ${error}`);
          });
      }

      //firestore storageより画像データ取得(画像未選択時はロゴ表示)
      const ramenLogo: string = "gs://portfolio-app-9fa16.appspot.com/images/ramenLogo.png";
      const gsReference = await ref(
        storage,
        file != null
          ? `gs://portfolio-app-9fa16.appspot.com/images/${file.name}_${file.lastModified}`
          : ramenLogo
      );

      await getDownloadURL(gsReference)
        .then((url) => {
          addDoc(collection(db, "ramenData"), {
            uid: currentUser.uid,
            storeName: data.storeName,
            ramenName: data.ramenName,
            base: base,
            detail: data.review,
            address: data.address,
            picture: url,
            createTime: serverTimestamp(),
            contributor: currentUser.displayName,
          });
        })
        .catch((err) => console.log(err));

      await router.push("/");
      showMessage({ title: "投稿が完了しました。", status: "success" });
    } catch (err) {
      showMessage({ title: "投稿できませんでした。", status: "error" });
    }
    setIsLoading(false);
  };

  return (
    <Flex align="center" justify="center">
      <Box my={4} bg="white" w={{ base: "90%", md: "80%" }} p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          おすすめラーメン投稿
        </Heading>
        <Divider my={4} />
        <Stack spacing={6} py={4} px={10}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* 店名入力欄 */}
            <FormControl mb={4} isInvalid={errors.storeName ? true : false}>
              <HStack mb={3}>
                <Badge variant="solid" colorScheme="red">
                  必須
                </Badge>
                <FormLabel fontWeight="bold" color="orange.400">
                  店舗名
                </FormLabel>
              </HStack>
              <Input
                type="text"
                w="90%"
                id="storeName"
                {...register("storeName", {
                  required: "店名を入力してください",
                })}
                autoComplete="off"
              />
              <FormErrorMessage>{errors.storeName?.message}</FormErrorMessage>
            </FormControl>

            {/* 商品名入力欄 */}
            <FormControl mb={4} isInvalid={errors.ramenName ? true : false}>
              <HStack mb={3}>
                <Badge variant="solid" colorScheme="red">
                  必須
                </Badge>
                <FormLabel fontWeight="bold" color="orange.400">
                  商品名
                </FormLabel>
              </HStack>
              <Input
                type="text"
                w="90%"
                id="ramenName"
                {...register("ramenName", {
                  required: "商品名を入力してください",
                })}
                autoComplete="off"
              />
              <FormErrorMessage>{errors.ramenName?.message}</FormErrorMessage>
            </FormControl>

            {/* ベース選択欄 */}
            <FormControl mb={4}>
              <FormLabel fontWeight="bold" color="orange.400">
                ベース
              </FormLabel>
              <RadioGroup id="base" onChange={setBase} value={base}>
                <Stack direction="row" flexWrap="wrap">
                  <Radio value="とんこつ">とんこつ</Radio>
                  <Radio value="醤油">醤油</Radio>
                  <Radio value="味噌">味噌</Radio>
                  <Radio value="塩">塩</Radio>
                  <Radio value="その他">その他</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {/* レビュー入力欄 */}
            <FormControl mb={4} isInvalid={errors.review ? true : false}>
              <HStack mb={3}>
                <Badge variant="solid" colorScheme="red">
                  必須
                </Badge>
                <FormLabel fontWeight="bold" color="orange.400">
                  レビュー
                </FormLabel>
              </HStack>
              <Textarea
                placeholder="ラーメンの感想を書いてください。（450文字以内）"
                rows={5}
                w="90%"
                id="review"
                {...register("review", {
                  required: "レビューを入力してください",
                  maxLength: {
                    value: 450,
                    message: "450文字以内で入力してください",
                  },
                })}
                autoComplete="off"
              />
              <FormErrorMessage>{errors.review?.message}</FormErrorMessage>
            </FormControl>

            {/* 画像アップロード */}
            <FormControl mb={4}>
              <HStack mb={3}>
                <Badge variant="solid" colorScheme="green">
                  任意
                </Badge>
                <FormLabel fontWeight="bold" color="orange.400">
                  ラーメンの写真
                </FormLabel>
              </HStack>
              <input
                id="picture"
                className="upload-label"
                type="file"
                {...register("picture")}
                onChange={handleImageSelect}
              />
            </FormControl>

            {/* 店舗住所入力欄 */}
            <FormControl isInvalid={errors.address ? true : false}>
              <HStack mb={3}>
                <Badge variant="solid" colorScheme="green">
                  任意
                </Badge>
                <FormLabel fontWeight="bold" color="orange.400">
                  店舗住所
                </FormLabel>
              </HStack>
              <Input
                id="address"
                type="text"
                w="90%"
                mb={4}
                {...register("address", {
                  maxLength: {
                    value: 100,
                    message: "100文字以内で入力してください",
                  },
                })}
                autoComplete="off"
              />
              <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
            </FormControl>

            {/* 登録ボタン */}
            <VStack>
              <PrimaryButton loading={loading} bg="orange.300" color="white" type="submit" w="40%">
                投稿する
              </PrimaryButton>
            </VStack>
          </form>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Post;
