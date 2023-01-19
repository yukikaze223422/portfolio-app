import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import Footer from "./footer/Footer";
import Header from "./header/Header";

type Props = { children: ReactNode; title: string };

const Layout = ({ children, title }: Props) => {
  return (
    <>
      <Header />
      <Flex direction="column" bg="orange.50" w="full" h="full" minH="660px">
        {children}
      </Flex>
      <Footer />
    </>
  );
};

export default Layout;
