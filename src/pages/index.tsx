import { Badge, Flex, Heading, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

import { NextPage } from "next";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

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
  const [image, setImage] = useState(null);
  console.log(ramenData);

  useEffect(() => {
    const ramenDataRef = collection(db, "ramenData");
    const sortRamenDataRef = query(ramenDataRef, orderBy("createTime", "desc"));
    getDocs(sortRamenDataRef).then((querySnapshot) => {
      setRamenData(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  return (
    <>
      <VStack py={12} gap={4}>
        {ramenData.map((data) => (
          <Flex
            key={data.id}
            bg="orange.100"
            p={4}
            borderRadius="md"
            shadow="md"
            gap={4}
            w="90%"
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
              <Text h={{ base: "120px", md: "165px" }} noOfLines={{ base: 5, md: 7 }}>
                {data.detail}
              </Text>
              <Flex pb={2} position="absolute" bottom={{ base: "0", md: "15px" }}>
                <Image
                  src="https://bit.ly/dan-abramov"
                  alt={data.contributor}
                  borderRadius="999px"
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
        ))}
      </VStack>
    </>
  );
};

export default Home;
