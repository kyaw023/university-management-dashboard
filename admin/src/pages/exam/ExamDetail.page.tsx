import { useParams } from "react-router-dom";
import { useGetSingleExamQuery } from "@/store/endpoints/examEndpoints";
import { ExamType } from "@/types/exam.types";
import {
  Card,
  CardBody,
  
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import {
  CalendarIcon,
  BookOpenIcon,
  ClockIcon,
  UserIcon,
  AwardIcon,
} from "lucide-react";
import { BreadcrumbsComponent, LoadingComponent } from "@/components";
import DataFetchErrorPage from "../DataFetchError.page";

export default function ExamDetails() {
  const { examID } = useParams<{ examID: string }>();
  const {
    data: exam,
    isLoading,
    isError,
    error,
  } = useGetSingleExamQuery(examID as string, {
    skip: !examID,
  });

  const getStatusColor = (status: ExamType["status"]) => {
    switch (status) {
      case "scheduled":
        return "text-blue-600 dark:text-blue-400";
      case "completed":
        return "text-green-600 dark:text-green-400";
      case "cancelled":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isError || !exam) {
    return (
      <div>
        <DataFetchErrorPage error={error} isNotFound={false} />
      </div>
    );
  }

  return (
    <div>
      <BreadcrumbsComponent
        links={[
          { name: "Exams", path: "/exam-management" },
          {
            name: "Exam Details",
            path: `/exam-management/detail-exam/${examID}`,
          },
        ]}
      />
      <Card className="shadow-lg">
        <CardBody className="p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{exam.name || "N/A"}</h1>
              <div className="flex items-center space-x-2">
                <BookOpenIcon className="w-5 h-5 text-primary" />
                <span className="text-lg">
                  Class: {exam.class?.name || "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-lg font-semibold ${getStatusColor(
                    exam?.status as ExamType["status"]
                  )}`}
                >
                  Status:{" "}
                  <span className="capitalize">{exam?.status || "N/A"}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <span>
                  {exam?.startDate
                    ? new Date(exam.startDate).toLocaleDateString()
                    : "N/A"}{" "}
                  -{" "}
                  {exam?.endDate
                    ? new Date(exam.endDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Subjects</h2>
              <Table aria-label="Exam subjects table">
                <TableHeader>
                  <TableColumn>SUBJECT</TableColumn>
                  <TableColumn>TEACHER</TableColumn>
                  <TableColumn>DATE & TIME</TableColumn>
                  <TableColumn>MAX MARKS</TableColumn>
                </TableHeader>
                <TableBody>
                  {exam.subjects && exam.subjects.length > 0 ? (
                    exam.subjects.map((subject, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <BookOpenIcon className="w-4 h-4 text-primary" />
                            <span className="font-medium">
                              {subject.subject?.name || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <UserIcon className="w-4 h-4 text-primary" />
                            <span>{subject.teacher?.name || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="w-4 h-4 text-primary" />
                            <span>
                              {subject.examDate
                                ? new Date(
                                    subject.examDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                            <ClockIcon className="w-4 h-4 text-primary ml-2" />
                            <span>
                              {subject.startTime || "N/A"} -{" "}
                              {subject.endTime || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <AwardIcon className="w-4 h-4 text-primary" />
                            <span>{subject.maxMarks || "N/A"}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell>No subjects available</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
