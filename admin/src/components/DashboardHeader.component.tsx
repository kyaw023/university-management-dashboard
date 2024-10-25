import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
} from "@nextui-org/react";
import { SearchIcon, BellIcon, MessageCircleIcon } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import UserComponent from "./User.component";
import logo from "../assets/logo.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className=""
      maxWidth="full"
    >
      <NavbarContent className="" justify="start">
        <NavbarBrand>
          <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
          <p className="font-bold text-inherit hidden lg:flex">Riverstone</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        <NavbarItem className="hidden lg:flex">
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[20rem] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Search dashboard..."
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
          />
        </NavbarItem>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <NavbarItem>
              <Button isIconOnly variant="light" aria-label="Messages">
                <Badge content="5" shape="circle" color="danger">
                  <MessageCircleIcon size={20} />
                </Badge>
              </Button>
            </NavbarItem>
          </DropdownTrigger>
          <DropdownMenu aria-label="Message actions">
            <DropdownItem key="new" description="Open chat">
              New message from Alice
            </DropdownItem>
            <DropdownItem key="copy" description="View thread">
              Continued chat with Bob
            </DropdownItem>
            <DropdownItem key="edit" description="Quick reply">
              Project update from Carol
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <NavbarItem>
              <Button isIconOnly variant="light" aria-label="Notifications">
                <Badge content="3" shape="circle" color="danger">
                  <BellIcon size={20} />
                </Badge>
              </Button>
            </NavbarItem>
          </DropdownTrigger>
          <DropdownMenu aria-label="Notification actions">
            <DropdownItem key="new_project" description="2 min ago">
              New project created
            </DropdownItem>
            <DropdownItem key="file_upload" description="10 min ago">
              File uploaded successfully
            </DropdownItem>
            <DropdownItem key="team_invite" description="1 hour ago">
              You're invited to a new team
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavbarItem>
          <ModeToggle />
        </NavbarItem>
        <NavbarItem>
          <UserComponent />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
