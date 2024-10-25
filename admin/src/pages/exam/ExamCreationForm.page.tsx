import { Formik, Form, FieldArray, FormikHelpers, FormikErrors } from "formik";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { PlusIcon, TrashIcon } from "lucide-react";
import { BreadcrumbsComponent, FormField } from "@/components";
import { validationSchema } from "@/validations/examValidation";
import { ExamFormValues } from "@/types/exam.types";
import { useGetClasslistQuery } from "@/store/endpoints/classEndpoints";
import { useGetTeacherListsQuery } from "@/store/endpoints/teacherEndpoints";
import { useGetSubjectListsQuery } from "@/store/endpoints/subjectEndpoints";
import {
  useCreateExamMutation,
  useGetSingleExamQuery,
  useUpdateExamMutation,
} from "@/store/endpoints/examEndpoints";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ExamCreationForm(): JSX.Element {
  const { data: classes } = useGetClasslistQuery();
  const { data: teachers } = useGetTeacherListsQuery();
  const { data: subjects } = useGetSubjectListsQuery();

  const [createExam] = useCreateExamMutation();
  const [updateExam] = useUpdateExamMutation();
  const { examID } = useParams();

  const { data } = useGetSingleExamQuery(examID || "", { skip: !examID });

  const classLists = classes || [];
  const teacherLists = teachers || [];
  const subjectLists = subjects || [];

  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState<ExamFormValues>({
    name: "",
    startDate: "",
    endDate: "",
    class: "",
    subjects: [
      {
        subject: "",
        teacher: "",
        startTime: "",
        endTime: "",
        maxMarks: "",
        examDate: "",
      },
    ],
    status: "scheduled",
  });

  console.log(data);

  useEffect(() => {
    if (data) {
      setInitialValues({
        name: data.name,
        startDate: new Date(data.startDate).toISOString().split("T")[0],
        endDate: new Date(data.endDate).toISOString().split("T")[0],
        class: data.class?._id,
        subjects:
          data.subjects &&
          data.subjects.map((subject: any) => ({
            subject: subject.subject,
            teacher: subject.teacher,
            startTime: subject.startTime,
            endTime: subject.endTime,
            maxMarks: subject.maxMarks,
            examDate: new Date(subject.examDate).toISOString().split("T")[0],
          })),
        status: data.status as "scheduled" | "completed" | "cancelled",
      });
    }
  }, [data]);

  const handleSubmit = async (
    values: ExamFormValues,
    { setSubmitting }: FormikHelpers<ExamFormValues>
  ) => {
    try {
      const response = examID
        ? await updateExam({ _id: examID, ...values }).unwrap()
        : await createExam(values).unwrap();

      console.log(response);
      if (response) {
        toast.success("Exam created successfully");
        navigate("/exam-management");
      }
      setSubmitting(false);
    } catch (error) {
      console.error("Error creating exam:", error);
      toast.error("Failed to create exam. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <BreadcrumbsComponent
        links={[
          { name: "Exam Management", path: "/exam-management" },
          {
            name: `Exam ${examID ? "Updating" : "Creation"}`,
            path: `${
              examID
                ? `/exam-management/edit-exam/${examID}`
                : "/exam-management/form"
            }`,
          },
        ]}
      />
      <Card className="">
        <CardHeader>
          <h1 className="text-2xl font-bold">Create New Exam</h1>
        </CardHeader>
        <CardBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
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
            }) => {
              console.log(errors);
              return (
                <Form className="space-y-6">
                  <div>
                    <FormField
                      label="Exam Name"
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && errors.name}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Exam Start Date"
                      type="date"
                      name="startDate"
                      value={values.startDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.startDate && errors.startDate}
                    />

                    <FormField
                      label="Exam End Date"
                      type="date"
                      name="endDate"
                      value={values.endDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.endDate && errors.endDate}
                    />
                  </div>

                  <Select
                    name="class"
                    label="Class"
                    placeholder="Select classes"
                    selectedKeys={[values.class]}
                    value={values.class}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errorMessage={touched.class && errors.class}
                  >
                    {classLists.map((option) => (
                      <SelectItem key={option._id} value={option._id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </Select>

                  <FieldArray name="subjects">
                    {({ push, remove }) => (
                      <div>
                        {values.subjects.map((subject, index) => (
                          <Card key={index} className="mb-4">
                            <CardBody>
                              <div className="space-y-4">
                                <Select
                                  name={`subjects.${index}.subject` as any}
                                  label="Subject"
                                  placeholder="Select Subject"
                                  selectedKeys={[
                                    values.subjects[index].subject,
                                  ]}
                                  value={values.subjects[index].subject}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  errorMessage={
                                    touched.subjects?.[index]?.subject &&
                                    typeof errors.subjects?.[index] ===
                                      "object" &&
                                    (
                                      errors.subjects[index] as FormikErrors<{
                                        subject: string;
                                      }>
                                    ).subject
                                  }
                                >
                                  {subjectLists.map((option) => (
                                    <SelectItem
                                      key={option._id as any}
                                      value={option._id}
                                    >
                                      {option.name}
                                    </SelectItem>
                                  ))}
                                </Select>
                                <Select
                                  className=""
                                  name={`subjects.${index}.teacher` as any}
                                  label="Subject"
                                  placeholder="Select Teacher"
                                  selectedKeys={[
                                    values.subjects[index].teacher,
                                  ]}
                                  value={values.subjects[index].teacher}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  errorMessage={
                                    touched.subjects?.[index]?.teacher &&
                                    typeof errors.subjects?.[index] ===
                                      "object" &&
                                    (
                                      errors.subjects[index] as FormikErrors<{
                                        teacher: string;
                                      }>
                                    ).teacher
                                  }
                                >
                                  {teacherLists.map((option) => (
                                    <SelectItem
                                      key={option._id as any}
                                      value={option._id}
                                    >
                                      {option.name}
                                    </SelectItem>
                                  ))}
                                </Select>

                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    label="Start Time"
                                    name={`subjects.${index}.startTime`}
                                    type="time"
                                    value={subject.startTime}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.subjects?.[index]?.startTime &&
                                      typeof errors.subjects?.[index] ===
                                        "object" &&
                                      (
                                        errors.subjects[index] as FormikErrors<{
                                          startTime: string;
                                        }>
                                      ).startTime
                                    }
                                  />
                                  <FormField
                                    label="End Time"
                                    name={`subjects.${index}.endTime`}
                                    type="time"
                                    value={subject.endTime}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.subjects?.[index]?.endTime &&
                                      typeof errors.subjects?.[index] ===
                                        "object" &&
                                      (
                                        errors.subjects[index] as FormikErrors<{
                                          endTime: string;
                                        }>
                                      ).endTime
                                    }
                                  />
                                  <FormField
                                    label="Exam Date"
                                    name={`subjects.${index}.examDate`}
                                    type="date"
                                    value={subject.examDate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      touched.subjects?.[index]?.examDate &&
                                      typeof errors.subjects?.[index] ===
                                        "object" &&
                                      (
                                        errors.subjects[index] as FormikErrors<{
                                          examDate: string;
                                        }>
                                      ).examDate
                                    }
                                  />
                                </div>

                                <Input
                                  name={`subjects.${index}.maxMarks`}
                                  label="Max Marks"
                                  type="number"
                                  value={subject.maxMarks}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />

                                {index > 0 && (
                                  <Button
                                    color="danger"
                                    variant="light"
                                    onClick={() => remove(index)}
                                    startContent={
                                      <TrashIcon className="w-4 h-4" />
                                    }
                                  >
                                    Remove Subject
                                  </Button>
                                )}
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                        <Button
                          color="primary"
                          variant="flat"
                          onClick={() =>
                            push({
                              subject: "",
                              teacher: "",
                              startTime: "",
                              endTime: "",
                              maxMarks: "",
                              examDate: "",
                            })
                          }
                          startContent={<PlusIcon className="w-4 h-4" />}
                        >
                          Add Subject
                        </Button>
                      </div>
                    )}
                  </FieldArray>

                  <Select
                    name="status"
                    label="Status"
                    placeholder="Select status"
                    selectedKeys={[values.status]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.status && !!errors.status}
                    errorMessage={touched.status && errors.status}
                  >
                    <SelectItem key="scheduled" value="scheduled">
                      Scheduled
                    </SelectItem>
                    <SelectItem key="completed" value="completed">
                      Completed
                    </SelectItem>
                    <SelectItem key="cancelled" value="cancelled">
                      Cancelled
                    </SelectItem>
                  </Select>

                  <Button
                    isDisabled={isSubmitting}
                    color="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saved..." : "Save"}
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </CardBody>
      </Card>
    </div>
  );
}
