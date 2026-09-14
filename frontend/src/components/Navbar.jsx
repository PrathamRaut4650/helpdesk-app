import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>{" "}
      <Link to="/my-tasks">My Tasks</Link>{" "}
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;