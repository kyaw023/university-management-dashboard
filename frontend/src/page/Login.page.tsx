import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Link,
  Image,
} from "@nextui-org/react";

import Logo from "../assets/logo.png";
import { EyeSlashFilledIcon } from "../assets/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../assets/icons/EyeFilledIcon";
import { useLoginMutation } from "../store/endpoints/authEndpoint";
import { useDispatch } from "react-redux";
import { login } from "../store/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

interface LoginFormValues {
  email: string;
  password: string;
}

const TeacherLoginForm: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [handleLogin] = useLoginMutation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: any
  ) => {
    console.log(values);
    try {
      const response = await handleLogin(values).unwrap();

      if (response) {
        toast.success(response.message);
        navigate("/");
        dispatch(login({ user: response.user, token: response.token }));
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
      <Card className="w-full max-w-md  dark:bg-gray-800/80 backdrop-blur-md">
        <CardHeader className="flex flex-col items-center pb-0 pt-6">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4">
            <Image src={Logo} alt="Logo" />
          </div>
          <h1 className="text-2xl font-bold text-primary">RiverStone</h1>
          <p className="text-small text-default-500">Teacher Portal</p>
        </CardHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({
            errors,
            touched,
            isSubmitting,
            handleBlur,
            handleChange,
            values,
          }) => (
            <Form>
              <CardBody className="gap-4">
                <Input
                  isClearable
                  name="email"
                  type="email"
                  label="Email"
                  value={values.email}
                  variant="bordered"
                  placeholder="Enter your email"
                  defaultValue="junior@nextui.org"
                  onClear={() => {
                    values.email = "";
                  }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={errors.email && touched.email && errors.email}
                  isInvalid={
                    errors.email && touched.email && (errors.email as any)
                  }
                />

                <Input
                  label="Password"
                  variant="bordered"
                  placeholder="Enter your password"
                  aria-label="Password"
                  name="password"
                  value={values.password}
                  isInvalid={
                    errors.password &&
                    touched.password &&
                    (errors.password as any)
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={
                    errors.password && touched.password && errors.password
                  }
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                      aria-label="toggle password visibility"
                    >
                      {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                />
              </CardBody>
              <CardFooter className="flex flex-col items-center gap-4">
                <Button
                  type="submit"
                  color="primary"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  Sign In
                </Button>
                <div className="flex justify-between w-full text-small">
                  <Link href="#" size="sm">
                    Forgot password?
                  </Link>
                  <Link href="#" size="sm">
                    Need help?
                  </Link>
                </div>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default TeacherLoginForm;
