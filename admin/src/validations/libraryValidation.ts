import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  type: Yup.string().required("Type is required"),
  category: Yup.string(),
  availability_status: Yup.string().required("Availability status is required"),
  quantity: Yup.number()
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required"),
  description: Yup.string(),
  borrow_limit: Yup.number().min(1, "Borrow limit must be at least 1 day"),
  late_fee_per_day: Yup.number().min(0, "Late fee cannot be negative"),
  location: Yup.string(),
});
