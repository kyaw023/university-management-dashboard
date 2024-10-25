import { useState } from "react";
import { FormComponent } from "@/components";
import { Button } from "@/components/ui/button";

import { Form, Formik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/store/endpoints/authEndpoints";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { login } from "@/store/slice/authSlice";
import { Eye, EyeOff } from "lucide-react";
import logoImage from "../../assets/logo.png";
import { Card, CardFooter, CardHeader } from "@nextui-org/react";
import { CardContent, CardDescription, CardTitle } from "@/components/ui/card";

const LoginPage = () => {
  const [handleLogin] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  interface FormValues {
    email: string;
    password: string;
  }

  const initialValues: FormValues = {
    email: "",
    password: "",
  };

  const validationSchema = yup.object().shape({
    email: yup.string().required("Email is required").email("Email is invalid"),
    password: yup.string().required("Password is required"),
  });

  const onSubmit = async (values: FormValues) => {
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
    }
  };

  return (
    <div className=" flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full md:w-1/2 flex items-center mx-auto justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 flex flex-col ">
            <div className="flex justify-center mb-4">
              <img
                className="w-24 h-24"
                src={logoImage}
                alt="Riverstone Learning System Logo"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-primary dark:text-primary-foreground">
              Welcome to Riverstone Learning System
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              onSubmit={onSubmit}
              initialValues={initialValues}
              validationSchema={validationSchema}
            >
              {({
                values,
                handleSubmit,
                handleBlur,
                handleChange,
                errors,
                touched,
                isSubmitting,
              }) => (
                <Form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <FormComponent
                      value={values.email}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      name="email"
                      placeholder="Enter your email"
                      type="email"
                      error={errors.email}
                      touched={touched.email}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <FormComponent
                        value={values.password}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        name="password"
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        error={errors.password}
                        touched={touched.password}
                        className="h-12 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    disabled={isSubmitting}
                    className="w-full h-10"
                    type="submit"
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot your password?
            </Link>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
