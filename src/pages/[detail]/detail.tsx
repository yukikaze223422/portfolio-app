import { Badge, Box, Center, Flex, Image, Link, Stack, Text } from "@chakra-ui/react";
import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";
import { doc, getDoc } from "firebase/firestore";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Geocode from "react-geocode";
import { db } from "../../../firebase";
import PrimaryButton from "../../components/elements/Button/PrimaryButton";
import TitleLayout from "../../components/layouts/titleLayout";
import { useAuthContext } from "../../context/AuthContext";
import { Data } from "../../types/data";

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
          Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLEMAP_API_KEY);
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

  return (
    <TitleLayout title={"詳細｜RamenSharing"}>
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

          {/* 店舗住所 */}
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

          {/* アカウント */}
          {currentUser.uid === posts?.uid ? (
            <Link
              as={NextLink}
              href="/mypage"
              _hover={{ opacity: 0.8, color: "orange.500", textDecoration: "none" }}
            >
              <Flex direction="row">
                <Text textAlign="left" fontSize="15px">
                  投稿者：
                </Text>
                <Image
                  src={posts?.picture ? posts?.picture : "/user.png"}
                  alt={posts?.contributor}
                  mr={1}
                  borderRadius="999px"
                  objectFit="cover"
                  w="25px"
                  h="25px"
                />
                <Text textAlign="left" fontSize="15px">
                  {posts?.contributor}
                </Text>
              </Flex>
            </Link>
          ) : (
            <Flex direction="row">
              <Text textAlign="left" fontSize="15px">
                投稿者：
              </Text>
              <Image
                src={posts?.picture ? posts?.picture : "/user.png"}
                alt={posts?.contributor}
                mr={1}
                borderRadius="999px"
                objectFit="cover"
                w="25px"
                h="25px"
              />
              <Text textAlign="left" fontSize="15px">
                {posts?.contributor}
              </Text>
            </Flex>
          )}

          <Stack>
            {/* 編集ボタン：ログインしているユーザーと、投稿者idが一致した場合のみ表示*/}
            <Center>
              {currentUser?.uid === posts?.uid && (
                <PrimaryButton
                  bg="pink.400"
                  color="white"
                  type="button"
                  w="40%"
                  onClick={() => {
                    router.push(`/${detail}/edit`);
                  }}
                >
                  編集
                </PrimaryButton>
              )}
            </Center>

            {/* 戻るボタン */}
            <Center>
              <PrimaryButton
                bg="gray.400"
                color="white"
                type="button"
                w="40%"
                onClick={() => router.back()}
              >
                戻る
              </PrimaryButton>
            </Center>
          </Stack>
        </Stack>
      </Flex>
    </TitleLayout>
  );
};

export default Detail;
