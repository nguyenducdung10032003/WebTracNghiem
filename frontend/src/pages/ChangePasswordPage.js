import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./css/ProfilePage.css";

function ChangePasswordPage() {
  const { updatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    try {
      await updatePassword({currentPassword, newPassword});
      alert("Đổi mật khẩu thành công!");
      navigate("/profile");
    } catch (error) {
      alert("Đổi mật khẩu thất bại!");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>🔐 Đổi mật khẩu</h2>
        <div className="password-form">
          <input
            type="password"
            placeholder="Mật khẩu hiện tại"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleChangePassword}>
            Xác nhận đổi mật khẩu
          </button>
        </div>

        <button className="back-button" onClick={() => navigate("/profile")}>
          ⬅️ Quay lại hồ sơ
        </button>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
