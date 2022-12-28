import {
  Badge,
  Box,
  Divider,
  Flex,
  FormControl,
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
import { useState } from "react";
import PrimaryButton from "../components/elements/Button/PrimaryButton";

const Post: NextPage = () => {
  const [loading, setIsLoading] = useState<boolean>(false);
  const [base, setBase] = useState("とんこつ");

  return (
    <Flex align="center" justify="center">
      <Box my={4} bg="white" w={{ base: "90%", md: "80%" }} p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          おすすめラーメン投稿
        </Heading>
        <Divider my={4} />
        <Stack spacing={6} py={4} px={10}>
          <form>
            {/* 店名入力欄 */}
            <FormControl mb={4}>
              <HStack mb={3}>
                <Badge variant="solid" colorScheme="red">
                  必須
                </Badge>
                <FormLabel fontWeight="bold" color="orange.400">
                  店名
                </FormLabel>
              </HStack>
              <Input type="text" w="90%" />
            </FormControl>

            {/* 店名入力欄 */}
            <FormControl mb={4}>
              <HStack mb={3}>
                <Badge variant="solid" colorScheme="red">
                  必須
                </Badge>
                <FormLabel fontWeight="bold" color="orange.400">
                  商品名
                </FormLabel>
              </HStack>
              <Input type="text" w="90%" />
            </FormControl>

            {/* ベース選択欄 */}
            <FormControl mb={4}>
              <FormLabel fontWeight="bold" color="orange.400">
                ベース
              </FormLabel>
              <RadioGroup onChange={setBase} value={base}>
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
            <FormControl>
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
                mb={4}
              />
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
              <input className="upload-label" type="file" />
            </FormControl>

            {/* 店舗住所入力欄 */}
            <FormControl>
              <HStack mb={3}>
                <Badge variant="solid" colorScheme="green">
                  任意
                </Badge>
                <FormLabel fontWeight="bold" color="orange.400">
                  店舗住所
                </FormLabel>
              </HStack>
              <Input type="text" w="90%" mb={4} />
            </FormControl>
          </form>
          {/* 登録ボタン */}
          <VStack>
            <PrimaryButton loading={loading} bg="orange.300" color="white" type="submit" w="40%">
              投稿する
            </PrimaryButton>
          </VStack>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Post;
