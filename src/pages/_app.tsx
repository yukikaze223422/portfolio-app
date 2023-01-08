import { ChakraProvider } from "@chakra-ui/react";
import "modern-css-reset/dist/reset.min.css"; //CSSをリセット
import { AppProps } from "next/app";
import Layout from "../components/layouts/layouts";
import { AuthProvider } from "../context/AuthContext";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ChakraProvider>
      <Layout>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </Layout>
    </ChakraProvider>
  );
}

export default MyApp;
