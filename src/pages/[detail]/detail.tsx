import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { LoadScript } from "@react-google-maps/api";
import { doc, getDoc } from "firebase/firestore";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
  const [lat, setLat] = useState<number>();
  const [lng, setLng] = useState<number>();
  const [geocoder, setGeocoder] = useState<undefined | google.maps.Geocoder>(undefined);

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
        if (window.google !== undefined && posts?.address !== null) {
          //const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: docSnap.data().address }, (results, status) => {
            console.log("aaaa");
            if (status === "OK") {
              setLat(results[0].geometry.location.lat()),
                setLng(results[0].geometry.location.lng());
            }
          });
        }
      } else {
        console.log("データが取得できませんでした。");
      }
    };
    readPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createOffsetGeocoder = () => {
    return setGeocoder(new window.google.maps.Geocoder());
  };

  /*   if (geocoder !== undefined && posts?.address !== null) {
    //const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: posts?.address }, (results, status) => {
      console.log("aaaa");
      if (status === "OK") {
        setLat(results[0].geometry.location.lat()), setLng(results[0].geometry.location.lng());
      }
    });
  } */

  console.log(lat);
  console.log(lng);
  console.log(window.google);

  return (
    <Flex flexDirection="column" align="center" w="full">
      <Stack textAlign="center" w={{ base: "100%", md: "80%" }} p={4} spacing="4">
        {/* アプリ名 */}
        <Text my={4} fontSize={{ base: "2xl", sm: "4xl" }} fontWeight="bold" color="orange.400">
          {posts?.storeName}
        </Text>
        {/* アプリ画像 */}
        <Image
          borderRadius="lg"
          src={posts?.picture}
          alt={posts?.ramenName}
          objectFit="contain"
          maxH="lg"
        />
        {/* アプリの説明欄 */}
        <Box rounded="lg" bg="white" boxShadow="lg" py={10} px={{ base: 4, md: 10 }}>
          <Text fontSize={{ base: "sm", sm: "md" }} align="left">
            {posts?.detail}
          </Text>
        </Box>
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
        {window.google === undefined ? (
          <>
            <LoadScript
              googleMapsApiKey="AIzaSyC-7ksgiOxvDnluE1jR27Ynu9NZIAbIdw0"
              onLoad={() => createOffsetGeocoder()}
            ></LoadScript>
          </>
        ) : (
          <></>
        )}
        <p>緯度：{lat}</p>
        <p>緯度：{lng}</p>
      </Stack>
    </Flex>
  );
};

export default Detail;
