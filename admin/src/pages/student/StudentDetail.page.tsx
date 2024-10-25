import React from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  Card,
  CardBody,
  Chip,
  Divider,
  Spinner,
  Progress,
  Avatar,
} from "@nextui-org/react";
import { BreadcrumbsComponent } from "@/components";
import { useGetSingleStudentQuery } from "@/store/endpoints/studentEndpoints";
import {
  IconMail,
  IconPhone,
  IconCalendar,
  IconMapPin,
  IconSchool,
  IconUsers,
  IconHeartbeat,
  IconAlertCircle,
  IconBook,
  IconTrophy,
  IconMoodSmile,
  IconMan,
  IconWoman,
} from "@tabler/icons-react";
import DataFetchErrorPage from "../DataFetchError.page";

const StudentDetailPage: React.FC = () => {
  const { studentID } = useParams<{ studentID: string }>();
  const { data, isLoading, isError, error } = useGetSingleStudentQuery(
    studentID as string
  );

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM dd, yyyy");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (isError || !data) {
    return <DataFetchErrorPage error={error} isNotFound />;
  }

  const studentInfo = [
    {
      icon: <IconMail className="text-primary" />,
      label: "Email",
      value: data.email,
    },
    {
      icon: <IconPhone className="text-primary" />,
      label: "Phone",
      value: data.phone,
    },
    {
      icon: <IconCalendar className="text-primary" />,
      label: "Date of Birth",
      value: data.date_of_birth && formatDate(data.date_of_birth),
    },
    {
      icon: <IconMapPin className="text-primary" />,
      label: "Address",
      value: data.address,
    },
    {
      icon: <IconSchool className="text-primary" />,
      label: "Class",
      value: data.class && data.class.name,
    },
    {
      icon: <IconUsers className="text-primary" />,
      label: "Parents",
      value: `${data.father_name} & ${data.mother_name}`,
    },
    {
      icon: <IconUsers className="text-primary" />,
      label: "Grade",
      value: data.grade,
    },
    {
      icon: <IconCalendar className="text-primary" />,
      label: "Enrollment Date",
      value: data.enrollment_date && formatDate(data.enrollment_date),
    },
    {
      icon: <IconHeartbeat className="text-primary" />,
      label: "Medical Conditions",
      value: data.medical_conditions || "None",
    },
    {
      icon: <IconAlertCircle className="text-primary" />,
      label: "Emergency Contact",
      value: data.emergency_contact.phone,
    },
  ];

  const achievements = [
    {
      icon: <IconTrophy className="text-yellow-500" />,
      label: "Honor Roll",
      value: "3 Semesters",
    },
    {
      icon: <IconBook className="text-blue-500" />,
      label: "Reading Challenge",
      value: "Completed",
    },
    {
      icon: <IconMoodSmile className="text-green-500" />,
      label: "Perfect Attendance",
      value: "2 Months",
    },
  ];

  return (
    <div className="container mx-auto px-4   min-h-screen">
      <BreadcrumbsComponent
        links={[
          { name: "Students", path: "/students" },
          { name: "Student Detail", path: `/students/${studentID}` },
        ]}
      />
      <Card className="shadow-2xl">
        <CardBody className="p-0">
          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <Avatar
                icon={
                  data.gender === "male" ? (
                    <IconMan size={32} />
                  ) : (
                    <IconWoman size={32} />
                  )
                }
                className="w-32 h-32 text-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white"
              />
            </div>
          </div>
          <div className="mt-20 px-8 pb-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">{data?.name}</h1>
              <Chip
                color={data.status === "active" ? "success" : "warning"}
                variant="flat"
                size="sm"
              >
                {data.status}
              </Chip>
            </div>
            <Divider className="my-6" />
            <div className="grid md:grid-cols-2 gap-8">
              {studentInfo.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 bg-default-100 p-4 rounded-lg transition-all hover:shadow-md"
                >
                  <div className="p-2 bg-primary/10 rounded-full">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm text-default-500">{item.label}</p>
                    <p className="font-semibold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <Divider className="my-6" />
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Academic Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Overall Grade</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <Progress color="primary" value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Attendance</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <Progress color="success" value={92} className="h-2" />
                </div>
              </div>
            </div>
            <Divider className="my-6" />
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <Card
                    key={index}
                    className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900 dark:to-secondary-900"
                  >
                    <CardBody className="flex items-center p-4">
                      <div className="mr-4">{achievement.icon}</div>
                      <div>
                        <p className="font-semibold">{achievement.label}</p>
                        <p className="text-sm text-default-500">
                          {achievement.value}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default StudentDetailPage;
