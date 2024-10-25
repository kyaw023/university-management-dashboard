import { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
  Avatar,
  Button,
} from "@nextui-org/react";
import ModalComponent from "./Modal.component";
import { useLogoutMutation } from "@/store/endpoints/authEndpoints";
import { logout } from "@/store/slice/authSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Settings,
  LogOut,
  Trash2,
  HelpCircle,
  BarChart2,
  Users,
  Cog,
  User,
} from "lucide-react";

const UserComponent = () => {
  const [logoutHandler, { isLoading }] = useLogoutMutation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [actionType, setActionType] = useState<"logout" | "delete">("logout");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAction = async () => {
    if (actionType === "logout") {
      try {
        await logoutHandler().unwrap();
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/login");
      } catch (error) {
        toast.error("Logout failed. Please try again.");
      }
    } else if (actionType === "delete") {
      // Implement delete account functionality here
      console.log("delete account");
      toast.error("Account deletion is not implemented yet.");
    }
  };

  const menuItems = [
    { key: "profile", label: "Signed in as", description: "@tonyreichert" },
    { key: "profile", label: "Profile", icon: User },
    { key: "team_settings", label: "Team Settings", icon: Users },
    { key: "analytics", label: "Analytics", icon: BarChart2 },
    { key: "system", label: "System", icon: Cog },
    { key: "help_and_feedback", label: "Help & Feedback", icon: HelpCircle },
    { key: "logout", label: "Log Out", icon: LogOut, color: "danger" },
    { key: "delete", label: "Delete Account", icon: Trash2, color: "danger" },
  ];

  return (
    <>
      <ModalComponent
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        actionType={actionType}
        handleAction={handleAction}
        isLoading={isLoading}
      />
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button
            variant="light"
            className="p-2 bg-transparent data-[hover=true]:bg-transparent"
          >
            <Avatar
              isBordered
              color="primary"
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              className="transition-transform"
              size="sm"
            />
            <span className="ml-2 font-semibold text-foreground hidden sm:inline-block">
              Tony Reichert
            </span>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="User Actions"
          variant="flat"
          items={menuItems}
        >
          {(item) => (
            <DropdownItem
              key={item.key}
              color={item.color as "danger" | "default"}
              className={item.key === "profile" ? "" : ""}
              description={item.description}
              startContent={item.icon && <item.icon className="w-4 h-4" />}
              onPress={() => {
                if (item.key === "logout" || item.key === "delete") {
                  setActionType(item.key as "logout" | "delete");
                  onOpen();
                }
              }}
            >
              {item.key === "profile" ? (
                <Link to={"/profile"} >
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default UserComponent;
