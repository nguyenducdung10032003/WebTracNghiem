import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../contexts/QuizContext";
import { formatTime, getScoreMessage } from "../utils/helpers";
import "./css/ResultsPage.css";

function ResultsPage() {
  const { testResults } = useQuiz();
  const navigate = useNavigate();

  useEffect(() => {
    if (!testResults) {
      navigate("/dashboard");
    }
  }, [testResults, navigate]);

  if (!testResults) return null;

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="results-page">
      <div className="results-card">
        <div className="results-header">
          <div className="success-icon">✓</div>
          <h2>Kết quả bài thi</h2>
          <p>Bạn đã hoàn thành bài thi thành công!</p>
        </div>

        <div className="results-body">
          <div className="score-display">
            <div className="score-value">{testResults.score}%</div>
            <p className="score-details">
              {testResults.correctAnswers}/{testResults.totalQuestions} câu đúng
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-box time-stat">
              <p className="stat-label">Thời gian làm bài</p>
              <p className="stat-value">{formatTime(testResults.timeSpent)}</p>
            </div>
            <div className="stat-box accuracy-stat">
              <p className="stat-label">Độ chính xác</p>
              <p className="stat-value">{testResults.score}%</p>
            </div>
          </div>

          <div className="message-box">
            <p>{getScoreMessage(testResults.score)}</p>
          </div>

          <div className="action-buttons">
            <button
              className="btn btn-secondary"
              onClick={handleBackToDashboard}
            >
              Về trang chủ
            </button>
            <button className="btn btn-primary" onClick={handleBackToDashboard}>
              Làm bài khác
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
