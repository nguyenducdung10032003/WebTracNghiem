import { useState } from "react";
import "./css/AddTestForm.css";
import { useQuiz } from "../contexts/QuizContext";

function AddTestForm({ onAddTest, onCancel }) {
  const { addTest } = useQuiz();
  const [newTest, setNewTest] = useState({
    title: "",
    question: 10,
    duration: 15,
    level: "beginner",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTest.title.trim()) {
      onAddTest(newTest);
      setNewTest({
        title: "",
        question: 10,
        duration: 15,
        level: "beginner",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-test-form">
      <div className="form-group">
        <label htmlFor="title">Tên bài thi</label>
        <input
          type="text"
          id="title"
          className="form-control"
          value={newTest.title}
          onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
          placeholder="Nhập tên bài thi..."
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="duration">Thời gian (phút)</label>
          <input
            type="number"
            id="duration"
            className="form-control"
            min="1"
            value={newTest.duration}
            onChange={(e) =>
              setNewTest({ ...newTest, duration: Number(e.target.value) })
            }
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="question">Số câu hỏi</label>
          <input
            type="number"
            id="question"
            className="form-control"
            min="1"
            value={newTest.question}
            onChange={(e) =>
              setNewTest({ ...newTest, question: Number(e.target.value) })
            }
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="level">Cấp độ</label>
        <select
          id="level"
          className="form-control"
          value={newTest.level}
          onChange={(e) => setNewTest({ ...newTest, level: e.target.value })}
        >
          <option value="beginner">Cơ bản</option>
          <option value="intermediate">Trung cấp</option>
          <option value="advanced">Nâng cao</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Hủy
        </button>
        <button type="submit" className="btn btn-primary">
          Thêm bài thi
        </button>
      </div>
    </form>
  );
}

export default AddTestForm;
