import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  VStack,
} from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { NextRouter, useRouter } from "next/router";
import { auth } from "../../../firebase";
import { useMessage } from "../../hooks/useMessage";

type Props = {
  onClose: () => void;
  onToggle: () => void;
  isOpen: boolean;
};

const MenuDrawer = (props: Props) => {
  const { onClose, onToggle, isOpen } = props;
  const { showMessage } = useMessage();
  const router: NextRouter = useRouter();

  const onClickHome = () => {
    router.push("/");
  };

  const onClickLogout = async () => {
    signOut(auth);
    router.push("/login");
    showMessage({ title: "ログアウトしました。", status: "success" });
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent onClick={onToggle}>
        <DrawerBody p={4}>
          <VStack>
            <Button
              w="80%"
              bg="white"
              borderBottom="1px"
              borderColor="gray.200"
              onClick={onClickHome}
            >
              ホーム
            </Button>
            <Button
              w="80%"
              bg="white"
              borderBottom="1px"
              borderColor="gray.200"
              onClick={onClickLogout}
            >
              ログアウト
            </Button>
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button w="100%" variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MenuDrawer;
