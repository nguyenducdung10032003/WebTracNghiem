import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:9999/api/auth/reset-password", {
        token,
        newPassword: password,
      });
      alert("Đặt lại mật khẩu thành công");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Đặt lại mật khẩu thất bại");
    }
  };

  return (
    <div className="reset-password-page">
      <h2>Đặt lại mật khẩu</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Xác nhận</button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;
