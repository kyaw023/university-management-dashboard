import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Input,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Search, Download, Mail } from "lucide-react";
import { BreadcrumbsComponent } from "../components";

const StudentRosterPage: React.FC = () => {
  const courses = [
    { value: "CS101", label: "Introduction to Programming" },
    { value: "CS201", label: "Data Structures" },
    { value: "CS301", label: "Machine Learning" },
  ];

  const students = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@university.edu",
      status: "Active",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@university.edu",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@university.edu",
      status: "Active",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <BreadcrumbsComponent
        links={[{ name: "Student Roster", path: "/student-roster" }]}
      />
      <h1 className="text-2xl font-bold mb-6">Student Roster</h1>
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Filter Students</h2>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col md:flex-row gap-4">
          <Select
            label="Select Course"
            placeholder="Choose a course"
            variant="bordered"
            className="flex-grow"
          >
            {courses.map((course) => (
              <SelectItem key={course.value} value={course.value}>
                {course.label}
              </SelectItem>
            ))}
          </Select>
          <Input
            placeholder="Search students..."
            variant="bordered"
            startContent={<Search className="text-default-400" size={16} />}
            className="flex-grow"
          />
          <Button color="primary">
            <Search size={16} className="mr-2" />
            Search
          </Button>
        </CardBody>
      </Card>
      <Card>
        <CardHeader className="flex justify-between">
          <h2 className="text-lg font-semibold">Student List</h2>
          <Button color="primary" startContent={<Download size={16} />}>
            Export Roster
          </Button>
        </CardHeader>
        <Divider />
        <CardBody>
          <Table aria-label="Student roster">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <User
                      name={student.name}
                      avatarProps={{
                        src: `https://i.pravatar.cc/150?u=${student.id}`,
                      }}
                    />
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <Chip
                      color={student.status === "Active" ? "success" : "danger"}
                      variant="flat"
                    >
                      {student.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      color="primary"
                      startContent={<Mail size={16} />}
                    >
                      Contact
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default StudentRosterPage;
