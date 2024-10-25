import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  date: Yup.date().required("Date is required"),
  location: Yup.string().required("Location is required"),
  status: Yup.string()
    .oneOf(["Scheduled", "Completed", "Cancelled"])
    .required("Status is required"),
  attendees: Yup.array()
    .of(
      Yup.object().shape({
        attendeeId: Yup.string().required("Attendee is required"),
        role: Yup.string()
          .oneOf(["Teacher", "Student"])
          .required("Role is required"),
      })
    )
    .min(1, "At least one attendee is required"),
  organizer: Yup.string().required("Organizer is required"),
});
