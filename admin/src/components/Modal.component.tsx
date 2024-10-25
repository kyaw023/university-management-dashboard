import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { AlertTriangle, LogOut, Trash2 } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  actionType: "logout" | "delete";
  handleAction: () => void;
  isLoading?: boolean;
}

export default function ModalComponent({
  isOpen,
  onOpenChange,
  actionType,
  handleAction,
  isLoading = false,
}: ModalProps) {
  const { onClose } = useDisclosure();

  const title = actionType === "logout" ? "Log Out" : "Delete Account";
  const description =
    actionType === "logout"
      ? "Are you sure you want to log out? All unsaved changes will be lost, and you will need to log in again to access your account."
      : "Are you sure you want to delete your account? This action cannot be undone, and all your data will be permanently deleted.";
  const Icon = actionType === "logout" ? LogOut : Trash2;
  const confirmText = actionType === "logout" ? "Log Out" : "Delete Account";

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      size="sm"
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                {title}
              </div>
            </ModalHeader>
            <ModalBody>
              <p>{description}</p>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                color={actionType === "logout" ? "primary" : "danger"}
                onClick={handleAction}
                isLoading={isLoading}
              >
                <Icon className="h-4 w-4 mr-2" />
                {isLoading ? "Processing..." : confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
