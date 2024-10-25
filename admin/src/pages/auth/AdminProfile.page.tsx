import { BreadcrumbsComponent } from "@/components";
import { useMeQuery } from "@/store/endpoints/authEndpoints";
import { UserType } from "@/types/types";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  EditIcon,
  UserIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, Avatar, Button, Chip } from "@nextui-org/react";

export default function AdminProfilePage() {
  const { data } = useMeQuery();
  const adminData = data || ({} as UserType);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/profile/edit", { state: adminData });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gradient-to-br from-background to-background/80">
      <div className="">
        <BreadcrumbsComponent
          links={[{ name: "Admin Profile", path: "/profile" }]}
        />
        <Card className="mt-6 max-w-5xl mx-auto">
          <CardBody className="p-0">
            <div className="relative h-48 bg-gradient-to-r from-primary to-primary-600">
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/50 to-transparent">
                <h1 className="text-3xl font-bold text-white">
                  {adminData.name}
                </h1>
                <Chip color="primary" variant="flat" className="mt-2">
                  {adminData.role || "Admin"}
                </Chip>
              </div>
            </div>
            <div className="p-6 pt-16 relative">
              <Avatar
                src={adminData.image}
                alt={adminData.name}
                className="absolute -top-16 left-6 w-32 h-32 text-large border-4 border-background"
              />
              <div className="flex justify-end">
                <Button
                  color="primary"
                  endContent={<EditIcon className="w-4 h-4" />}
                  onClick={handleNavigate}
                >
                  Edit Profile
                </Button>
              </div>
              <p className="mt-4 text-foreground-600">
                {adminData.bio || "No bio available"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="flex items-center space-x-3">
                  <MailIcon className="w-5 h-5 text-primary" />
                  <span>{adminData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-5 h-5 text-primary" />
                  <span>{adminData.phone || "No phone number available"}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="w-5 h-5 text-primary" />
                  <span>{adminData.address || "No address available"}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <span>Born: {formatDate(adminData.date_of_birth)}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-5 h-5 text-primary" />
                  <span>Gender: {adminData.gender || "Not specified"}</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
