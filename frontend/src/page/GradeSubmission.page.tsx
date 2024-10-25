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
  Input,
  Button,
  Select,
  SelectItem,
  Tooltip,
} from "@nextui-org/react";
import { Save, Download, Upload, Info } from "lucide-react";
import { BreadcrumbsComponent } from "../components";

const GradeSubmissionPage: React.FC = () => {
  const courses = [
    { value: "CS101", label: "Introduction to Programming" },
    { value: "CS201", label: "Data Structures" },
    { value: "CS301", label: "Machine Learning" },
  ];

  const assignments = [
    { value: "A1", label: "Assignment 1" },
    { value: "A2", label: "Assignment 2" },
    { value: "M1", label: "Midterm Exam" },
  ];

  const students = [
    { id: 1, name: "Alice Johnson", studentId: "1001" },
    { id: 2, name: "Bob Smith", studentId: "1002" },
    { id: 3, name: "Charlie Brown", studentId: "1003" },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <BreadcrumbsComponent
        links={[{ name: "Grade Submission", path: "/grade-submission" }]}
      />
      <h1 className="text-2xl font-bold mb-6">Grade Submission</h1>
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">
            Select Course and Assignment
          </h2>
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
          <Select
            label="Select Assignment"
            placeholder="Choose an assignment"
            variant="bordered"
            className="flex-grow"
          >
            {assignments.map((assignment) => (
              <SelectItem key={assignment.value} value={assignment.value}>
                {assignment.label}
              </SelectItem>
            ))}
          </Select>
          <Button color="primary" startContent={<Upload size={16} />}>
            Import Grades
          </Button>
        </CardBody>
      </Card>
      <Card>
        <CardHeader className="flex justify-between">
          <h2 className="text-lg font-semibold">Enter Grades</h2>
          <div className="flex gap-2">
            <Button color="primary" startContent={<Save size={16} />}>
              Save Grades
            </Button>
            <Button color="secondary" startContent={<Download size={16} />}>
              Export Grades
            </Button>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <Table aria-label="Grade submission table">
            <TableHeader>
              <TableColumn>STUDENT NAME</TableColumn>
              <TableColumn>STUDENT ID</TableColumn>
              <TableColumn>GRADE</TableColumn>
              <TableColumn>COMMENTS</TableColumn>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="Enter grade"
                      variant="bordered"
                      min={0}
                      max={100}
                      endContent={
                        <Tooltip content="Enter a grade between 0 and 100">
                          <Info size={16} className="text-default-400" />
                        </Tooltip>
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Add comments" variant="bordered" />
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

export default GradeSubmissionPage;
