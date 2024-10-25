import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { LayoutComponent, LoadingComponent } from "../components/";
import LoginPage from "../pages/auth/Login.page";
import {
  ClassDetailPage,
  ClassPage,
  DashboardPage,
  HomePage,
  LibraryPage,
  StudentFormPage,
  StudentsPage,
  SubjectDetailPage,
  SubjectsPage,
  TeacherDetailPage,
  TeachersPage,
} from "@/pages";
import { useDispatch, useSelector } from "react-redux";
import { useCheckSeesionQuery } from "@/store/endpoints/authEndpoints";
import { useEffect } from "react";
import { login, logout } from "@/store/slice/authSlice";
import { RootState } from "@/store/store";
import StudentDetailPage from "@/pages/student/StudentDetail.page";
import TeacherFormPage from "@/pages/teacher/TeacherForm.page";
import SubjectFormPage from "@/pages/subject/SubjectForm.page";
import ClassFormPage from "@/pages/class/ClassForm.page";
import AdminActivityLog from "@/pages/AdminActivityLog.page";
import ReportsAndAnalytics from "@/pages/ReportsAndAnalytics.page";
import ExamManagement from "@/pages/exam/ExamManagement.page";
import GeneralSettings from "@/pages/GeneralSetting.page";
import ExamCreationForm from "@/pages/exam/ExamCreationForm.page";
import ExamDetails from "@/pages/exam/ExamDetail.page";
import ErrorPage from "@/pages/Error.page";
import LibraryDetailPage from "@/pages/library/LibraryDetail.page";
import LibraryFormPage from "@/pages/library/LibraryForm.page";
import EventsPage from "@/pages/events/Events.page";
import EventFormPage from "@/pages/events/EventForm.page";
import EventDetailPage from "@/pages/events/EventDetail.page";
import AdminProfilePage from "@/pages/auth/AdminProfile.page";
import AdminProfileEditPage from "@/pages/auth/AdminProfileEdit.page";

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
      dispatch(logout()); // Handle logout on error
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
          path: "/",
          element: user ? <HomePage /> : <Navigate to="/login" />, // Use 'replace' to avoid history stacking
          children: [
            {
              path: "students",
              element: user ? <StudentsPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              index: true,
              element: user ? <DashboardPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "teachers",
              element: user ? <TeachersPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "classes",
              element: user ? <ClassPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "subjects",
              element: user ? <SubjectsPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "library",
              element: user ? <LibraryPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "library/:bookID",
              element: user ? <LibraryDetailPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "library/form",
              element: user ? <LibraryFormPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "library/edit-form/:bookID",
              element: user ? <LibraryFormPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "students/:studentID",
              element: user ? <StudentDetailPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "students/form",
              element: user ? <StudentFormPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "students/edit-student/:studentID",
              element: user ? <StudentFormPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "teachers/:teacherID",
              element: user ? <TeacherDetailPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "teachers/form",
              element: user ? <TeacherFormPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "teachers/edit-teacher/:teacherID",
              element: user ? <TeacherFormPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "subjects/:subjectID",
              element: user ? <SubjectDetailPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "subjects/form",
              element: user ? <SubjectFormPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "subjects/edit-subject/:subjectID",
              element: user ? <SubjectFormPage /> : <Navigate to="/login" />, // Protect routes
            },
            {
              path: "classes/:classID",
              element: user ? <ClassDetailPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "classes/form",
              element: user ? <ClassFormPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "classes/edit-class/:classID",
              element: user ? <ClassFormPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "activity-log",
              element: user ? <AdminActivityLog /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "reports-analytics",
              element: <ReportsAndAnalytics />,
            },
            {
              path: "exam-management",
              element: user ? <ExamManagement /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "exam-management/form",
              element: user ? <ExamCreationForm /> : <Navigate to="/login" />,
            },
            {
              path: "exam-management/detail-exam/:examID",
              element: user ? <ExamDetails /> : <Navigate to="/login" />,
            },
            {
              path: "exam-management/edit-exam/:examID",
              element: user ? <ExamCreationForm /> : <Navigate to="/login" />,
            },
            {
              path: "events",
              element: user ? <EventsPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "events/form",
              element: user ? <EventFormPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "events/edit-event/:eventID",
              element: user ? <EventFormPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "events/:eventID",
              element: user ? <EventDetailPage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "profile",
              element: user ? <AdminProfilePage /> : <Navigate to="/login" />, // Protect route
            },
            {
              path: "profile/edit",
              element: user ? (
                <AdminProfileEditPage />
              ) : (
                <Navigate to="/login" />
              ), // Protect route
            },
            {
              path: "settings",
              element: user ? <GeneralSettings /> : <Navigate to="/login" />, // Protect routes
            },
          ],
        },
        {
          path: "/login",
          element: user ? <Navigate to="/" /> : <LoginPage />, // Redirect logged-in users from login page
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
};

export default IndexRoutes;
