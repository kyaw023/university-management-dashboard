import { Button, User } from "@nextui-org/react";
import { LogOut } from "lucide-react";

const HeaderComponent = () => {
  const teacherName = "Dr. Jane Smith";
  const department = "Computer Science";
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Teacher Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <User
            name={teacherName}
            description={department}
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
            }}
          />
          <Button isIconOnly color="danger" aria-label="Logout" variant="light">
            <LogOut />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
