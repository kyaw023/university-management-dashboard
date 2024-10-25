import {
  Card,
  CardBody,
  Input,
  Button,
  Tabs,
  Tab,
  Select,
  SelectItem,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import {
  Building2,
  Calendar,
  GraduationCap,
  Globe,
  DollarSign,
  Upload,
  Save,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function GeneralSettings() {
  const [activeTab, setActiveTab] = useState("university");

  const [universityInfo, setUniversityInfo] = useState({
    name: "Evergreen University",
    logo: "/logo.png",
    email: "info@evergreenuniversity.edu",
    phone: "+1 (555) 123-4567",
    address: "123 Campus Drive, Collegetown, ST 12345",
  });

  const [academicYear, setAcademicYear] = useState({
    startDate: "2023-09-01",
    endDate: "2024-06-30",
    terms: [
      { name: "Fall", start: "2023-09-01", end: "2023-12-20" },
      { name: "Spring", start: "2024-01-10", end: "2024-05-15" },
      { name: "Summer", start: "2024-06-01", end: "2024-08-15" },
    ],
  });

  const [gradingSystem, setGradingSystem] = useState("letter");
  const [timeZone, setTimeZone] = useState("America/New_York");
  const [language, setLanguage] = useState("en");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [currency, setCurrency] = useState("USD");

  const handleSave = () => {
    // Implement save functionality here
    console.log("Settings saved");
  };

  return (
    <div className="transition-all duration-300">
      <Tabs
        aria-label="General Settings Tabs"
        selectedKey={activeTab}
        onSelectionChange={setActiveTab as any}
        className="mb-6"
        color="secondary"
        variant="underlined"
      >
        <Tab
          key="university"
          title={
            <div className="flex items-center space-x-2">
              <Building2 size={18} />
              <span>University Info</span>
            </div>
          }
        >
          <Card className="mt-4 bg-background/60 backdrop-blur-md border border-foreground/10">
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="University Name"
                  value={universityInfo.name}
                  onChange={(e) =>
                    setUniversityInfo({
                      ...universityInfo,
                      name: e.target.value,
                    })
                  }
                  className="w-full"
                />
                <div className="flex items-center space-x-4">
                  <img
                    src={universityInfo.logo}
                    alt="University Logo"
                    className="w-16 h-16 object-contain rounded-lg border border-foreground/10"
                  />
                  <Button color="secondary" startContent={<Upload size={18} />}>
                    Upload Logo
                  </Button>
                </div>
                <Input
                  label="Email"
                  value={universityInfo.email}
                  onChange={(e) =>
                    setUniversityInfo({
                      ...universityInfo,
                      email: e.target.value,
                    })
                  }
                  className="w-full"
                />
                <Input
                  label="Phone"
                  value={universityInfo.phone}
                  onChange={(e) =>
                    setUniversityInfo({
                      ...universityInfo,
                      phone: e.target.value,
                    })
                  }
                  className="w-full"
                />
                <Textarea
                  label="Address"
                  value={universityInfo.address}
                  onChange={(e) =>
                    setUniversityInfo({
                      ...universityInfo,
                      address: e.target.value,
                    })
                  }
                  className="md:col-span-2 w-full"
                />
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="academic"
          title={
            <div className="flex items-center space-x-2">
              <Calendar size={18} />
              <span>Academic Year</span>
            </div>
          }
        >
          <Card className="mt-4 bg-background/60 backdrop-blur-md border border-foreground/10">
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Academic Year Start"
                  type="date"
                  value={academicYear.startDate}
                  onChange={(e) =>
                    setAcademicYear({
                      ...academicYear,
                      startDate: e.target.value,
                    })
                  }
                  className="w-full"
                />
                <Input
                  label="Academic Year End"
                  type="date"
                  value={academicYear.endDate}
                  onChange={(e) =>
                    setAcademicYear({
                      ...academicYear,
                      endDate: e.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Terms/Semesters</h3>
                {academicYear.terms.map((term, index) => (
                  <motion.div
                    key={index}
                    className="grid grid-cols-3 gap-4 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Input
                      label="Term Name"
                      value={term.name}
                      className="w-full"
                    />
                    <Input
                      label="Start Date"
                      type="date"
                      value={term.start}
                      className="w-full"
                    />
                    <Input
                      label="End Date"
                      type="date"
                      value={term.end}
                      className="w-full"
                    />
                  </motion.div>
                ))}
                <Button color="secondary" className="mt-4">
                  Add Term
                </Button>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="grading"
          title={
            <div className="flex items-center space-x-2">
              <GraduationCap size={18} />
              <span>Grading System</span>
            </div>
          }
        >
          <Card className="mt-4 bg-background/60 backdrop-blur-md border border-foreground/10">
            <CardBody>
              <Select
                label="Grading System"
                value={gradingSystem}
                onChange={(e) => setGradingSystem(e.target.value)}
                className="w-full max-w-md"
              >
                <SelectItem key="letter" value="letter">
                  Letter Grades (A, B, C, D, F)
                </SelectItem>
                <SelectItem key="percentage" value="percentage">
                  Percentage
                </SelectItem>
                <SelectItem key="gpa" value="gpa">
                  GPA (0.0 - 4.0)
                </SelectItem>
              </Select>
              {/* Add more grading system configuration options here */}
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="localization"
          title={
            <div className="flex items-center space-x-2">
              <Globe size={18} />
              <span>Localization</span>
            </div>
          }
        >
          <Card className="mt-4 bg-background/60 backdrop-blur-md border border-foreground/10">
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Time Zone"
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full"
                >
                  <SelectItem key="ny" value="America/New_York">
                    Eastern Time (ET)
                  </SelectItem>
                  <SelectItem key="la" value="America/Los_Angeles">
                    Pacific Time (PT)
                  </SelectItem>
                  <SelectItem key="london" value="Europe/London">
                    British Time (BST)
                  </SelectItem>
                  {/* Add more time zones as needed */}
                </Select>
                <Select
                  label="Language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full"
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
                  {/* Add more languages as needed */}
                </Select>
                <Select
                  label="Date Format"
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="w-full"
                >
                  <SelectItem key="mdy" value="MM/DD/YYYY">
                    MM/DD/YYYY
                  </SelectItem>
                  <SelectItem key="dmy" value="DD/MM/YYYY">
                    DD/MM/YYYY
                  </SelectItem>
                  <SelectItem key="ymd" value="YYYY-MM-DD">
                    YYYY-MM-DD
                  </SelectItem>
                </Select>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="currency"
          title={
            <div className="flex items-center space-x-2">
              <DollarSign size={18} />
              <span>Currency</span>
            </div>
          }
        >
          <Card className="mt-4 bg-background/60 backdrop-blur-md border border-foreground/10">
            <CardBody>
              <Select
                label="Default Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full max-w-md"
              >
                <SelectItem key="usd" value="USD">
                  US Dollar (USD)
                </SelectItem>
                <SelectItem key="eur" value="EUR">
                  Euro (EUR)
                </SelectItem>
                <SelectItem key="gbp" value="GBP">
                  British Pound (GBP)
                </SelectItem>
                {/* Add more currencies as needed */}
              </Select>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      <motion.div
        className="mt-8 flex justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button
          color="primary"
          size="lg"
          startContent={<Save size={18} />}
          onPress={handleSave}
        >
          Save Settings
        </Button>
      </motion.div>
    </div>
  );
}
