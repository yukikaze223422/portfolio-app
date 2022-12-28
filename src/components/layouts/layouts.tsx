import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import Footer from "./footer/Footer";
import Header from "./header/Header";

type Props = { children: ReactNode };

const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <Box h="100vh" w="100%" bg="orange.50" pt={8} mt={20}>
        {children}
      </Box>
      <Footer />
    </>
  );
};

export default Layout;
