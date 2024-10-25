import * as Yup from "yup";

export const classValidation = Yup.object({
  name: Yup.string().required("Required"),
  teacher: Yup.array()
    .of(Yup.string().required("Required"))
    .min(1, "At least one teacher is required"),
  students: Yup.array().of(Yup.string()),
  subjects: Yup.array()
    .of(Yup.string().required("Required"))
    .min(1, "At least one subject is required"),
  start_date: Yup.date().required("Required"),
  end_date: Yup.date()
    .required("Required")
    .min(Yup.ref("start_date"), "End date must be after start date"),
  classroom: Yup.string().required("Required"),
  max_students: Yup.number()
    .required("Required")
    .positive("Must be positive")
    .integer("Must be an integer"),
  status: Yup.string().oneOf(["active", "completed"]).required("Required"),
  schedule: Yup.array()
    .of(
      Yup.object({
        day: Yup.string().required("Required"),
        startTime: Yup.string().required("Required"),
        endTime: Yup.string().required("Required"),
      })
    )
    .min(1, "At least one schedule entry is required"),
});
