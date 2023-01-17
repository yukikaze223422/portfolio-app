import { Button } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  loading?: boolean;
  bg: string;
  color: string;
  w?: string;
  type?: "button" | "submit" | "reset";
  leftIcon?: any;
  onClick?: any;
};

const PrimaryButton = (props: Props) => {
  const { children, loading = false, bg, color, w, type, onClick, leftIcon } = props;
  return (
    <Button
      isLoading={loading}
      bg={bg}
      color={color}
      w={w}
      type={type}
      _hover={{ opacity: 0.8 }}
      onClick={onClick}
      leftIcon={leftIcon}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
