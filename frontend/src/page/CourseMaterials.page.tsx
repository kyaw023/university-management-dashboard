import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FileText, Upload, Trash2 } from "lucide-react";
import { BreadcrumbsComponent } from "../components";

const CourseMaterialsPage: React.FC = () => {
  const courses = [
    { value: "CS101", label: "Introduction to Programming" },
    { value: "CS201", label: "Data Structures" },
    { value: "CS301", label: "Machine Learning" },
  ];

  const materials = [
    { id: 1, name: "Lecture 1 Slides", type: "PDF", date: "2023-06-01" },
    { id: 2, name: "Week 1 Reading", type: "DOC", date: "2023-06-02" },
    { id: 3, name: "Project Guidelines", type: "PDF", date: "2023-06-03" },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <BreadcrumbsComponent
        links={[{ name: "Course Materials", path: "/course-materials" }]}
      />
      <h1 className="text-2xl font-bold mb-6">Course Materials</h1>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Upload New Material</h2>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-4">
          <Select
            label="Select Course"
            placeholder="Choose a course"
            variant="bordered"
          >
            {courses.map((course) => (
              <SelectItem key={course.value} value={course.value}>
                {course.label}
              </SelectItem>
            ))}
          </Select>
          <Input
            label="Material Name"
            placeholder="Enter material name"
            variant="bordered"
          />
          <Input
            label="Upload File"
            placeholder="Select file to upload"
            variant="bordered"
            type="file"
            startContent={<Upload className="text-default-400" size={16} />}
          />
          <Button color="primary">
            <FileText className="mr-2" size={16} />
            Upload Material
          </Button>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Existing Materials</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <Table aria-label="Course materials">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>TYPE</TableColumn>
              <TableColumn>DATE UPLOADED</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {materials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell>{material.name}</TableCell>
                  <TableCell>{material.type}</TableCell>
                  <TableCell>{material.date}</TableCell>
                  <TableCell>
                    <Button size="sm" color="primary" className="mr-2">
                      <FileText size={16} />
                    </Button>
                    <Button size="sm" color="danger">
                      <Trash2 size={16} />
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

export default CourseMaterialsPage;
