import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Subject name is required")
    .min(3, "Subject name must be at least 3 characters")
    .max(50, "Subject name must not exceed 50 characters"),

  code: Yup.string()
    .required("Subject code is required")
    .matches(
      /^[A-Z0-9]+$/,
      "Subject code must contain only uppercase letters and numbers"
    )
    .max(10, "Subject code must not exceed 10 characters"),

  description: Yup.string().max(
    500,
    "Description must not exceed 500 characters"
  ),

  image: Yup.string().url("Image must be a valid URL"),

  teacher: Yup.string().required("Teacher is required"),

  classes: Yup.array()
    .of(Yup.string().required("Class is required"))
    .min(1, "At least one class is required"),

  credits: Yup.number()
    .required("Credits are required")
    .min(1, "Credits must be at least 1")
    .max(10, "Credits must not exceed 10"),

  department: Yup.string()
    .required("Department is required")
    .max(50, "Department name must not exceed 50 characters"),

});

export default validationSchema;
