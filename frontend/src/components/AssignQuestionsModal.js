import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import Modal from "./Modal";
import AddQuestionForm from "./AddQuestionForm";
import "./css/AssignQuestionsModal.css";
import axios from "axios";
import * as questionService from "../services/questionService";
import * as testService from "../services/testService";

function AssignQuestionsModal({
  test,
  questions,
  isOpen,
  onClose,
  onSave,
  onAddQuestion,
  assignQuestionsToTest,
}) {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("select");
  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  const [questionOfTest, setQuestionOfTest] = useState([]);
  const [randomCount, setRandomCount] = useState([]);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (test) {
      fetchAssignedQuestions();
    }
  }, [test]);

  // useEffect(() => {
  //   if (searchTerm) {
  //     setFilteredQuestions(
  //       questions.filter((q) =>
  //         q.question.toLowerCase().includes(searchTerm.toLowerCase())
  //       )
  //     );
  //   } else {
  //     setFilteredQuestions(questions);
  //   }
  // }, [searchTerm, questions]);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await questionService.fetchAllQuestions(
          debouncedSearchTerm
        );
        setFilteredQuestions(response.data.questions);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm câu hỏi:", error);
      }
    };

    fetchQuestions();
  }, [debouncedSearchTerm]);

  const fetchAssignedQuestions = async () => {
    if (!test || !test._id) return;

    try {
      const response = await questionService.fetchQuestionsByTest(test._id);
      const assignedQuestions = response.data.questions || [];
      const selectedIds = assignedQuestions.map((q) => q._id);
      setQuestionOfTest(selectedIds);
    } catch (error) {
      console.error("Không thể fetch câu hỏi đã gán cho bài test:", error);
      alert("Lỗi khi tải câu hỏi đã gán cho bài kiểm tra.");
    }
  };

  const handleToggleQuestion = (questionId) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };
  const handleRemoveQuestion = async (questionId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
      await testService.deleteQuestionToTest(test._id, questionId);
      await fetchAssignedQuestions();
      if (onSave) {
        onSave();
      }
    }
  };

  const handleRandomSelect = (count) => {
    const availableIds = questions.map((q) => q._id);
    const shuffled = availableIds.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);
    setSelectedQuestions(selected);
  };

  const handleSave = async () => {
    if (!test || !test._id) {
      alert("Không có bài kiểm tra để gán câu hỏi.");
      console.error("Test hoặc test._id không hợp lệ:", test);
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:9999/api/tests/questions/${test._id}`,
        { questionIds: selectedQuestions }
      );

      console.log("Questions added successfully", response.data);
      onSave(test._id, selectedQuestions);
      onClose();
    } catch (error) {
      console.error("Error adding questions:", error);
      alert("Gán câu hỏi thất bại. Vui lòng thử lại.");
    }
  };

  const handleAddNewQuestion = (questionData) => {
    const newQuestion = onAddQuestion(questionData);
    setSelectedQuestions((prev) => [...prev, newQuestion._id]);
    setActiveTab("select");
  };

  const getBadgeClass = (level) => {
    switch (level) {
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

  if (!test) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`📝 Gán câu hỏi cho bài thi: ${test.title}`}
    >
      <div className="assign-questions-modal grid-container">
        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === "select" ? "active" : ""}`}
            onClick={() => setActiveTab("select")}
          >
            Chọn câu hỏi có sẵn
          </button>
          <button
            className={`tab-btn ${activeTab === "create" ? "active" : ""}`}
            onClick={() => setActiveTab("create")}
          >
            Tạo câu hỏi mới
          </button>
        </div>
        <div className="modal-body">
          <div className="left-column">
            <div className="search-box mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Tìm kiếm câu hỏi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="action-buttons mb-2 d-flex align-items-center">
              <input
                type="number"
                min="1"
                placeholder="Nhập số câu"
                value={randomCount}
                onChange={(e) => setRandomCount(e.target.value)}
                className="form-control mr-2"
                style={{ width: "150px" }}
              />
              <button
                className="btn btn-warning"
                onClick={() => handleRandomSelect(Number(randomCount))}
              >
                Chọn ngẫu nhiên
              </button>
              <button
                className="btn btn-outline-secondary ml-2"
                onClick={() => setSelectedQuestions([])}
              >
                Bỏ chọn tất cả
              </button>
            </div>

            <div className="questions-list">
              {filteredQuestions.length === 0 ? (
                <p className="empty-message">Không tìm thấy câu hỏi nào</p>
              ) : (
                filteredQuestions.map((question) => (
                  <div key={question._id} className="question-item">
                    <label className="question-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.includes(question._id)}
                        onChange={() => handleToggleQuestion(question._id)}
                      />
                      <div className="question-content">
                        <p className="question-text">{question.question}</p>
                        <div className="question-tags">
                          <span className="badge badge-secondary">
                            {question.category}
                          </span>
                          <span
                            className={`badge ${getBadgeClass(question.level)}`}
                          >
                            {question.level}
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right column: Selected questions */}
          <div className="right-column">
            <h5>Câu hỏi đã chọn ({questionOfTest.length})</h5>
            {questionOfTest.length === 0 ? (
              <p className="empty-message">Chưa chọn câu hỏi nào</p>
            ) : (
              questionOfTest.map((id) => {
                const q = questions.find((q) => q._id === id);
                return (
                  <div key={id} className="selected-question-item">
                    <span>{q?.question}</span>
                    <button
                      className="btn btn-outline-danger btn-sm ml-2"
                      onClick={() => handleRemoveQuestion(q._id)}
                    >
                      Xóa
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer action buttons */}
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AssignQuestionsModal;
