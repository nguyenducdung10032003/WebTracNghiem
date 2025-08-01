import "./css/QuestionCard.css";
import * as questionService from "../services/questionService";

function QuestionCard({ question, userAnswers, onAnswerSelect }) {
  const currentAnswers = userAnswers[question._id]?.answers || [];

  const handleToggleAnswer = async (questionId, index) => {
    const updatedAnswers = currentAnswers.includes(index)
      ? currentAnswers.filter((i) => i !== index)
      : [...currentAnswers, index];

    try {
      const result = await questionService.checkAnswer(
        questionId,
        updatedAnswers
      );
      onAnswerSelect(questionId, updatedAnswers, result.isCorrect);
    } catch (error) {
      console.error("Lỗi khi kiểm tra đáp án:", error);
    }
  };

  return (
    <div className="question-card">
      <div className="question-card-header">
        <h3>{question.question}</h3>
      </div>
      <div className="question-card-body">
        <div className="options-list">
          {question.options.map((option, index) => {
            const isChecked = currentAnswers.includes(index);
            return (
              <div
                key={index}
                className={`option-item ${isChecked ? "selected" : ""}`}
                onClick={() => handleToggleAnswer(question._id, index)}
              >
                <input
                  type="checkbox"
                  id={`option-${index}`}
                  name={`question-${question._id}`}
                  checked={isChecked}
                  readOnly
                />
                <label htmlFor={`option-${index}`}>
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="option-text">{option}</span>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;
