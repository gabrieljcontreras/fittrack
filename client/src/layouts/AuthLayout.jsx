import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <Outlet />
    </div>
  );
}

export default AuthLayout;