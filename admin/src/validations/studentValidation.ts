import * as yup from "yup";

export const studentValidation = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required").email("Email is invalid"),
  password: yup.string().required("Password is required"),
  date_of_birth: yup
    .date()
    .typeError("Date of birth is required")
    .required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
  address: yup.string().required("Address is required"),
  phone: yup.string().required("Phone is required"),
  image: yup.string(),
  father_name: yup.string(),
  mother_name: yup.string(),
  class: yup.string().required("Class is required"),
  status: yup.string().required("Status is required"),
  enrollment_date: yup.date().typeError("Enrollment date is required"),
  grade: yup.string().required("Grade is required"),
  roll_no: yup
    .number()
    .typeError("Roll no is required")
    .required("Roll no is required"),
  attendance: yup
    .number()
    .typeError("Attendance is required")
    .required("Attendance is required"),
  emergency_contact: yup
    .object()
    .shape({
      name: yup.string().required("Emergency contact name is required"),
      phone: yup.string().required("Emergency contact name is required"),
    })
    .required("Emergency contact is required"),
  medical_conditions: yup.string(),
  notes: yup.string(),
});
