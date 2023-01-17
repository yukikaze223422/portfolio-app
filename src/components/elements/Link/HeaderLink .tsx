import { Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href: string;
};

const HeaderLink = ({ children, href }: Props) => {
  return (
    <Link
      as={NextLink}
      href={href}
      pr={5}
      fontWeight="bold"
      color="gray.500"
      _hover={{ opacity: 0.8, color: "orange.300", textDecoration: "none" }}
    >
      {children}
    </Link>
  );
};

export default HeaderLink;
