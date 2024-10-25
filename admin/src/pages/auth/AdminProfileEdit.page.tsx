import React, { useEffect, useRef, useState } from "react";
import { Formik, Form } from "formik";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Button,
  Avatar,
  RadioGroup,
  Radio,
  Progress,
} from "@nextui-org/react";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
  CameraIcon,
  XIcon,
  CheckIcon,
  CalendarIcon,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpdateProfileMutation } from "@/store/endpoints/authEndpoints";
import { UserType } from "@/types/types";
import { toast } from "sonner";
import { BreadcrumbsComponent } from "@/components";
import { uploadImage } from "@/helper/imageUploader";
import { validationSchema } from "@/validations/adminUserValidation";

export default function AdminProfileEditPage() {
  const [updateAdminProfile] = useUpdateProfileMutation();
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [initialValues, setInitialValues] = useState<UserType>({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "admin",
    date_of_birth: "",
    gender: "",
    bio: "",
    image: "",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const adminData = location.state as UserType;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adminData) {
      setInitialValues(adminData);
      setPreviewImg(adminData.image || null);
    }
  }, [adminData]);

  const handleSubmit = async (values: UserType) => {
    try {
      if (file) {
        const downloadURL = await uploadImage(file, setProgress);
        if (downloadURL) {
          values.image = downloadURL;
          toast.success("Image uploaded successfully!");
        } else {
          toast.error("Failed to upload image. Please try again.");
          return;
        }
      }

      const response = await updateAdminProfile({
        _id: adminData._id,
        ...values,
      }).unwrap();

      if (response) {
        toast.success(response.message);
        navigate("/profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className=" bg-gradient-to-br from-background to-background/80">
      <div className="">
        <BreadcrumbsComponent
          links={[
            { name: "Admin Profile", path: "/profile" },
            { name: "Edit Profile", path: "/profile/edit" },
          ]}
        />
        <Card className="mt-6">
          <CardHeader className="flex flex-col items-start px-8 pt-8">
            <h1 className="text-3xl font-bold text-foreground">
              Edit Admin Profile
            </h1>
          </CardHeader>
          <CardBody className="px-8 pb-8">
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
                handleBlur,
                handleChange,
                values,
                setFieldValue,
              }) => {
                const handleImageChange = (
                  e: React.ChangeEvent<HTMLInputElement>
                ) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    setFile(selectedFile);
                    setFieldValue("image", selectedFile);
                    setPreviewImg(URL.createObjectURL(selectedFile));
                  }
                };

                return (
                  <Form className="space-y-6">
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative w-32 h-32">
                        <Avatar
                          src={previewImg || adminData.image}
                          alt="Profile"
                          className="w-full h-full text-large"
                        />
                        <input
                          ref={fileInputRef}
                          type="file"
                          name="image"
                          onChange={handleImageChange}
                          onBlur={handleBlur}
                          className="hidden"
                          accept="image/*"
                        />
                        <Button
                          isIconOnly
                          color="primary"
                          aria-label="Change profile picture"
                          className="absolute bottom-0 right-0 rounded-full"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <CameraIcon className="w-5 h-5" />
                        </Button>
                      </div>
                      {progress > 0 && progress < 100 && (
                        <Progress value={progress} className="w-full mt-2" />
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        id="name"
                        name="name"
                        label="Name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your name"
                        startContent={<UserIcon className="text-default-400" />}
                        isInvalid={touched.name && !!errors.name}
                        errorMessage={touched.name && errors.name}
                      />
                      <Input
                        id="email"
                        name="email"
                        label="Email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your email"
                        startContent={<MailIcon className="text-default-400" />}
                        isInvalid={touched.email && !!errors.email}
                        errorMessage={touched.email && errors.email}
                      />
                      <Input
                        id="phone"
                        name="phone"
                        label="Phone"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your phone number"
                        startContent={
                          <PhoneIcon className="text-default-400" />
                        }
                        isInvalid={touched.phone && !!errors.phone}
                        errorMessage={touched.phone && errors.phone}
                      />
                      <Input
                        id="address"
                        name="address"
                        label="Location"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your location"
                        startContent={
                          <MapPinIcon className="text-default-400" />
                        }
                        isInvalid={touched.address && !!errors.address}
                        errorMessage={touched.address && errors.address}
                      />
                      <Input
                        id="date_of_birth"
                        name="date_of_birth"
                        label="Date of Birth"
                        value={values.date_of_birth}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your date of birth"
                        startContent={
                          <CalendarIcon className="text-default-400" />
                        }
                        type="date"
                        isInvalid={
                          touched.date_of_birth && !!errors.date_of_birth
                        }
                        errorMessage={
                          touched.date_of_birth && errors.date_of_birth
                        }
                      />
                      <div>
                        <RadioGroup
                          label="Gender"
                          name="gender"
                          value={values.gender}
                          onValueChange={(value) =>
                            setFieldValue("gender", value)
                          }
                        >
                          <Radio value="male">Male</Radio>
                          <Radio value="female">Female</Radio>
                          <Radio value="other">Other</Radio>
                        </RadioGroup>
                        {touched.gender && errors.gender && (
                          <p className="text-danger text-sm mt-1">
                            {errors.gender}
                          </p>
                        )}
                      </div>
                    </div>
                    <Textarea
                      id="bio"
                      name="bio"
                      label="Bio"
                      value={values.bio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your bio"
                      minRows={4}
                      isInvalid={touched.bio && !!errors.bio}
                      errorMessage={touched.bio && errors.bio}
                    />
                    <div className="flex justify-end space-x-4">
                      <Button
                        color="danger"
                        variant="bordered"
                        startContent={<XIcon className="w-4 h-4" />}
                        onClick={() => navigate(-1)}
                      >
                        Cancel
                      </Button>
                      <Button
                        color="primary"
                        type="submit"
                        startContent={<CheckIcon className="w-4 h-4" />}
                        isLoading={isSubmitting}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
