import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./css/LoginPage.css";
import { auth, googleProvider, signInWithPopup } from "../firebase";

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({
        email: loginForm.email,
        password: loginForm.password,
      });
      const storedUser = JSON.parse(localStorage.getItem("user"));

      console.log("Login successful. Role:", storedUser?.role);
      navigate(storedUser?.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      const res = await axios.post("http://localhost:9999/api/auth/google", {
        token,
      });

      // ✅ Lưu token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Điều hướng
      navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      console.error("Google login error", error);
      alert("Đăng nhập Google thất bại");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        role: "user",
      });
      alert("Register successfully");
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error);
      alert("Register failed");
    }
  };
  const handleForgotPassword = async (email) => {
    try {
      const response = await axios.post(
        "http://localhost:9999/api/auth/forgot-password",
        {
          email,
        }
      );
      alert("Hãy kiểm tra email để đặt lại mật khẩu.");
    } catch (error) {
      console.error("Forgot password error:", error);
      alert("Không thể gửi email đặt lại mật khẩu.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>English Quiz System</h2>
          <p>Hệ thống thi trắc nghiệm tiếng Anh</p>
        </div>

        <div className="login-tabs">
          <a
            href="#"
            className={`tab-link ${isLogin ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setIsLogin(true);
            }}
          >
            Đăng nhập
          </a>
          <a
            href="#"
            className={`tab-link ${!isLogin ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setIsLogin(false);
            }}
          >
            Đăng ký
          </a>
        </div>

        <div className="login-body">
          {isLogin ? (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  placeholder="admin@test.com hoặc user@test.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  required
                />
              </div>
              <p className="text-right">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const email = loginForm.email;
                    if (!email) {
                      alert("Vui lòng nhập email trước khi đặt lại mật khẩu.");
                      return;
                    }
                    handleForgotPassword(email);
                  }}
                >
                  Quên mật khẩu?
                </a>
              </p>
              <button type="submit" className="btn btn-primary btn-block">
                Đăng nhập
              </button>
              <button
                type="button"
                className="btn btn-danger btn-block"
                onClick={handleGoogleLogin}
              >
                Đăng nhập với Google
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="name">Họ tên</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  value={registerForm.name}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reg-email">Email</label>
                <input
                  type="email"
                  id="reg-email"
                  className="form-control"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reg-password">Mật khẩu</label>
                <input
                  type="password"
                  id="reg-password"
                  className="form-control"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Đăng ký
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
