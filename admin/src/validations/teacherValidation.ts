import * as yup from "yup";

// Validation schema
export const teacherValidation = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required").email("Email is invalid"),
  phone: yup.string().required("Phone number is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  date_of_birth: yup
    .date()
    .typeError("Date of birth is required")
    .required("Date of birth is required"),
  gender: yup
    .string()
    .oneOf(
      ["male", "female", "other"],
      "Gender must be 'male', 'female', or 'other'"
    )
    .required("Gender is required"),
  address: yup.string().required("Address is required"),
  image: yup.string(), // Assuming you want to validate that the image is a URL
  qualifications: yup
    .array()
    .of(yup.string().required("Qualification is required"))
    .min(1, "At least one qualification is required"),
  subjects: yup.array().of(yup.string()), // Assuming you want to validate subject references
  classes: yup.array().of(yup.string()), // Assuming you want to validate class references
  employment_status: yup
    .string()
    .oneOf(
      ["active", "on_leave", "retired"],
      "Employment status must be 'active', 'on_leave', or 'retired'"
    )
    .required("Employment status is required"),
  hire_date: yup
    .date()
    .typeError("Hire date is required")
    .required("Hire date is required"),
  salary: yup
    .number()
    .required("Salary is required")
    .min(0, "Salary must be a positive number"),

  schedule: yup
    .array()
    .of(
      yup.object().shape({
        day: yup.string().required("Day is required"),
        start_time: yup.string().required("Time is required"),
        end_time: yup.string().required("Time is required"),
        class: yup.string().required("Class is required"),
      })
    )
    .required("Schedule is required")
    .min(1, "At least one schedule is required"),
});
