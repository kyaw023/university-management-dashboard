import React, { useEffect, useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Chip,
  Avatar,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useGetClasslistQuery } from "@/store/endpoints/classEndpoints";
import { useGetTeacherListsQuery } from "@/store/endpoints/teacherEndpoints";
import {
  useCreateSubjectMutation,
  useGetSingleSubjectQuery,
  useGetSubjectListsQuery,
  useUpdateSubjectMutation,
} from "@/store/endpoints/subjectEndpoints";

import subjectValidation from "@/validations/subjectValidation";
import BasicInformationTab from "@/components/tabs/BasicInformationTab";
import AdvancedDetailsTab from "@/components/tabs/AdvancedDetailsTab";
import AssociatedClassesTab from "@/components/tabs/AssociatedClassesTab";
import FormActions from "@/components/tabs/FormActions";
import { TeacherType } from "@/types/teachers.type";
import { SubjectType } from "@/types/subjects.types";
import { Course } from "@/types/classes.types";
import { BreadcrumbsComponent } from "@/components";

const SubjectFormPage: React.FC = () => {
  const { data: classes } = useGetClasslistQuery();
  const { data: teachers } = useGetTeacherListsQuery();
  const [createSubject] = useCreateSubjectMutation();
  const [updateSubject] = useUpdateSubjectMutation();
  const { refetch } = useGetSubjectListsQuery();

  const { subjectID } = useParams<{ subjectID: string }>();
  const { data: subject } = useGetSingleSubjectQuery(subjectID || "");

  const [initialValues, setInitialValues] = useState<SubjectType>({
    name: "",
    code: "",
    description: "",
    image: "",
    teacher: "",
    classes: [],
    credits: 0,
    department: "",
  });

  useEffect(() => {
    if (subject) {
      setInitialValues({
        name: subject.name,
        code: subject.code,
        description: subject.description,
        image: subject.image,
        teacher: subject.teacher?._id,
        classes: subject.classes.map(
          (course: { _id: string; name: string }) => course._id
        ),
        credits: subject.credits,
        department: subject.department,
      });
    }
  }, [subject, subjectID]);

  const navigate = useNavigate();

  const handleSubmit = async (
    values: SubjectType,
    { setSubmitting }: FormikHelpers<SubjectType>
  ) => {
    try {
      const response = subjectID
        ? await updateSubject({ _id: subjectID, ...values }).unwrap()
        : await createSubject(values).unwrap();

      toast.success(response.message);
      refetch();
      navigate("/subjects");
    } catch (error) {
      console.error("Error registering subject:", error);
      toast.error("Failed to register subject. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <BreadcrumbsComponent
        links={[
          { name: "Subjects", path: "/subjects" },
          {
            name: `Subjects ${subjectID ? "Updating" : "Creation"}`,
            path: `${
              subjectID
                ? `/subjects/edit-subject/${subjectID}`
                : "/subjects/form"
            }`,
          },
        ]}
      />
      <div className="min-h-screen bg-gradient-to-br from-background to-default-100 dark:from-background dark:to-default-50 p-8 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-4xl mx-auto backdrop-filter backdrop-blur-lg bg-background/60 dark:bg-default-100/20 border border-divider">
            <CardHeader className="flex justify-between items-center p-6">
              <div className="flex items-center gap-4">
                <Avatar
                  icon={<User size={24} />}
                  classNames={{
                    base: "bg-gradient-to-br from-primary to-secondary",
                    icon: "text-white/90",
                  }}
                />
                <h1 className="text-3xl font-bold text-foreground">
                  {subjectID ? "Edit Subject" : "Register New Subject"}
                </h1>
              </div>
              <Chip
                color="warning"
                variant="shadow"
                classNames={{
                  base: "bg-warning-500/30 border border-warning-500/50",
                }}
              >
                <Sparkles size={16} />
              </Chip>
            </CardHeader>
            <Divider className="bg-divider" />
            <CardBody className="p-6">
              <Formik
                initialValues={initialValues}
                validationSchema={subjectValidation}
                onSubmit={handleSubmit}
                enableReinitialize={true}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  isSubmitting,
                  setFieldValue,
                }) => {
                  console.log(errors);
                  return (
                    <Form className="space-y-6">
                      <Tabs
                        aria-label="Subject Information Tabs"
                        color="primary"
                        variant="underlined"
                        classNames={{
                          tabList:
                            "bg-default-200/50 dark:bg-default-50/50 p-1 rounded-lg",
                          cursor: "bg-primary/20 dark:bg-primary/30",
                          tab: "text-foreground-500 data-[selected=true]:text-foreground",
                        }}
                      >
                        <Tab key="basic" title="Basic Information">
                          <BasicInformationTab
                            values={values}
                            errors={errors}
                            touched={touched}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            setFieldValue={setFieldValue}
                          />
                        </Tab>
                        <Tab key="advanced" title="Advanced Details">
                          <AdvancedDetailsTab
                            values={values}
                            errors={errors}
                            touched={touched}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            setFieldValue={setFieldValue}
                            teachers={(teachers as TeacherType[]) || []}
                          />
                        </Tab>
                        <Tab key="classes" title="Associated Classes">
                          <AssociatedClassesTab
                            values={values}
                            setFieldValue={setFieldValue}
                            classes={(classes as Course[]) || []}
                          />
                        </Tab>
                      </Tabs>

                      <Divider className="my-6 bg-divider" />

                      <FormActions isSubmitting={isSubmitting} />
                    </Form>
                  );
                }}
              </Formik>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SubjectFormPage;
