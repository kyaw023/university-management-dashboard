import * as Yup from "yup";

export const validationSchema = Yup.object({
  name: Yup.string().required("Exam name is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date must be after start date")
    .required("End date is required"),
  class: Yup.string().required("Class is required"),
  subjects: Yup.array()
    .of(
      Yup.object().shape({
        subject: Yup.string().required("Subject is required"),
        teacher: Yup.string().required("Teacher is required"),
        startTime: Yup.string()
          .required("Start time is required")
          .matches(
            /^([0-1]\d|2[0-3]):([0-5]\d)$/,
            "Invalid time format (HH:MM)"
          ),

        endTime: Yup.string()
          .required("End time is required")
          .matches(
            /^([0-1]\d|2[0-3]):([0-5]\d)$/,
            "Invalid time format (HH:MM)"
          )
          .test(
            "is-after",
            "End time must be after start time",
            function (value) {
              const { startTime } = this.parent;
              return startTime && value && startTime < value;
            }
          ),
        maxMarks: Yup.number()
          .positive("Max marks must be positive")
          .required("Max marks is required"),
        examDate: Yup.date().required("Exam date is required"),
      })
    )
    .min(1, "At least one subject is required"),
  status: Yup.string()
    .oneOf(["scheduled", "completed", "cancelled"])
    .required("Status is required"),
});
