import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  VStack,
} from "@chakra-ui/react";
import { useAuthContext } from "../../context/AuthContext";
import HeaderLoginMenuDrawer from "./HeaderLoginMenuDrawer";
import HeaderMenuDrawer from "./HeaderMenuDrawer";

type Props = {
  onClose: () => void;
  onToggle: () => void;
  isOpen: boolean;
};

const MenuDrawer = (props: Props) => {
  const { onClose, onToggle, isOpen } = props;
  const { currentUser } = useAuthContext();

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent onClick={onToggle}>
        <DrawerBody p={4}>
          <VStack>{currentUser === null ? <HeaderLoginMenuDrawer /> : <HeaderMenuDrawer />}</VStack>
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
