import { useAuth } from "../contexts/AuthContext";
import { useQuiz } from "../contexts/QuizContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./css/ProfilePage.css";

function ProfilePage() {
  const { user } = useAuth();
  const { testHistory, totalHistory, averageScore, mostFrequentLevel,tilteLastes } =
    useQuiz();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  // Mini dashboard
  const [totalTests, setTotalTests] = useState(0);
  const [averageCorrect, setAverageCorrect] = useState(0);
  const [averageLevel, setAverageLevel] = useState("-");
  const [lastTest, setLastTest] = useState(null);

  const levelMap = { beginner: 1, intermediate: 2, advanced: 3 };
  const levelReverse = ["-", "Beginner", "Intermediate", "Advanced"];

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${user.token}`, // Nếu dùng JWT
        },
      });

      const data = await res.json();
      if (data.avatarUrl) {
        setPreview(data.avatarUrl);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  useEffect(() => {
    if (testHistory && testHistory.length > 0) {
      const userTests = testHistory.filter((t) => t.userId === user._id);

      const corrects = userTests.map((t) => t.correctAnswers);
      const totalQs = userTests.map((t) => t.totalQuestions);
      const avgCorrect =
        corrects.reduce((a, b) => a + b, 0) /
        (totalQs.reduce((a, b) => a + b, 0) || 1);

      const levels = userTests.map((t) => levelMap[t.level] || 0);
      const avgLevel = levels.reduce((a, b) => a + b, 0) / (levels.length || 1);

      setTotalTests(userTests.length);
      setAverageCorrect(Math.round(avgCorrect * 100));
      setAverageLevel(levelReverse[Math.round(avgLevel)] || "-");
      setLastTest(userTests[0]);
    }
  }, [testHistory, user]);

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* <div className="avatar-section">
          <img
            src={preview || user.avatarUrl || "/default-avatar.png"}
            alt="Avatar"
            className="avatar"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setPreview(url);
                // Gọi API upload file lên server nếu muốn:
                // handleUpload(file);
              }
            }}
          />
        </div> */}

        <h2>👤 Thông tin người dùng</h2>
        <div className="profile-info">
          <p>
            <strong>🧍 Tên:</strong> {user?.name}
          </p>
          <p>
            <strong>📧 Email:</strong> {user?.email}
          </p>
        </div>

        <h3>📊 Thống kê cá nhân</h3>
        <div className="mini-dashboard">
          <div className="stat-box">
            <p className="stat-number">{totalHistory}</p>
            <p>Bài đã làm</p>
          </div>
          <div className="stat-box">
            <p className="stat-number">{averageScore}%</p>
            <p>Trả lời đúng TB</p>
          </div>
          <div className="stat-box">
            <p className="stat-number">{mostFrequentLevel}</p>
            <p>Mức độ TB</p>
          </div>
          <div className="stat-box">
            <p className="stat-number">{tilteLastes || "Chưa có"}</p>
            <p>Lần gần nhất</p>
          </div>
        </div>
        <div className="profile-buttons">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/change-password")}
          >
            🔑 Đổi mật khẩu
          </button>
          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ⬅️ Quay lại Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
