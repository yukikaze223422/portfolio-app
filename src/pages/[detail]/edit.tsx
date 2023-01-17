import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
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
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { validateImage } from "image-validator";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { db, storage } from "../../../firebase";
import PrimaryButton from "../../components/elements/Button/PrimaryButton";
import { useAuthContext } from "../../context/AuthContext";
import { useMessage } from "../../hooks/useMessage";
import { Data } from "../../types/data";
import { Inputs } from "../../types/inputs";

const Edit: NextPage = () => {
  const router = useRouter();
  const { detail }: any = router.query;
  const { showMessage } = useMessage();
  const { currentUser } = useAuthContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const [posts, setPosts] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [base, setBase] = useState<string>(posts?.base);
  const [file, setFile] = useState<File>(null!);

  //バリデーション（react-hook-form）
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({ shouldUnregister: false });

  useEffect(() => {
    const docRef = doc(db, "ramenData", detail);
    const readPost = async () => {
      const docSnap = await getDoc(docRef);

      //firestoreから対象のデータを読み込みuseStateにセット
      if (docSnap.exists()) {
        setPosts({
          uid: docSnap.data().uid,
          storeName: docSnap.data().storeName,
          ramenName: docSnap.data().ramenName,
          base: docSnap.data().base,
          detail: docSnap.data().detail,
          address: docSnap.data().address,
          picture: docSnap.data().picture,
          contributor: docSnap.data().contributor,
        });
        setBase(docSnap.data().base);
        setValue("storeName", docSnap.data().storeName);
        setValue("ramenName", docSnap.data().ramenName);
        setValue("review", docSnap.data().detail);
        setValue("picture", docSnap.data().picture);
        setValue("address", docSnap.data().address);
      }
    };
    readPost();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setLoading(true);

      // 画像アップロード
      if (file != null) {
        const storageRef = ref(storage, `images/${file.name}_${file.lastModified}`);
        await uploadBytes(storageRef, file)
          .then((snapshot) => {
            console.log(`アップロードに成功しました: ${snapshot}`);
          })
          .catch((error) => {
            console.log(`アップロードに失敗しました: ${error}`);
          });
      }

      //firestore storageより画像データ取得(画像未選択時はロゴ表示)
      const washingtonRef = doc(db, "ramenData", detail);
      const gsReference = ref(
        storage,
        file != null
          ? `gs://portfolio-app-9fa16.appspot.com/images/${file.name}_${file.lastModified}`
          : posts?.picture
      );

      //firestore更新処理
      await getDownloadURL(gsReference)
        .then((url) => {
          updateDoc(washingtonRef, {
            storeName: data.storeName,
            ramenName: data.ramenName,
            base: base,
            detail: data.review,
            address: data.address,
            picture: url,
            updateTime: serverTimestamp(),
            contributor: currentUser.displayName,
          });
        })
        .catch((err) => console.log(err));

      await router.push("/");
      showMessage({ title: "更新が完了しました。", status: "success" });
    } catch (err) {
      showMessage({ title: "更新できませんでした。", status: "error" });
    }
    setLoading(false);
  };

  //詳細画面へ戻る
  const onClickDetail = () => {
    router.push(`/${detail}/detail`);
  };

  //データを削除後、ホーム画面へ移動
  const onClickDelete = async () => {
    await deleteDoc(doc(db, "ramenData", detail));
    await router.push("/");
  };

  return (
    <Flex align="center" justify="center">
      <Box my={4} bg="white" w={{ base: "90%", md: "80%" }} p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          投稿内容更新
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
                id="storeName"
                type="text"
                w="90%"
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
                id="ramenName"
                type="text"
                w="90%"
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
                id="review"
                placeholder="ラーメンの感想を書いてください。（450文字以内）"
                rows={5}
                w="90%"
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

            {/* 更新ボタン */}
            <VStack>
              <PrimaryButton loading={loading} bg="blue.300" color="white" type="submit" w="40%">
                更新
              </PrimaryButton>

              {/* データ削除ボタン */}
              <PrimaryButton
                loading={loading}
                bg="red.400"
                color="white"
                type="button"
                w="40%"
                onClick={onOpen}
              >
                削除
              </PrimaryButton>

              {/* 削除確認ダイアログ */}
              <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      データ削除確認
                    </AlertDialogHeader>

                    <AlertDialogBody>本当にデータを削除しますか？</AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        キャンセル
                      </Button>
                      <Button colorScheme="red" onClick={onClickDelete} ml={3}>
                        削除
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>

              {/* 戻るボタン */}
              <PrimaryButton
                loading={loading}
                bg="gray.400"
                color="white"
                type="button"
                w="40%"
                onClick={onClickDetail}
              >
                戻る
              </PrimaryButton>
            </VStack>
          </form>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Edit;
