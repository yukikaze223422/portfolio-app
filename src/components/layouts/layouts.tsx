import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = { children: ReactNode };

const Layout = ({ children }: Props) => {
  return (
    <>
      <Box h="100vh" w="100%" bg="orange.50">
        {children}
      </Box>
    </>
  );
};

export default Layout;
