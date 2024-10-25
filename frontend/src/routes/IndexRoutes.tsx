import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { LayoutComponent, LoadingComponent } from "../components";
import {
  CourseMaterialsPage,
  ErrorPage,
  GradeSubmissionPage,
  HomePage,
  LoginPage,
  SettingsPage,
  StudentRosterPage,
} from "../page";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useCheckSeesionQuery } from "../store/endpoints/authEndpoint";
import { useEffect } from "react";
import { login, logout } from "../store/slice/authSlice";

const IndexRoutes = () => {
  const dispatch = useDispatch();

  const { token, user } = useSelector((state: RootState) => state.auth);
  const { data, error, isLoading } = useCheckSeesionQuery();

  useEffect(() => {
    if (data) {
      dispatch(login({ user: data, token: token as string })); // Update Redux store with user data
    } else {
      dispatch(logout());
    }
    if (error) {
      dispatch(logout());
      // Handle logout on error
    }
  }, [data, error, token, dispatch]);

  if (isLoading) {
    return <LoadingComponent />; // Loading state while checking session
  }

  const routes = createBrowserRouter([
    {
      path: "/",
      element: <LayoutComponent />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: user ? <HomePage /> : <Navigate to="/login" />,
        },

        {
          path: "settings",
          element: user ? <SettingsPage /> : <Navigate to="/login" />,
        },
        {
          path: "course-materials",
          element: user ? <CourseMaterialsPage /> : <Navigate to="/login" />,
        },
        {
          path: "students-roster",
          element: user ? <StudentRosterPage /> : <Navigate to="/login" />,
        },
        {
          path: "grade-submission",
          element: user ? <GradeSubmissionPage /> : <Navigate to="/login" />,
        },
        {
          path: "login",
          element: user ? <Navigate to="/" /> : <LoginPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
};

export default IndexRoutes;
