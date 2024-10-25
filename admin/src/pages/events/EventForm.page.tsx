import { Formik, Form, FieldArray, FormikHelpers, FormikErrors } from "formik";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { PlusIcon, TrashIcon } from "lucide-react";
import { BreadcrumbsComponent, FormField } from "@/components";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { validationSchema } from "@/validations/eventValidation";
import {
  useCreateEventMutation,
  useGetSingleEventQuery,
  useUpdateEventMutation,
} from "@/store/endpoints/eventEndpoints";
import { useEffect, useState } from "react";

export type EventFormValues = {
  title: string;
  description: string;
  date: string;
  location: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  attendees: { attendeeId: string; role: "Teacher" | "Student" }[];
  organizer: string;
};

export default function EventFormPage(): JSX.Element {
  const navigate = useNavigate();
  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const { eventID } = useParams();

  const { data } = useGetSingleEventQuery(eventID as string, {
    skip: !eventID,
  });

  const [initialValues, setInitialValues] = useState<EventFormValues>({
    title: "",
    description: "",
    date: "",
    location: "",
    status: "Scheduled",
    attendees: [{ attendeeId: "", role: "Student" }],
    organizer: "",
  });

  useEffect(() => {
    if (data) {
      setInitialValues({
        title: data.title,
        description: data.description,
        date: new Date(data.date).toISOString().split("T")[0],
        location: data.location,
        status: data.status,
        attendees: data.attendees,
        organizer: data.organizer,
      });
    }
  }, [data]);

  const handleSubmit = async (
    values: EventFormValues,
    { setSubmitting }: FormikHelpers<EventFormValues>
  ) => {
    try {
      const response = eventID
        ? await updateEvent({
            _id: eventID,
            ...values,
            createdAt: "",
            updatedAt: "",
            __v: 0,
          }).unwrap()
        : await createEvent(values).unwrap();

      console.log(response);

      if (response) {
        toast.success("Event created successfully");
        navigate("/events");
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <BreadcrumbsComponent
        links={[
          { name: "Event Management", path: "/events" },
          { name: "Event Creation", path: "/events/form" },
        ]}
      />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Create New Event</h1>
        </CardHeader>
        <CardBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
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
            }) => (
              <Form className="space-y-6">
                <FormField
                  label="Event Title"
                  type="text"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.title && errors.title}
                />

                <FormField
                  label="Description"
                  type="textarea"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && errors.description}
                />

                <FormField
                  label="Event Date"
                  type="date"
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.date && errors.date}
                />

                <FormField
                  label="Location"
                  type="text"
                  name="location"
                  value={values.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.location && errors.location}
                />

                <Select
                  name="status"
                  label="Status"
                  placeholder="Select status"
                  selectedKeys={[values.status]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={touched.status && errors.status}
                >
                  <SelectItem key="Scheduled" value="Scheduled">
                    Scheduled
                  </SelectItem>
                  <SelectItem key="Completed" value="Completed">
                    Completed
                  </SelectItem>
                  <SelectItem key="Cancelled" value="Cancelled">
                    Cancelled
                  </SelectItem>
                </Select>

                <FieldArray name="attendees">
                  {({ push, remove }) => (
                    <div>
                      {values.attendees.map((attendee, index) => (
                        <Card key={index} className="mb-4">
                          <CardBody>
                            <div className="space-y-4">
                              <FormField
                                label="Attendee ID"
                                type="text"
                                name={`attendees.${index}.attendeeId`}
                                value={attendee.attendeeId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  touched.attendees?.[index]?.attendeeId &&
                                  (
                                    errors.attendees as FormikErrors<
                                      { attendeeId: string; role: string }[]
                                    >
                                  )?.[index]?.attendeeId
                                }
                              />

                              <Select
                                name={`attendees.${index}.role`}
                                label="Role"
                                placeholder="Select role"
                                selectedKeys={[attendee.role]}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                errorMessage={
                                  touched.attendees?.[index]?.role &&
                                  (
                                    errors.attendees as FormikErrors<
                                      { attendeeId: string; role: string }[]
                                    >
                                  )?.[index]?.role
                                }
                              >
                                <SelectItem key="Teacher" value="Teacher">
                                  Teacher
                                </SelectItem>
                                <SelectItem key="Student" value="Student">
                                  Student
                                </SelectItem>
                              </Select>

                              {index > 0 && (
                                <Button
                                  color="danger"
                                  variant="light"
                                  onClick={() => remove(index)}
                                  startContent={
                                    <TrashIcon className="w-4 h-4" />
                                  }
                                >
                                  Remove Attendee
                                </Button>
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                      <Button
                        color="primary"
                        variant="flat"
                        onClick={() =>
                          push({ attendeeId: "", role: "Student" })
                        }
                        startContent={<PlusIcon className="w-4 h-4" />}
                      >
                        Add Attendee
                      </Button>
                    </div>
                  )}
                </FieldArray>

                <FormField
                  label="Organizer"
                  type="text"
                  name="organizer"
                  value={values.organizer}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.organizer && errors.organizer}
                />

                <Button isDisabled={isSubmitting} color="primary" type="submit">
                  {isSubmitting
                    ? `${eventID ? "Updating" : "Creating"}...`
                    : `${eventID ? "Update" : "Create"} Event`}
                </Button>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </div>
  );
}
