import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Progress,
} from "@nextui-org/react";
import { AlertTriangle, Trash2, XCircle } from "lucide-react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  isLoading: boolean;
  studentName: string;
}

export default function DeleteAccountModal({
  isOpen,
  onOpenChange,
  onDelete,
  isLoading,
  studentName,
}: DeleteAccountModalProps) {
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [shake, setShake] = useState(false);
  const isDeleteEnabled = deleteConfirmation === "DELETE";

  useEffect(() => {
    if (!isDeleteEnabled && deleteConfirmation.length === 6) {
      setShake(true);
      setTimeout(() => setShake(false), 650);
    }
  }, [deleteConfirmation, isDeleteEnabled]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        {(onClose) => (
          <div className="bg-gradient-to-br  p-1 rounded-lg">
            <div className="bg-white dark:bg-gray-900 rounded-lg">
              <ModalHeader className="flex flex-col gap-1 text-black dark:text-white">
                <div className="flex items-center gap-2">
                  <div className="bg-red-500 p-2 rounded-full">
                    <Trash2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold">
                    Delete Student Account
                  </span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex items-start gap-2 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    You are about to delete the account for{" "}
                    <strong className="font-semibold">{studentName}</strong>.
                    This action is irreversible. All associated data will be
                    permanently deleted.
                  </p>
                </div>
                <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                  To confirm, type{" "}
                  <span className="font-mono font-bold text-red-500 dark:text-red-400">
                    DELETE
                  </span>{" "}
                  in the box below
                </p>
                <div className={`mt-2 ${shake ? "animate-shake" : ""}`}>
                  <Input
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="Type DELETE here"
                    variant="bordered"
                    color={isDeleteEnabled ? "success" : "danger"}
                    endContent={
                      isDeleteEnabled ? (
                        <XCircle
                          onClick={() => setDeleteConfirmation("")}
                          className="text-success"
                        />
                      ) : deleteConfirmation.length > 0 ? (
                        <XCircle
                          onClick={() => setDeleteConfirmation("")}
                          className="text-danger"
                        />
                      ) : null
                    }
                  />
                </div>
                <Progress
                  aria-label="Delete confirmation progress"
                  size="sm"
                  value={deleteConfirmation.length * 16.67}
                  className="mt-2"
                  classNames={{
                    base: "max-w-md",
                    track: "drop-shadow-md border border-default",
                    indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  variant={isDeleteEnabled ? "shadow" : "flat"}
                  onPress={onDelete}
                  isDisabled={!isDeleteEnabled}
                  isLoading={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete Account"}
                </Button>
              </ModalFooter>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
