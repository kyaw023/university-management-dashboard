import { useGetSingleClassQuery } from "@/store/endpoints/classEndpoints";
import { BreadcrumbsComponent, LoadingComponent } from "@/components";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Progress,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Calendar, Users, MapPin, Book, User } from "lucide-react";
import { useParams } from "react-router-dom";
import DataFetchErrorPage from "../DataFetchError.page";

export default function ClassDetailPage() {
  const { classID } = useParams();
  const {
    data: course,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetSingleClassQuery(classID || "", {
    skip: !classID,
  });

  console.log(course);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "secondary";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const weeklySchedule = [
    { day: "Monday", time: "09:00 AM - 11:00 AM", subject: "Mathematics" },
    { day: "Tuesday", time: "10:00 AM - 12:00 PM", subject: "Physics" },
    { day: "Wednesday", time: "02:00 PM - 04:00 PM", subject: "Chemistry" },
    { day: "Thursday", time: "11:00 AM - 01:00 PM", subject: "Biology" },
    { day: "Friday", time: "03:00 PM - 05:00 PM", subject: "Computer Science" },
  ];

  if (isFetching) {
    return <ClassDetailSkeleton />;
  }

  if(isLoading){
    return <LoadingComponent/>
  }

  if (isError) {
    return <DataFetchErrorPage error={error} isNotFound />;
  }

  return (
    <div className="container mx-auto px-4">
      <BreadcrumbsComponent
        links={[
          { name: "Classes", path: "/classes" },
          { name: "Class Detail", path: `/classes/${classID}` },
        ]}
      />

      {course && (
        <div className="mt-8 space-y-6">
          <Card className="overflow-visible bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardBody className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{course.name}</h1>
                  <p className="text-lg opacity-90">{course.classroom}</p>
                </div>
                <Chip
                  color={getStatusColor(course.status)}
                  variant="shadow"
                  size="lg"
                >
                  {course.status.charAt(0).toUpperCase() +
                    course.status.slice(1)}
                </Chip>
              </div>
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-2">
              <CardHeader className="px-6 py-4">
                <h2 className="text-2xl font-semibold">Course Details</h2>
              </CardHeader>
              <CardBody className="px-6 py-4">
                <div className="grid grid-cols-2 gap-6">
                  <InfoItem
                    icon={<Calendar className="h-6 w-6" />}
                    label="Duration"
                    value={`${formatDate(course.start_date)} - ${formatDate(
                      course.end_date
                    )}`}
                  />
                  <InfoItem
                    icon={<Users className="h-6 w-6" />}
                    label="Capacity"
                    value={`${course.subjects.length} / ${course.max_students} students`}
                  />
                  <InfoItem
                    icon={<MapPin className="h-6 w-6" />}
                    label="Location"
                    value={course.classroom}
                  />
                  <InfoItem
                    icon={<Book className="h-6 w-6" />}
                    label="Subjects"
                    value={`${course.subjects.length} subjects`}
                  />
                </div>
                <Divider className="my-6" />
                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Course Progress</h3>
                  <Progress
                    size="md"
                    radius="sm"
                    classNames={{
                      base: "max-w-md",
                      track: "drop-shadow-md border border-default",
                      indicator: "bg-gradient-to-r from-purple-500 to-pink-500",
                      label: "tracking-wider font-medium text-default-600",
                      value: "text-foreground/60",
                    }}
                    value={33}
                    showValueLabel={true}
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="px-6 py-4">
                <h2 className="text-2xl font-semibold">Teachers</h2>
              </CardHeader>
              <CardBody className="px-6 py-4">
                <div className="flex flex-wrap gap-4">
                  {course.teacher.map((teacherId: string) => (
                    <Tooltip key={teacherId} content={`${teacherId}`}>
                      <Avatar
                        isBordered
                        color="secondary"
                        size="lg"
                        src={`https://i.pravatar.cc/150?u=${teacherId}`}
                      />
                    </Tooltip>
                  ))}
                </div>
                <Button
                  color="secondary"
                  variant="flat"
                  className="mt-6 w-full"
                  endContent={<User className="h-4 w-4" />}
                >
                  Enroll in Course
                </Button>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader className="px-6 py-4">
              <h2 className="text-2xl font-semibold">Weekly Schedule</h2>
            </CardHeader>
            <CardBody className="px-6 py-4">
              <Table aria-label="Weekly schedule">
                <TableHeader>
                  <TableColumn>DAY</TableColumn>
                  <TableColumn>TIME</TableColumn>
                  <TableColumn>SUBJECT</TableColumn>
                </TableHeader>
                <TableBody>
                  {weeklySchedule.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.day}</TableCell>
                      <TableCell>{item.time}</TableCell>
                      <TableCell>{item.subject}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center space-x-3">
      <div className="bg-default-100 p-3 rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-default-500">{label}</p>
        <p className="text-base font-medium">{value}</p>
      </div>
    </div>
  );
}

function ClassDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-64 bg-default-200 rounded animate-pulse mb-8"></div>
      <div className="mt-8 space-y-6">
        <Card className="overflow-visible bg-gradient-to-r from-purple-500 to-pink-500">
          <CardBody className="p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-8 w-64 bg-white/30 rounded animate-pulse"></div>
                <div className="h-6 w-48 bg-white/30 rounded animate-pulse"></div>
              </div>
              <div className="h-8 w-24 bg-white/30 rounded animate-pulse"></div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader className="px-6 py-4">
              <div className="h-8 w-48 bg-default-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardBody className="px-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-default-200 rounded-full animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-default-200 rounded animate-pulse"></div>
                      <div className="h-4 w-32 bg-default-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="my-6 h-1 bg-default-200 rounded animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-6 w-40 bg-default-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-default-200 rounded animate-pulse"></div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="px-6 py-4">
              <div className="h-8 w-32 bg-default-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardBody className="px-6 py-4">
              <div className="flex flex-wrap gap-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-14 w-14 bg-default-200 rounded-full animate-pulse"
                  ></div>
                ))}
              </div>
              <div className="mt-6 h-10 w-full bg-default-200 rounded animate-pulse"></div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader className="px-6 py-4">
            <div className="h-8 w-48 bg-default-200 rounded animate-pulse"></div>
          </CardHeader>
          <CardBody className="px-6 py-4">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-full bg-default-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
