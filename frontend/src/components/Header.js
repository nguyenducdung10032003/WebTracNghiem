import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom"; // Thêm import này
import "./css/Header.css";

function Header({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // Hook để điều hướng

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1>{title}</h1>
          {user && (
            <div className="user-info">
              <button className="user-name-btn" onClick={goToProfile}>
                👤 {user.name}
              </button>
              <button className="btn btn-secondary" onClick={logout}>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
