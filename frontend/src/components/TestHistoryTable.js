import { formatTime } from "../utils/helpers";
import "./css/TestHistoryTable.css";
import { useQuiz } from "../contexts/QuizContext";
import { useEffect, useState } from "react";

function TestHistoryTable({ showUser = false }) {
  const { fetchHistory, testHistory } = useQuiz();

  const getBadgeClass = (score) => {
    if (score >= 80) return "badge-success";
    if (score >= 60) return "badge-primary";
    return "badge-danger";
  };

  const [sortConfig, setSortConfig] = useState({
    key: "completedAt",
    direction: "desc",
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  // Gọi API khi sortConfig thay đổi
  useEffect(() => {
    fetchHistory(sortConfig.key, sortConfig.direction);
  }, [sortConfig]);

  return (
    <div className="test-history-table">
      <table>
        <thead>
          <tr>
            {showUser && <th>Học viên</th>}
            <th>Bài thi</th>
            <th onClick={() => handleSort("score")} className="sortable">
              Điểm
            </th>
            <th
              onClick={() => handleSort("correctAnswers")}
              className="sortable"
            >
              Câu đúng
            </th>
            <th onClick={() => handleSort("timeSpent")} className="sortable">
              Thời gian
            </th>
            <th onClick={() => handleSort("completedAt")} className="sortable">
              Ngày thi
            </th>
          </tr>
        </thead>
        <tbody>
          {testHistory.length === 0 ? (
            <tr>
              <td colSpan={showUser ? 6 : 5} className="empty-message">
                Chưa có lịch sử thi
              </td>
            </tr>
          ) : (
            testHistory.map((item) => (
              <tr key={item._id}>
                {showUser && <td>{item.userName}</td>}
                <td>{item.testTitle}</td>
                <td>
                  <span className={`badge ${getBadgeClass(item.score)}`}>
                    {item.score}%
                  </span>
                </td>
                <td>
                  {item.correctAnswers}/{item.totalQuestions}
                </td>
                <td>{formatTime(item.timeSpent)}</td>
                <td>{new Date(item.completedAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TestHistoryTable;
