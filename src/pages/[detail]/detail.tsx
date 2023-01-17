import { Badge, Box, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";
import { doc, getDoc } from "firebase/firestore";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Geocode from "react-geocode";
import { db } from "../../../firebase";
import PrimaryButton from "../../components/elements/Button/PrimaryButton";
import { useAuthContext } from "../../context/AuthContext";

type Data = {
  uid: string;
  storeName: string;
  ramenName: string;
  base: string;
  detail: string;
  address?: string;
  picture?: string;
  createTime?: any;
  contributor: string;
};

const Detail: NextPage = () => {
  const router = useRouter();
  const { currentUser } = useAuthContext();
  const { detail }: any = router.query;
  const [posts, setPosts] = useState<Data | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const containerStyle = {
    width: "auto",
    height: "400px",
  };

  const center = {
    lat: lat,
    lng: lng,
  };

  const position = {
    lat: lat,
    lng: lng,
  };

  const divStyle = {
    background: "white",
    fontSize: 7.5,
  };

  useEffect(() => {
    const docRef = doc(db, "ramenData", detail);
    const readPost = async () => {
      const docSnap = await getDoc(docRef);

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
        if (docSnap.data().address !== "") {
          Geocode.setApiKey("AIzaSyC-7ksgiOxvDnluE1jR27Ynu9NZIAbIdw0");
          await Geocode.fromAddress(docSnap.data().address).then(
            (response) => {
              console.log(response);
              const { lat, lng } = response.results[0].geometry.location;
              setLat(lat);
              setLng(lng);
            },
            (error) => {
              console.error(error);
            }
          );
        } else {
          console.log("データが取得できませんでした。");
        }
      }
    };
    readPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(lat);
  console.log(lng);

  return (
    <Flex flexDirection="column" align="center" w="full">
      <Stack textAlign="center" w={{ base: "100%", md: "80%" }} p={4} spacing="4">
        {/* 店舗名 */}
        <Text my={4} fontSize={{ base: "3xl", sm: "4xl" }} fontWeight="bold" color="orange.400">
          {posts?.storeName}
        </Text>
        {/* ラーメン画像 */}
        <Image
          src={posts?.picture}
          alt={posts?.ramenName}
          objectFit="contain"
          borderRadius="3%"
          maxH="lg"
        />
        {/* ラーメン名 */}
        <Text fontSize={{ base: "xl", sm: "3xl" }} fontWeight="bold" color="orange.400">
          {posts?.ramenName}
          <Badge variant="solid" colorScheme="green" ml={2} fontSize="sm">
            {posts?.base}
          </Badge>
        </Text>
        {/* ラーメンのレビュー */}
        <Box rounded="lg" bg="white" boxShadow="lg" py={7} px={{ base: 4, md: 10 }}>
          <Text fontSize={{ base: "2xl", sm: "3xl" }} fontWeight="bold" color="orange.400">
            レビュー
          </Text>
          <Text fontSize={{ base: "sm", sm: "md" }} align="left">
            {posts?.detail}
          </Text>
        </Box>
        {lng !== null && lat !== null ? (
          <Box rounded="lg" bg="white" boxShadow="lg" py={10} px={{ base: 4, md: 10 }}>
            <Text fontSize={{ base: "2xl", sm: "3xl" }} fontWeight="bold" color="orange.400">
              所在地
            </Text>
            <Text fontSize={{ base: "xl", sm: "2xl" }}>{posts?.address}</Text>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>
              <MarkerF position={position} />
              <InfoWindowF position={position}>
                <Box style={divStyle}>
                  <Text fontWeight="bold">{posts?.storeName}</Text>
                </Box>
              </InfoWindowF>
            </GoogleMap>
          </Box>
        ) : null}
        <Text textAlign="left" fontSize="15px">
          投稿者：{posts?.contributor}　
        </Text>
        {/* 戻る/編集ボタン部分 */}
        <Stack>
          {/* 編集ボタン：ログインしているユーザーと、投稿者idが一致した場合のみ表示*/}
          {currentUser?.uid === posts?.uid && (
            <NextLink href={`/posts/${detail}/edit`} passHref>
              <PrimaryButton bg="pink.400" color="white" type="button" w="40%">
                編集
              </PrimaryButton>
            </NextLink>
          )}

          {/* 戻るボタン */}
          <NextLink href="/" passHref>
            <PrimaryButton bg="gray.400" color="white" type="button" w="40%">
              戻る
            </PrimaryButton>
          </NextLink>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default Detail;
