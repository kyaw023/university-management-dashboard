import { BreadcrumbsComponent, StudentFormFieldComponent } from "@/components";
import ImageUploader from "@/components/ImageUploader";
import { uploadImage } from "@/helper/imageUploader";
import { useGetClasslistQuery } from "@/store/endpoints/classEndpoints";
import {
  useGetSingleStudentQuery,
  useRegisterStudentMutation,
  useUpdateStudentMutation,
} from "@/store/endpoints/studentEndpoints";
import { Student } from "@/types/students.types";
import { studentValidation } from "@/validations/studentValidation";

import { Button, Divider } from "@nextui-org/react";

import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const StudentFormPage = () => {
  // Fetch classes and single student data from API
  const { data: classesData } = useGetClasslistQuery();
  const { studentID } = useParams<{ studentID: string }>();
  const { data: singleStudent } = useGetSingleStudentQuery(studentID as string);
  const [registerStudent] = useRegisterStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();

  // States for handling image preview, upload progress, and file selection
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);

  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState<Student>({
    name: "",
    email: "",
    password: "",
    date_of_birth: "",
    roll_no: 0,
    gender: "male",
    address: "",
    phone: "",
    image: "",
    father_name: "",
    mother_name: "",
    class: "",
    status: "active",
    enrollment_date: "",
    grade: "",
    attendance: 0,
    emergency_contact: {
      name: "",
      phone: "",
    },
    medical_conditions: "",
    notes: "",
  });

  useEffect(() => {
    if (studentID && singleStudent) {
      setInitialValues({
        name: singleStudent.name || "",
        email: singleStudent.email || "",
        password: singleStudent.password || "",
        date_of_birth:
          new Date(singleStudent.date_of_birth).toISOString().split("T")[0] ||
          "",
        roll_no: singleStudent.roll_no || 0,
        gender: singleStudent.gender || "male", // Default value if missing
        address: singleStudent.address || "",
        phone: singleStudent.phone || "",
        image: singleStudent.image || "",
        father_name: singleStudent.father_name || "",
        mother_name: singleStudent.mother_name || "",
        class: singleStudent.class ? singleStudent.class._id : "", // Safe access
        status: singleStudent.status || "active", // Default value
        enrollment_date:
          new Date(singleStudent.enrollment_date).toISOString().split("T")[0] ||
          "",
        grade: singleStudent.grade || "",
        attendance: singleStudent.attendance || 0,
        emergency_contact: {
          name: singleStudent.emergency_contact?.name || "",
          phone: singleStudent.emergency_contact?.phone || "",
        },
        medical_conditions: singleStudent.medical_conditions || "", // Default value
        notes: singleStudent.notes || "", // Default value
      });

      console.log(singleStudent.image);

      // Check if image is a string or a File and set preview accordingly
      if (singleStudent.image) {
        if (typeof singleStudent.image === "string") {
          setPreviewImg(singleStudent.image); // Image is a URL (string)
        } else if (singleStudent.image instanceof File) {
          setPreviewImg(URL.createObjectURL(singleStudent.image)); // Create URL for the File
        }
      }
    }
  }, [singleStudent, studentID]);

  // Function to handle form submission
  const handleSubmit = async (values: Student) => {
    try {
      let response;

      // Check if the image is a File object
      if (values.image instanceof File) {
        const downloadURL = await uploadImage(values.image, setProgress);
        if (!downloadURL) {
          toast.error("Failed to upload image. Please try again.");
          return; // Exit if image upload fails
        }

        // Register the student with the download URL
        response = studentID
          ? await updateStudent({
              _id: studentID,
              ...values,
              image: downloadURL,
            })
          : await registerStudent({ ...values, image: downloadURL });
      } else if (typeof values.image === "string") {
        // If the image is already a string (URL)
        response = studentID
          ? await updateStudent({ _id: studentID, ...values })
          : await registerStudent(values);
      } else {
        console.error("Invalid image type.");
        return; // Exit early if image type is invalid
      }

      // Handle successful registration or update
      if (response) {
        toast.success(
          response?.data?.message ||
            (studentID
              ? "Student updated successfully!"
              : "Student registered successfully!")
        );
        navigate("/students");
      }
    } catch (error) {
      console.error("Error during student registration:", error);
      toast.error("Failed to register student. Please try again."); // Notify the user
    }
  };

  return (
    <div>
      <BreadcrumbsComponent
        links={[
          { name: "Students", path: "/students" },
          {
            name: `Student ${studentID ? "Updating" : "Creation"}`,
            path: `${
              studentID
                ? `/students/edit-student/${studentID}`
                : "/students/form"
            }`,
          },
        ]}
      />

      <div>
        <h1 className="text-lg my-4">
          {studentID ? "Edit" : "Add"} Student Form{" "}
        </h1>
        <Divider className="my-4" />
        <div className="">
          <h3>Student Information</h3>
        </div>
        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={studentValidation}
          enableReinitialize
        >
          {({
            values,
            handleBlur,
            handleChange,
            errors,
            touched,
            isSubmitting,
            setFieldValue,
            resetForm,
          }) => {
            return (
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-5">
                  <StudentFormFieldComponent
                    values={values}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    classes={classesData}
                  />

                  <ImageUploader
                    values={values}
                    setProgress={setProgress}
                    previewImg={previewImg}
                    setPreviewImg={setPreviewImg}
                    file={file}
                    setFile={setFile}
                    progress={progress}
                    uploadImage={uploadImage}
                    setFieldValue={setFieldValue}
                    errors={errors} // Pass the errors
                    touched={touched} // Pass the touched
                    handleBlur={handleBlur}
                  />
                </div>

                <div className="flex items-center gap-4 mt-5 ">
                  <Button
                    disabled={isSubmitting}
                    className="h-12 w-[200px] bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:text-slate-200 dark:hover:bg-primary/90"
                    type="submit"
                  >
                    {isSubmitting ? " Saving..." : "Saved"}
                  </Button>
                  <Button
                    onClick={() => resetForm()}
                    className="h-12 w-[200px] bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:text-slate-200 dark:hover:bg-primary/90"
                    type="button"
                  >
                    Reset
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default StudentFormPage;
