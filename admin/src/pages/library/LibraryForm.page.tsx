import { Formik, Form } from "formik";
import {
  Card,
  CardHeader,
  CardBody,
  Select,
  SelectItem,
  Button,
} from "@nextui-org/react";
import { Book } from "lucide-react";
import { BreadcrumbsComponent, FormField } from "@/components";
import { useNavigate, useParams } from "react-router-dom";
import { validationSchema } from "@/validations/libraryValidation";
import { useEffect, useState } from "react";
import {
  useCreateLibraryMutation,
  useGetLibraryDetailQuery,
  useUpdateLibraryMutation,
} from "@/store/endpoints/LibraryEndpoints";
import { toast } from "sonner";

export default function LibraryFormPage() {
  const [initialValues, setInitialValues] = useState({
    name: "",
    type: "",
    category: "",
    availability_status: "available",
    quantity: 1,
    description: "",
    borrow_limit: 7,
    late_fee_per_day: 1,
    location: "",
  });

  const [createLibrary] = useCreateLibraryMutation();

  const { bookID } = useParams<string>();

  const [updateLibrary] = useUpdateLibraryMutation();

  const { data } = useGetLibraryDetailQuery(bookID as string);

  console.log(data);

  useEffect(() => {
    if (data) {
      setInitialValues({
        name: data.name,
        type: data.type,
        category: data.category as string,
        availability_status: data.availability_status,
        quantity: data.quantity,
        description: data.description as string,
        borrow_limit: data.borrow_limit,
        late_fee_per_day: data.late_fee_per_day,
        location: data.location as string,
      });
    }
  }, [data]);

  const navigate = useNavigate();

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      let response;
      if (bookID) {
        response = await updateLibrary({ _id: bookID, ...values });
      } else {
        response = await createLibrary(values);
      }

      if (response) {
        toast.success(response.data?.message);
        navigate("/library");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create library. Please try again.");
    }
  };

  return (
    <div>
      <BreadcrumbsComponent
        links={[
          { name: "Library", path: "/library" },
          {
            name: `Library ${bookID ? "Updating" : "Creation"}`,
            path: `${
              bookID ? `/library/edit-form/${bookID}` : "/library/form"
            }`,
          },
        ]}
      />
      <Card className="">
        <CardHeader className="flex gap-3">
          <Book size={24} />
          <div className="flex flex-col">
            <p className="text-md">
              {bookID ? "Update" : "Create"} New Library Resource
            </p>
            <p className="text-small text-default-500">
              Enter the details of the new library resource
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({
              errors,
              touched,
              isSubmitting,
              values,
              handleBlur,
              handleChange,
              setFieldValue,
            }) => {
              console.log(errors);
              return (
                <Form className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3s gap-3">
                  <FormField
                    label="Name"
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && errors.name}
                  />

                  <Select
                    name="type"
                    label="Type"
                    placeholder="Select type"
                    value={values.type}
                    selectedKeys={[values.type]}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setFieldValue("type", e.target.value)
                    }
                    onBlur={handleBlur}
                    errorMessage={touched.type && errors.type}
                  >
                    {["book", "equipment", "room"].map((option, index) => {
                      return (
                        <SelectItem key={index} value={option}>
                          {option.toUpperCase()}
                        </SelectItem>
                      );
                    })}
                  </Select>

                  <FormField
                    label="Category"
                    type="text"
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && errors.name}
                  />

                  <Select
                    name="availability_status"
                    label="Availability Status"
                    placeholder="Select availability status"
                    selectedKeys={[values.availability_status]}
                    value={values.availability_status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setFieldValue("availability_status", e.target.value)
                    }
                    onBlur={handleBlur}
                    errorMessage={
                      touched.availability_status && errors.availability_status
                    }
                  >
                    {["available", "borrowed", "reserved"].map(
                      (option, index) => {
                        return (
                          <SelectItem key={index} value={option}>
                            {option.toUpperCase()}
                          </SelectItem>
                        );
                      }
                    )}
                  </Select>

                  <FormField
                    label="Quantity"
                    type="number"
                    name="quantity"
                    value={values.quantity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.quantity && errors.quantity}
                  />

                  <FormField
                    label="Description"
                    type="text"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && errors.description}
                  />

                  <FormField
                    label="Borrow Limit"
                    type="number"
                    name="borrow_limit"
                    value={values.borrow_limit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.borrow_limit && errors.borrow_limit}
                  />

                  <FormField
                    label="Late Fee Per Day"
                    type="number"
                    name="late_fee_per_day"
                    value={values.late_fee_per_day}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.late_fee_per_day && errors.late_fee_per_day}
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

                  <Button
                    type="submit"
                    color="primary"
                    isLoading={isSubmitting}
                  >
                    {bookID ? "Update" : "Create"} Resource
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </CardBody>
      </Card>
    </div>
  );
}
