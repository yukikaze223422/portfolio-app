import { Badge, Flex, Heading, Image, Link, Stack, Text, VStack } from "@chakra-ui/react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { NextPage } from "next";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { db } from "../../firebase";
import TitleLayout from "../components/layouts/titleLayout";

// timestampを、yy/mm/dd/hh/mm形式へ変換
const getDisplayTime = (e: any) => {
  if (e === null) return;
  const year = e.toDate().getFullYear();
  const month = ("0" + (e.toDate().getMonth() + 1)).slice(-2);
  const date = ("0" + e.toDate().getDate()).slice(-2);
  const hour = ("0" + e.toDate().getHours()).slice(-2);
  const min = ("0" + e.toDate().getMinutes()).slice(-2);

  return `${year}年${month}月${date}日 ${hour}:${min}`;
};

const Home: NextPage = () => {
  const [ramenData, setRamenData] = useState([]);
  const [offset, setOffset] = useState(0); // 何番目のアイテムから表示するか
  const perPage: number = 4; // 1ページあたりに表示したいアイテムの数

  useEffect(() => {
    const ramenDataRef = collection(db, "ramenData");
    const sortRamenDataRef = query(ramenDataRef, orderBy("createTime", "desc"));
    getDocs(sortRamenDataRef).then((querySnapshot) => {
      setRamenData(
        querySnapshot.docs.map((doc) => ({
          ...doc.data({ serverTimestamps: "estimate" }),
          id: doc.id,
        }))
      );
    });
  }, []);

  // クリック時のfunction
  const handlePageChange = (data: any) => {
    let page_number = data["selected"]; // クリックした部分のページ数が{selected: 2}のような形で返ってくる
    setOffset(page_number * perPage); // offsetを変更し、表示開始するアイテムの番号を変更
  };

  return (
    <TitleLayout title={"RamenSharing｜おすすめラーメン共有サイト"}>
      <VStack py={12} gap={4}>
        {ramenData.slice(offset, offset + perPage).map((data) => (
          <Link
            as={NextLink}
            href={`${data.id}/detail`}
            key={data.id}
            w="90%"
            _hover={{ opacity: 0.8, color: "orange.500", textDecoration: "none" }}
          >
            <Flex
              bg="orange.100"
              p={4}
              borderRadius="md"
              shadow="md"
              gap={4}
              h={{ base: "700px", md: "330px" }}
              position="relative"
              direction={{ base: "column", md: "row" }}
            >
              <Image
                src={data.picture}
                alt={data.ramenName}
                w={{ base: "400px", md: "300px" }}
                h={{ base: "400px", md: "300px" }}
                objectFit="cover"
                borderRadius="10px"
                mx="auto"
              />
              <Stack width="100%">
                <Heading as="h1" textAlign={{ base: "center", md: "left" }}>
                  {data.storeName}
                  <Badge variant="solid" colorScheme="green" ml={2}>
                    {data.base}
                  </Badge>
                </Heading>
                <Heading
                  as="h4"
                  size="md"
                  borderBottom="1px"
                  borderColor="orange.300"
                  pb={1}
                  textAlign={{ base: "center", md: "left" }}
                >
                  {data.ramenName}
                </Heading>
                <Text
                  h={{ base: "75px", sm: "120px", md: "120px", lg: "165" }}
                  noOfLines={{ base: 3, sm: 5, md: 5, lg: 7 }}
                >
                  {data.detail}
                </Text>
                <Flex pb={2} position="absolute" bottom={{ base: "0", md: "15px" }}>
                  <Image
                    src={data.photoURL ? data.photoURL : "/user.png"}
                    alt={data.contributor}
                    borderRadius="999px"
                    objectFit="cover"
                    w="25px"
                    h="25px"
                  />
                  <Flex direction={{ base: "column", md: "row" }}>
                    <Text>&nbsp;{data.contributor}　</Text>
                    <Text>投稿日時：{getDisplayTime(data.createTime)}</Text>
                  </Flex>
                </Flex>
              </Stack>
            </Flex>
          </Link>
        ))}
        {/* ページネーションを置きたい箇所に以下のコンポーネントを配置 */}
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          pageCount={Math.ceil(ramenData.length / perPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          activeClassName={"active"}
          previousClassName={"pagination__previous"}
          nextClassName={"pagination__next"}
          disabledClassName={"pagination__disabled"}
        />
      </VStack>
    </TitleLayout>
  );
};

export default Home;
