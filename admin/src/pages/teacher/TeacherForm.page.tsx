import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Chip,
  Avatar,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { User } from "lucide-react";
import {
  BreadcrumbsComponent,
  EmploymentDetailsComponent,
  PersonalInformationComponent,
  ScheduleDetailsComponent,
} from "@/components";
import { teacherValidation } from "@/validations/teacherValidation";
import { useGetClasslistQuery } from "@/store/endpoints/classEndpoints";
import { useGetSubjectListsQuery } from "@/store/endpoints/subjectEndpoints";
import {
  useGetSingleTeacherQuery,
  useRegisterTeacherMutation,
  useUpdateTeacherMutation,
} from "@/store/endpoints/teacherEndpoints";

import { toast } from "sonner";
import { uploadImage } from "@/helper/imageUploader";
import { useNavigate, useParams } from "react-router-dom";
import { TeacherType } from "@/types/teachers.type";

// Define the shape of our form values
const TeacherForm: React.FC = () => {
  const { data: classes } = useGetClasslistQuery();
  const { data: subjects } = useGetSubjectListsQuery();
  const [registerTeacher] = useRegisterTeacherMutation();
  const [updateTeacher] = useUpdateTeacherMutation();

  const { teacherID } = useParams();

  const { data: singleTeacher } = useGetSingleTeacherQuery(teacherID || "", {
    skip: !teacherID,
  });

  const classLists = classes || [];
  const subjectLists = subjects || [];

  const [initialValues, setInitialValues] = useState<TeacherType>({
    name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "male",
    qualifications: [],
    subjects: [],
    image: "",
    employment_status: "active",
    password: "",
    address: "",
    hire_date: "",
    salary: 0,
    classes: [],
    schedule: [
      {
        day: "",
        start_time: "",
        end_time: "",
        class: "",
        subject: "",
      },
    ],
  });

  useEffect(() => {
    if (singleTeacher) {
      setInitialValues({
        name: singleTeacher.name,
        email: singleTeacher.email,
        phone: singleTeacher.phone,
        date_of_birth: singleTeacher.date_of_birth,
        gender: singleTeacher.gender,
        qualifications: singleTeacher.qualifications,
        subjects: singleTeacher.subjects.map((s: any) => s._id),
        image: singleTeacher.image,
        employment_status: singleTeacher.employment_status,
        password: singleTeacher.password,
        address: singleTeacher.address,
        hire_date: singleTeacher.hire_date,
        salary: singleTeacher.salary,
        classes: singleTeacher.classes.map((c: any) => c._id),
        schedule: singleTeacher.schedule,
      });
      if (singleTeacher.image) {
        if (typeof singleTeacher.image === "string") {
          setPreviewImg(singleTeacher.image); // Image is a URL (string)
        } else if (singleTeacher.image instanceof File) {
          setPreviewImg(URL.createObjectURL(singleTeacher.image)); // Create URL for the File
        }
      }
    }
  }, [teacherID, singleTeacher]);

  console.log(initialValues);

  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (values: TeacherType) => {
    try {
      let response;

      if (values.image && values.image instanceof File) {
        const downloadURL = await uploadImage(values.image, setProgress);
        if (!downloadURL) {
          toast.error("Failed to upload image. Please try again.");
          return; // Exit if image upload fails
        }

        // Register the teacher with the download URL
        response = !teacherID
          ? await registerTeacher({
              ...values,
              image: downloadURL,
            })
          : await updateTeacher({
              _id: teacherID,
              ...values,
              image: downloadURL,
            });
      } else if (typeof values.image === "string") {
        // If the image is already a string (URL)
        response = !teacherID
          ? await registerTeacher(values)
          : await updateTeacher({ _id: teacherID, ...values });
        if (!response) {
          toast.error("Failed to register teacher. Please try again.");
          return; // Exit early if registration fails
        } else {
          toast.success("Teacher registered successfully.");
          navigate("/teachers");
        }
      } else {
        console.error("Invalid image type.");
        return; // Exit early if image type is invalid
      }

      // Handle successful registration or update
      if (response) {
        toast.success(
          response?.data?.message || "Teacher registered successfully."
        );
        navigate("/teachers");
      }
    } catch (error) {
      console.error("Error during teacher registration:", error);
      toast.error("Failed to register teacher. Please try again."); // Notify the user
    }
  };

  return (
    <>
      <BreadcrumbsComponent
        links={[
          { name: "Teachers", path: "/teachers" },
          {
            name: `Teacher ${teacherID ? "Updating" : "Creation"}`,
            path: `${
              teacherID
                ? `/teachers/edit-teacher/${teacherID}`
                : "/teachers/form"
            }`,
          },
        ]}
      />
      <Card className="max-w-3xl mx-auto my-8">
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar
              icon={<User size={24} />}
              classNames={{
                base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                icon: "text-white/90",
              }}
            />
            <h1 className="text-2xl font-bold">Add New Teacher</h1>
          </div>
          <Chip color="warning" variant="flat">
            Draft
          </Chip>
        </CardHeader>
        <Divider />
        <CardBody>
          <Formik
            initialValues={initialValues}
            validationSchema={teacherValidation}
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
            }) => {
              console.log(errors);
              return (
                <Form className="space-y-6">
                  <Tabs
                    aria-label="Teacher Information Tabs"
                    color="primary"
                    variant="underlined"
                  >
                    <Tab key="personal" title="Personal Information">
                      <PersonalInformationComponent
                        values={values}
                        errors={errors}
                        touched={touched}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                        previewImg={previewImg}
                        setPreviewImg={setPreviewImg}
                        setProgress={setProgress}
                        progress={progress}
                        file={file}
                        setFile={setFile}
                        uploadImage={uploadImage}
                      />
                    </Tab>
                    <Tab key="employment" title="Employment Details">
                      <EmploymentDetailsComponent
                        values={values}
                        errors={errors}
                        touched={touched}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        classLists={classLists}
                        setFieldValue={setFieldValue}
                      />
                    </Tab>
                    <Tab key="schedule" title="Schedule">
                      <ScheduleDetailsComponent
                        handleChange={handleChange}
                        values={values}
                        errors={errors}
                        touched={touched}
                        handleBlur={handleBlur}
                        classLists={classLists}
                        subjectLists={subjectLists}
                        setFieldValue={setFieldValue}
                      />
                    </Tab>
                  </Tabs>

                  <Divider className="my-6" />

                  <div className="flex justify-end gap-4">
                    <Button color="danger" variant="flat" type="reset">
                      Reset
                    </Button>
                    <Button
                      color="primary"
                      type="submit"
                      isLoading={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Teacher"}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </CardBody>
      </Card>
    </>
  );
};

export default TeacherForm;
