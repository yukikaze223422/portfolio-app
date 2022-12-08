import { AppProps } from "next/app";
import "../styles/globals.css";
import "modern-css-reset/dist/reset.min.css"; //CSSをリセット

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return <Component {...pageProps} />;
}

export default MyApp;
