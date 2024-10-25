import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { Book, FileText, Settings, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickLinksComponent = () => {
  const quickLinks = [
    {
      name: "Course Materials",
      icon: <FileText size={24} />,
      path: "/course-materials",
    },
    {
      name: "Student Roster",
      icon: <Users size={24} />,
      path: "/students-roster",
    },
    {
      name: "Grade Submission",
      icon: <Book size={24} />,
      path: "/grade-submission",
    },
    { name: "Settings", icon: <Settings size={24} />, path: "/settings" },
  ];

  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Quick Links</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="grid grid-cols-2 gap-4">
          {quickLinks.map((link, index) => (
            <Button
              key={index}
              onClick={() => handleNavigate(link.path)}
              startContent={link.icon}
              className="justify-start"
            >
              {link.name}
            </Button>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default QuickLinksComponent;
