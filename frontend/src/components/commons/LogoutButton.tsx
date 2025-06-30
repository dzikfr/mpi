import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      sessionStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
