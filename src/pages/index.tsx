import { Box, Flex, Heading, Image, Stack, VStack } from "@chakra-ui/react";
import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <VStack pb={12}>
      <Flex bg="white" w="90%" p={4} mb={5} borderRadius="md" shadow="md" gap={4}>
        <Box>
          <Image src="https://bit.ly/dan-abramov" alt="Dan Abramov" w="300px" h="300px" />
        </Box>
        <Stack>
          <Heading as="h1" textAlign="left">
            糸島ラーメン ゆうゆう
          </Heading>
          <Box>非常においしいラーメンです。</Box>
        </Stack>
      </Flex>
      <Flex bg="white" w="90%" p={4} mb={5} borderRadius="md" shadow="md" gap={4}>
        <Box>
          <Image src="https://bit.ly/dan-abramov" alt="Dan Abramov" w="300px" h="300px" />
        </Box>
        <Stack>
          <Heading as="h1" textAlign="left">
            糸島ラーメン ゆうゆう
          </Heading>
          <Box>
            非常においしいラーメンです。非常においしいラーメンです。非常においしいラーメンです。非常においしいラーメンです。非常においしいラーメンです。非常においしいラーメンです。非常においしいラーメンです。非常においしいラーメンです。非常においしいラーメンです。非常においしいラーメンです。非常においしいラーメンです。非常においしいラーメンです。非常においしいラーメンです。非常においしいラーメンです。非常においしいラーメンです。
          </Box>
        </Stack>
      </Flex>
      <Flex bg="white" w="90%" p={4} mb={5} borderRadius="md" shadow="md" gap={4}>
        <Box>
          <Image src="https://bit.ly/dan-abramov" alt="Dan Abramov" w="300px" h="300px" />
        </Box>
        <Stack>
          <Heading as="h1" textAlign="left">
            糸島ラーメン ゆうゆう
          </Heading>
          <Box>非常においしいラーメンです。</Box>
        </Stack>
      </Flex>
    </VStack>
  );
};

export default Home;
