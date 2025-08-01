import "./css/TestCard.css";

function TestCard({ test, onStartTest }) {
  const getBadgeClass = () => {
    switch (test.level) {
      case "beginner":
        return "badge-secondary";
      case "intermediate":
        return "badge-primary";
      case "advanced":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  return (
    <div className="test-card">
      <div className="test-card-header">
        <h3>{test.title}</h3>
        <span className={`badge ${getBadgeClass()}`}>{test.level}</span>
      </div>
      <div className="test-card-body">
        <p className="test-info">
          {test.questions.length} câu hỏi • {test.duration} phút
        </p>
        <div className="test-details">
          <div className="test-detail">
            <span className="icon">📝</span>
            <span>{test.questions.length} câu</span>
          </div>
          <div className="test-detail">
            <span className="icon">⏱️</span>
            <span>{test.duration} phút</span>
          </div>
        </div>
        {test.questions.length > 0 ? (
          <button
            className="btn btn-primary btn-block"
            onClick={() => onStartTest(test)}
          >
            Bắt đầu thi
          </button>
        ) : (
          <p className="text-muted">Bài thi chưa có câu hỏi</p>
        )}
      </div>
    </div>
  );
}

export default TestCard;
