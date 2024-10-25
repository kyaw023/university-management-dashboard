import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const LayoutComponent = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true }); // Explicitly navigate to login if user is null
    }
  }, [user, navigate]);
  return (
    <div className=" dark:bg-gray-900 min-h-screen">
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutComponent;
