import { useState, useEffect } from "react";
import "./css/AddTestForm.css";

function EditTestForm({ test, onSaveTest, onCancel }) {
  const [editedTest, setEditedTest] = useState({
    title: "",
    question: 10,
    duration: 15,
    level: "beginner",
  });

  useEffect(() => {
    if (test) {
      setEditedTest({ ...test });
    }
  }, [test]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editedTest.title.trim()) {
      onSaveTest(editedTest);
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
          value={editedTest.title}
          onChange={(e) =>
            setEditedTest({ ...editedTest, title: e.target.value })
          }
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
            value={editedTest.duration}
            onChange={(e) =>
              setEditedTest({ ...editedTest, duration: Number(e.target.value) })
            }
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="questions">Số câu hỏi</label>
          <input
            type="number"
            id="questions"
            className="form-control"
            min="1"
            value={editedTest.question}
            onChange={(e) =>
              setEditedTest({ ...editedTest, question: Number(e.target.value) })
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
          value={editedTest.level}
          onChange={(e) =>
            setEditedTest({ ...editedTest, level: e.target.value })
          }
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
          Lưu thay đổi
        </button>
      </div>
    </form>
  );
}

export default EditTestForm;
