import Head from "next/head";
import { ReactNode } from "react";

type Props = { children: ReactNode; title: string };

const TitleLayout = ({ children, title }: Props) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicons/favicon.ico" />
      </Head>
      {children}
    </>
  );
};

export default TitleLayout;
