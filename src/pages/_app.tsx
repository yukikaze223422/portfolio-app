import { ChakraProvider } from "@chakra-ui/react";
import { LoadScript } from "@react-google-maps/api";
import "modern-css-reset/dist/reset.min.css"; //CSSをリセット
import { AppProps } from "next/app";
import "../../styles/Home.module.css";
import "../../styles/paginate.css";
import Layout from "../components/layouts/layouts";
import { AuthProvider, AuthUser } from "../context/AuthContext";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ChakraProvider>
      <LoadScript googleMapsApiKey="AIzaSyC-7ksgiOxvDnluE1jR27Ynu9NZIAbIdw0">
        <AuthProvider>
          <AuthUser>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AuthUser>
        </AuthProvider>
      </LoadScript>
    </ChakraProvider>
  );
}

export default MyApp;
