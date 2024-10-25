import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Button,
  Switch,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { User, Mail, Lock, Bell, Moon, Sun } from "lucide-react";
import { BreadcrumbsComponent } from "../components";

const SettingsPage: React.FC = () => {
  const timezones = [
    { value: "UTC-8", label: "Pacific Time (PT)" },
    { value: "UTC-5", label: "Eastern Time (ET)" },
    { value: "UTC+0", label: "Coordinated Universal Time (UTC)" },
    { value: "UTC+1", label: "Central European Time (CET)" },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <BreadcrumbsComponent links={[{ name: "Settings", path: "/settings" }]} />
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Profile Settings</h2>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              variant="bordered"
              startContent={<User className="text-default-400" size={16} />}
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              variant="bordered"
              startContent={<Mail className="text-default-400" size={16} />}
            />
            <Input
              label="Change Password"
              placeholder="Enter new password"
              type="password"
              variant="bordered"
              startContent={<Lock className="text-default-400" size={16} />}
            />
            <Button color="primary">Update Profile</Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Notification Settings</h2>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Email Notifications</span>
              <Switch defaultSelected aria-label="Email notifications toggle" />
            </div>
            <div className="flex justify-between items-center">
              <span>Push Notifications</span>
              <Switch defaultSelected aria-label="Push notifications toggle" />
            </div>
            <div className="flex justify-between items-center">
              <span>SMS Notifications</span>
              <Switch aria-label="SMS notifications toggle" />
            </div>
            <Select
              label="Notification Frequency"
              placeholder="Select frequency"
              variant="bordered"
              startContent={<Bell className="text-default-400" size={16} />}
            >
              <SelectItem key="immediate" value="immediate">
                Immediate
              </SelectItem>
              <SelectItem key="daily" value="daily">
                Daily Digest
              </SelectItem>
              <SelectItem key="weekly" value="weekly">
                Weekly Summary
              </SelectItem>
            </Select>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Appearance Settings</h2>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Dark Mode</span>
              <Switch
                defaultSelected
                size="lg"
                color="secondary"
                startContent={<Sun />}
                endContent={<Moon />}
                aria-label="Dark mode toggle"
              />
            </div>
            <Select
              label="Language"
              placeholder="Select language"
              variant="bordered"
            >
              <SelectItem key="en" value="en">
                English
              </SelectItem>
              <SelectItem key="es" value="es">
                Español
              </SelectItem>
              <SelectItem key="fr" value="fr">
                Français
              </SelectItem>
            </Select>
            <Select
              label="Timezone"
              placeholder="Select timezone"
              variant="bordered"
            >
              {timezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </Select>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Account Settings</h2>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <Button color="danger" variant="flat">
              Deactivate Account
            </Button>
            <Button color="danger">Delete Account</Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
