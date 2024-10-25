import React, { useEffect, useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Chip,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { classValidation } from "@/validations/classValidation";
import { useGetSubjectListsQuery } from "@/store/endpoints/subjectEndpoints";
import { useGetTeacherListsQuery } from "@/store/endpoints/teacherEndpoints";
import {
  useGetClasslistQuery,
  useGetSingleClassQuery,
  useRegisterClassMutation,
  useUpdateClassMutation,
} from "@/store/endpoints/classEndpoints";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { BreadcrumbsComponent, FormField } from "@/components";

import { StatusSelect } from "@/components/StatusSelect";
import { WeeklyScheduleField } from "@/components/WeeklyScheduleField";

export interface ClassFormValues {
  name: string;
  teacher: string[];
  subjects: string[];
  start_date: string;
  end_date: string;
  classroom: string;
  max_students: number;
  status: "active" | "completed" | "cancelled";
  weeklySchedule: {
    day: string;
    start_time: string;
    end_time: string;
    subject: string;
    teacher: string;
  }[];
}

const ClassCreationForm: React.FC = () => {
  const { data: teachers = [] } = useGetTeacherListsQuery();
  const { data: subjects = [] } = useGetSubjectListsQuery();
  const { classID } = useParams<{ classID: string }>();
  const { data: selectedClass, isLoading: isLoadingClass } =
    useGetSingleClassQuery(classID || "", { skip: !classID });

  const { refetch } = useGetClasslistQuery();
  const [updateClass] = useUpdateClassMutation();
  const [registerClass] = useRegisterClassMutation();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState<ClassFormValues>({
    name: "",
    teacher: [],
    subjects: [],
    start_date: "",
    end_date: "",
    classroom: "",
    max_students: 30,
    status: "active",
    weeklySchedule: [
      {
        day: "",
        start_time: "",
        end_time: "",
        subject: "",
        teacher: "",
      },
    ],
  });

  useEffect(() => {
    if (selectedClass) {
      setInitialValues({
        name: selectedClass.name,
        teacher: selectedClass.teacher.map((teacher: any) => teacher._id),
        subjects: selectedClass.subjects.map((subject: any) => subject._id),
        start_date: new Date(selectedClass.start_date)
          .toISOString()
          .split("T")[0],
        end_date: new Date(selectedClass.end_date).toISOString().split("T")[0],
        classroom: selectedClass.classroom,
        max_students: selectedClass.max_students,
        status: selectedClass.status,
        weeklySchedule: selectedClass.weeklySchedule,
      });
    }
  }, [selectedClass]);

  const handleSubmit = async (
    values: ClassFormValues,
    { setSubmitting }: FormikHelpers<ClassFormValues>
  ) => {
    console.log(values);
    try {
      const response = classID
        ? await updateClass({ _id: classID, ...values }).unwrap()
        : await registerClass(values).unwrap();

      console.log(response);
      if (response) {
        refetch();
        toast.success(response.message);
        navigate("/classes");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create class. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoadingClass) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BreadcrumbsComponent
        links={[
          { name: "Classes", path: "/classes" },
          {
            name: `Class ${classID ? "Updating" : "Creation"}`,
            path: classID ? `/classes/edit-class/${classID}` : "/classes/form",
          },
        ]}
      />
      <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-4xl mx-auto backdrop-filter backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex justify-between items-center p-6">
              <motion.h1
                className="text-3xl font-bold text-gray-800 dark:text-gray-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Class {classID ? "Updating" : "Creation"}
              </motion.h1>
              <Chip
                color="warning"
                variant="shadow"
                classNames={{
                  base: "bg-gradient-to-r from-yellow-400 to-orange-500 border-0",
                  content: "text-white font-semibold drop-shadow-md",
                }}
              >
                Quantum Education
              </Chip>
            </CardHeader>
            <Divider className="bg-gray-200 dark:bg-gray-700" />
            <CardBody className="p-6">
              <Formik
                initialValues={initialValues}
                validationSchema={classValidation}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  isSubmitting,
                  setFieldValue,
                }) => (
                  <Form className="space-y-6">
                    <FormField
                      label="Quantum Class Designation"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && errors.name}
                    />
                    <motion.div
                      className="flex gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <FormField
                        label="Temporal Start"
                        name="start_date"
                        value={values.start_date}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.start_date && errors.start_date}
                        type="date"
                      />
                      <FormField
                        label="Temporal End"
                        name="end_date"
                        value={values.end_date}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.end_date && errors.end_date}
                        type="date"
                      />
                    </motion.div>
                    <Select
                      name="subjects"
                      label="Subjects"
                      selectedKeys={
                        new Set(values.subjects.map((id) => id.toString()))
                      }
                      placeholder="Select classes"
                      value={values.subjects}
                      selectionMode="multiple"
                      onSelectionChange={(selectedKeys) => {
                        const selectedArray = Array.from(selectedKeys); // Convert selectedKeys to an array

                        setFieldValue("subjects", selectedArray); // Set the selected array in Formik
                      }}
                      onBlur={handleBlur}
                      errorMessage={touched.subjects && errors.subjects}
                    >
                      {subjects.map((option) => (
                        <SelectItem key={option._id as any} value={option._id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      name="teacher"
                      label="Teacher"
                      selectedKeys={
                        new Set(values.teacher.map((id) => id.toString()))
                      }
                      placeholder="Select classes"
                      value={values.teacher}
                      selectionMode="multiple"
                      onSelectionChange={(selectedKeys) => {
                        const selectedArray = Array.from(selectedKeys); // Convert selectedKeys to an array

                        setFieldValue("teacher", selectedArray); // Set the selected array in Formik
                      }}
                      onBlur={handleBlur}
                      errorMessage={touched.subjects && errors.subjects}
                    >
                      {teachers.map((option) => (
                        <SelectItem key={option._id as any} value={option._id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <FormField
                      label="Quantum Learning Chamber"
                      name="classroom"
                      value={values.classroom}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.classroom && errors.classroom}
                    />

                    <FormField
                      label="Maximum Quantum Capacity"
                      name="max_students"
                      value={values.max_students}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.max_students && errors.max_students}
                      type="number"
                    />
                    <StatusSelect
                      value={values.status}
                      onChange={(value) => setFieldValue("status", value)}
                    />
                    <WeeklyScheduleField
                      teachers={teachers as { _id: string; name: string }[]}
                      values={values.weeklySchedule}
                      subjects={subjects as { _id: string; name: string }[]}
                      setFieldValue={setFieldValue}
                      errors={errors}
                      onBlur={handleBlur}
                      touched={touched}
                    />
                    <motion.div
                      className="flex justify-end"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 }}
                    >
                      <Button
                        color="primary"
                        type="submit"
                        isLoading={isSubmitting}
                        endContent={<Sparkles className="w-4 h-4" />}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300"
                      >
                        {isSubmitting
                          ? "Quantum Processing..."
                          : `${classID ? "Update" : "Create"} Quantum Class`}
                      </Button>
                    </motion.div>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ClassCreationForm;
