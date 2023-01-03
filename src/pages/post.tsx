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
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import PrimaryButton from "../components/elements/Button/PrimaryButton";
import { useMessage } from "../hooks/useMessage";

type Inputs = {
  storeName: string;
  productName: string;
  base: string;
  review: string;
  picture: string;
  address: string;
};

const Post: NextPage = () => {
  const { showMessage } = useMessage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [loading, setIsLoading] = useState<boolean>(false);
  const [base, setBase] = useState("とんこつ");
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      console.log(data);
      console.log(base);
      setIsLoading(true);
      router.push("/");
      showMessage({ title: "投稿が完了しました。", status: "success" });
      setIsLoading(false);
    } catch (err) {
      showMessage({ title: "投稿できませんでした。", status: "error" });
    }
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
            <FormControl mb={4} isInvalid={errors.productName ? true : false}>
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
                id="productName"
                {...register("productName", {
                  required: "商品名を入力してください",
                })}
                autoComplete="off"
              />
              <FormErrorMessage>{errors.productName?.message}</FormErrorMessage>
            </FormControl>

            {/* ベース選択欄 */}
            <FormControl mb={4}>
              <FormLabel fontWeight="bold" color="orange.400">
                ベース
              </FormLabel>
              <RadioGroup id="base" onChange={setBase} value={base}>
                <Stack direction="row">
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
              <input id="picture" className="upload-label" type="file" {...register("picture")} />
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
