import { useState } from "react";
import "./css/AddQuestionForm.css";
import { useQuiz } from "../contexts/QuizContext";

function AddQuestionForm({ onAddQuestion, onCancel }) {
  const { fetchQuestions } = useQuiz();
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: [],
    level: "beginner",
    category: "grammar",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      newQuestion.question.trim() &&
      newQuestion.options.every((opt) => opt.trim()) &&
      newQuestion.correctAnswer.length > 0
    ) {
      onAddQuestion(newQuestion);
    } else {
      alert("Vui lòng nhập đầy đủ thông tin và chọn ít nhất một đáp án đúng.");
      return;
    }

    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: [],
      level: "beginner",
      category: "grammar",
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };
  
  const handleCheckboxChange = (index) => {
    const updatedAnswers = [...newQuestion.correctAnswer];
    const isChecked = updatedAnswers.includes(index);

    const newAnswers = isChecked
      ? updatedAnswers.filter((ans) => ans !== index) // Bỏ nếu đã chọn
      : [...updatedAnswers, index]; // Thêm nếu chưa có

    setNewQuestion({ ...newQuestion, correctAnswer: newAnswers });
  };

  return (
    <form onSubmit={handleSubmit} className="add-question-form">
      <div className="form-group">
        <label htmlFor="question">Câu hỏi</label>
        <textarea
          id="question"
          className="form-control"
          value={newQuestion.question}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, question: e.target.value })
          }
          placeholder="Nhập câu hỏi..."
          rows="3"
          required
        />
      </div>

      <div className="options-grid">
        {newQuestion.options.map((option, index) => (
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
        <label>Đáp án đúng</label>
        <div className="checkbox-group">
          {newQuestion.options.map((_, index) => (
            <label key={index} className="checkbox-option">
              <input
                type="checkbox"
                value={index}
                checked={newQuestion.correctAnswer.includes(index)}
                onChange={() => handleCheckboxChange(index)}
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
            value={newQuestion.level}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, level: e.target.value })
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
            value={newQuestion.category}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, category: e.target.value })
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
          Thêm câu hỏi
        </button>
      </div>
    </form>
  );
}

export default AddQuestionForm;
