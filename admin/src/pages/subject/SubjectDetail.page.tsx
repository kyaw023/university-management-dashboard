import React from "react";
import {
  User,
  Users,
  Award,
  Building,
  Clock,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { useGetSingleSubjectQuery } from "@/store/endpoints/subjectEndpoints";
import { BreadcrumbsComponent } from "@/components";
import {
  Card,
  CardBody,
  Image,
  Button,
  Progress,
  Tooltip,
  Tabs,
  Tab,
  Spinner,
} from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import SubjectDetailSkeleton from "@/components/SubjectDetailSkeleton";
import { motion } from "framer-motion";
import DataFetchErrorPage from "../DataFetchError.page";

export default function SubjectDetailPage() {
  const { subjectID } = useParams();
  const {
    data: subject,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetSingleSubjectQuery(subjectID || "");
  const navigate = useNavigate();

  if (isFetching) {
    return <SubjectDetailSkeleton />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (isError) {
    return <DataFetchErrorPage error={error} />;
  }

  if (!subject) {
    return <div>No subject found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300">
      <BreadcrumbsComponent
        links={[
          { name: "Subjects", path: "/subjects" },
          { name: "Subject Detail", path: `/subjects/${subjectID}` },
        ]}
      />

      {subject && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl">
            <CardBody className="p-0">
              <div className="grid md:grid-cols-3 gap-0">
                <div className="md:col-span-1 bg-gradient-to-br from-purple-500 to-blue-500 text-white p-6 rounded-l-xl flex flex-col justify-between">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{subject.name}</h1>
                    <p className="text-xl opacity-80">{subject.code}</p>
                  </div>
                  <Image
                    src={subject.image}
                    alt={subject.name}
                    className="object-cover rounded-lg mt-4 shadow-lg"
                    width="100%"
                    height={200}
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
                    {subject.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {subject.teacher && (
                      <InfoItem
                        icon={<User className="h-5 w-5" />}
                        label="Teacher"
                        value={subject.teacher.name || "N/A"}
                      />
                    )}
                    {subject.classes.length > 0 && (
                      <InfoItem
                        icon={<Users className="h-5 w-5" />}
                        label="Classes"
                        value={
                          subject.classes.map((item) => item.name).join(", ") ||
                          "N/A"
                        }
                      />
                    )}
                    <InfoItem
                      icon={<Award className="h-5 w-5" />}
                      label="Credits"
                      value={subject.credits.toString()}
                    />
                    <InfoItem
                      icon={<Building className="h-5 w-5" />}
                      label="Department"
                      value={subject.department || "N/A"}
                    />
                  </div>
                  <div className="mt-6">
                    <Tooltip content="Course progress">
                      <Progress
                        size="md"
                        radius="sm"
                        classNames={{
                          base: "max-w-md",
                          track: "drop-shadow-md border border-default",
                          indicator:
                            "bg-gradient-to-r from-purple-500 to-blue-500",
                          label: "tracking-wider font-medium text-default-600",
                          value: "text-foreground/60",
                        }}
                        label="Course Progress"
                        value={33}
                        showValueLabel={true}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Tabs
            aria-label="Subject details"
            className="mt-8"
            color="secondary"
            variant="underlined"
          >
            <Tab key="overview" title="Overview">
              <Card className="mt-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700">
                <CardBody>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                    Course Overview
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    This course provides a comprehensive introduction to{" "}
                    {subject.name}. Students will explore key concepts,
                    theories, and practical applications in the field. The
                    course is designed to challenge and engage students through
                    a combination of lectures, discussions, and hands-on
                    projects.
                  </p>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="syllabus" title="Syllabus">
              <Card className="mt-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700">
                <CardBody>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                    Course Syllabus
                  </h2>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                    <li>Introduction to {subject.name}</li>
                    <li>Fundamental Principles and Theories</li>
                    <li>Advanced Topics in {subject.name}</li>
                    <li>Practical Applications and Case Studies</li>
                    <li>Research Methods in {subject.name}</li>
                    <li>Final Project and Presentation</li>
                  </ul>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="resources" title="Resources">
              <Card className="mt-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700">
                <CardBody>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                    Course Resources
                  </h2>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Textbook: "Introduction to {subject.name}" by John Doe
                    </li>
                    <li className="flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Online Learning Platform: LearnSmart
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Office Hours: Mon, Wed 2-4 PM
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>

          <div className="mt-8 flex justify-between items-center">
            <div className="space-x-4">
              <Button
                onClick={() => {
                  navigate(`/subjects/edit-subject/${subjectID}`);
                }}
                color="default"
                variant="bordered"
              >
                Edit Subject
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="fixed bottom-8 right-8"
      >
        <Button
          color="success"
          size="lg"
          isIconOnly
          className="rounded-full shadow-lg"
        >
          <GraduationCap className="h-6 w-6" />
        </Button>
      </motion.div>
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
    <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg transition-colors duration-300">
      <div className="bg-white dark:bg-gray-600 p-2 rounded-full">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </p>
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {value}
        </p>
      </div>
    </div>
  );
}
