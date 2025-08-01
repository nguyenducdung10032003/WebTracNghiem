import { useState, useEffect } from "react";
import "./css/AddQuestionForm.css";
import { useQuiz } from "../contexts/QuizContext";

function EditQuestionForm({ question, onSaveQuestion, onCancel }) {
  const { fetchQuestions } = useQuiz();
  const [editedQuestion, setEditedQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: [],
    level: "beginner",
    category: "grammar",
  });

  useEffect(() => {
    if (question) {
      setEditedQuestion({ ...question });
    }
  }, [question]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      editedQuestion.question.trim() &&
      editedQuestion.options.every((opt) => opt.trim()) &&
      editedQuestion.correctAnswer.length > 0
    ) {
      onSaveQuestion(editedQuestion);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, options: newOptions });
  };

  const handleCheckboxChange = (e, index) => {
    const value = Number(index);
    let updatedAnswers = [...editedQuestion.correctAnswer];

    if (e.target.checked) {
      if (!updatedAnswers.includes(value)) {
        updatedAnswers.push(value);
      }
    } else {
      updatedAnswers = updatedAnswers.filter((v) => v !== value);
    }

    setEditedQuestion({ ...editedQuestion, correctAnswer: updatedAnswers });
  };

  return (
    <form onSubmit={handleSubmit} className="add-question-form">
      <div className="form-group">
        <label htmlFor="question">Câu hỏi</label>
        <textarea
          id="question"
          className="form-control"
          value={editedQuestion.question}
          onChange={(e) =>
            setEditedQuestion({ ...editedQuestion, question: e.target.value })
          }
          placeholder="Nhập câu hỏi..."
          rows="3"
          required
        />
      </div>

      <div className="options-grid">
        {editedQuestion.options.map((option, index) => (
          <div key={index} className="form-group">
            <label htmlFor={`option-${index}`}>
              Đáp án {String.fromCharCode(65 + index)}
            </label>
            <input
              type="text"
              id={`option-${index}`}
              className="form-control"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
              required
            />
          </div>
        ))}
      </div>

      <div className="form-group">
        <label>Đáp án đúng (có thể chọn nhiều)</label>
        <div className="checkbox-group">
          {editedQuestion.options.map((_, index) => (
            <label key={index} className="checkbox-option">
              <input
                type="checkbox"
                name="correctAnswer"
                value={index}
                checked={editedQuestion.correctAnswer.includes(index)}
                onChange={(e) => handleCheckboxChange(e, index)}
              />
              <span>Đáp án {String.fromCharCode(65 + index)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="level">Cấp độ</label>
          <select
            id="level"
            className="form-control"
            value={editedQuestion.level}
            onChange={(e) =>
              setEditedQuestion({ ...editedQuestion, level: e.target.value })
            }
          >
            <option value="beginner">Cơ bản</option>
            <option value="intermediate">Trung cấp</option>
            <option value="advanced">Nâng cao</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="category">Danh mục</label>
          <select
            id="category"
            className="form-control"
            value={editedQuestion.category}
            onChange={(e) =>
              setEditedQuestion({ ...editedQuestion, category: e.target.value })
            }
          >
            <option value="grammar">Ngữ pháp</option>
            <option value="vocabulary">Từ vựng</option>
            <option value="reading">Đọc hiểu</option>
            <option value="listening">Nghe</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Hủy
        </button>
        <button type="submit" className="btn btn-primary">
          Lưu thay đổi
        </button>
      </div>
    </form>
  );
}

export default EditQuestionForm;
