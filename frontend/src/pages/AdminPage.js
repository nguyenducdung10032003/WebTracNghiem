import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import Header from "../components/Header";
import TestHistoryTable from "../components/TestHistoryTable";
import Modal from "../components/Modal";
import AddTestForm from "../components/AddTestForm";
import EditTestForm from "../components/EditTestForm";
import AddQuestionForm from "../components/AddQuestionForm";
import EditQuestionForm from "../components/EditQuestionForm";
import AssignQuestionsModal from "../components/AssignQuestionsModal";
import { useQuiz } from "../contexts/QuizContext";
import "./css/AdminPage.css";
import Pagination from "../components/Paging";
import PerformanceStatsTable from "../components/PerformanceStatsTable";
import * as questionService from "../../src/services/questionService";

function AdminPage() {
  const [activeTab, setActiveTab] = useState("tests");
  const {
    questions = [],
    tests,
    testHistory,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addTest,
    updateTest,
    deleteTest,
    assignQuestionsToTest,
    fetchTests,
    fetchQuestions,
    currentPage,
    setCurrentPage,
    setQuestions,
    totalPages,
    totalTests = 0,
    totalQuestions = 0,
  } = useQuiz();

  // Modal states
  const [isAddTestModalOpen, setIsAddTestModalOpen] = useState(false);
  const [isEditTestModalOpen, setIsEditTestModalOpen] = useState(false);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [isEditQuestionModalOpen, setIsEditQuestionModalOpen] = useState(false);
  const [isAssignQuestionsModalOpen, setIsAssignQuestionsModalOpen] =
    useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentTest, setCurrentTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [debouncedSearch] = useDebounce(searchKeyword, 500);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

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

  // Test handlers
  const handleAddTest = async (testData) => {
    addTest(testData);
    await fetchTests(currentPage);
    setIsAddTestModalOpen(false);
  };

  const handleEditTest = (test) => {
    setCurrentTest(test);
    setIsEditTestModalOpen(true);
  };

  const handleSaveTest = (testData) => {
    updateTest(testData);
    setIsEditTestModalOpen(false);
    setCurrentTest(null);
  };

  const handleDeleteTest = async (testId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài thi này?")) {
      await deleteTest(testId);
      await fetchTests(currentPage);
    }
  };

  const handleAssignQuestions = (test) => {
    setCurrentTest(test);
    setIsAssignQuestionsModalOpen(true);
  };

  // Question handlers
  const handleAddQuestion = async (questionData) => {
    addQuestion(questionData);
    await fetchQuestions();
    setIsAddQuestionModalOpen(false);
  };

  const handleEditQuestion = (question) => {
    setCurrentQuestion(question);
    setIsEditQuestionModalOpen(true);
  };

  const handleSaveQuestion = (questionData) => {
    updateQuestion(questionData);
    setIsEditQuestionModalOpen(false);
    setCurrentQuestion(null);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
      await deleteQuestion(questionId);
      await fetchQuestions();
    }
  };
  // useEffect(() => {
  //   // fetchTests(currentPage, debouncedSearch);
  //   fetchTests(currentPage, 6, debouncedSearch);
  // }, [debouncedSearch, currentPage]);
  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        const res = await questionService.fetchAllQuestions(
          "",
          selectedCategory,
          selectedLevel
        );
        setQuestions(res.data.questions);
        await fetchTests(currentPage, 6, debouncedSearch, {
          signal: controller.signal,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
        }
      }
    };

    loadData();

    return () => controller.abort();
  }, [
    debouncedSearch,
    currentPage,
    fetchTests,
    selectedCategory,
    selectedLevel,
  ]);
  return (
    <div className="admin-page">
      <Header title="Admin Dashboard" />

      <div className="container">
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon questions-icon">📝</div>
            <div className="stat-info">
              <p className="stat-label">Tổng câu hỏi</p>
              <p className="stat-value">{totalQuestions}</p>
            </div>
          </div>

          {/* <div className="stat-card">
            <div className="stat-icon users-icon">👥</div>
            <div className="stat-info">
              <p className="stat-label">Học viên</p>
              <p className="stat-value">156</p>
            </div>
          </div> */}

          <div className="stat-card">
            <div className="stat-icon tests-icon">📊</div>
            <div className="stat-info">
              <p className="stat-label">Bài thi</p>
              <p className="stat-value">{totalTests}</p>
            </div>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === "tests" ? "active" : ""}`}
            onClick={() => setActiveTab("tests")}
          >
            Quản lý bài thi
          </button>
          <button
            className={`tab-btn ${activeTab === "questions" ? "active" : ""}`}
            onClick={() => setActiveTab("questions")}
          >
            Quản lý câu hỏi
          </button>
          <button
            className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Lịch sử thi
          </button>
        </div>

        {activeTab === "tests" && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Quản lý bài thi</h2>
              <input
                type="text"
                className="form-control search-input"
                placeholder="🔍 Tìm kiếm bài thi..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                style={{
                  maxWidth: "300px",
                  marginLeft: "auto",
                  marginRight: "1rem",
                }}
              />
              <button
                className="btn btn-primary"
                onClick={() => setIsAddTestModalOpen(true)}
              >
                ➕ Thêm bài thi
              </button>
            </div>
            <div className="tests-grid">
              {tests.length === 0 ? (
                <div className="empty-state">
                  <p>Chưa có bài thi nào. Hãy tạo bài thi mới.</p>
                </div>
              ) : (
                tests.map((test) => (
                  <div key={test._id} className="admin-test-card">
                    <div className="admin-test-header">
                      <h3>{test.title}</h3>
                      <span className={`badge ${getBadgeClass(test.level)}`}>
                        {test.level}
                      </span>
                    </div>
                    <div className="admin-test-body">
                      <p>
                        Số câu hỏi: {test.questions?.length ?? 0}/
                        {test.question ?? 0}
                      </p>
                      <p>Thời gian: {test.duration} phút</p>
                    </div>
                    <div className="admin-test-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEditTest(test)}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAssignQuestions(test)}
                      >
                        📝 Câu hỏi
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteTest(test._id)}
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Pagination
              page={currentPage}
              setPage={setCurrentPage}
              total={totalPages}
            />
          </div>
        )}

        {activeTab === "questions" && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Danh sách câu hỏi</h2>
              <div
                className="filter-controls"
                style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
              >
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-select"
                >
                  <option value="">-- Tất cả danh mục --</option>
                  <option value="grammar">Ngữ pháp</option>
                  <option value="listening">Nghe</option>
                  <option value="reading">Đọc hiểu</option>
                  <option value="vocabulary">Từ vựng</option>
                </select>

                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="form-select"
                >
                  <option value="">-- Tất cả cấp độ --</option>
                  <option value="beginner">Cơ bản</option>
                  <option value="intermediate">Trung cấp</option>
                  <option value="advanced">Nâng cao</option>
                </select>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setIsAddQuestionModalOpen(true)}
              >
                ➕ Thêm câu hỏi
              </button>
            </div>
            <div className="questions-list">
              {totalQuestions === 0 || !questions || questions.length === 0 ? (
                <div className="empty-state">
                  <p>Chưa có câu hỏi nào. Hãy thêm câu hỏi mới.</p>
                </div>
              ) : (
                questions.map((question) => (
                  <div key={question._id} className="question-item">
                    <div className="question-content">
                      <p className="question-text">{question.question}</p>
                      <div className="options-grid">
                        {question.options.map((option, index) => (
                          <div
                            key={index}
                            className={`option-box ${
                              Array.isArray(question.correctAnswer) &&
                              question.correctAnswer.includes(index)
                                ? "correct"
                                : ""
                            }`}
                          >
                            {String.fromCharCode(65 + index)}. {option}
                          </div>
                        ))}
                      </div>
                      <div className="question-tags">
                        <span
                          className={`badge ${getBadgeClass(question.level)}`}
                        >
                          {question.level}
                        </span>
                        <span className="badge badge-secondary">
                          {question.category}
                        </span>
                      </div>
                    </div>
                    <div className="question-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEditQuestion(question)}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteQuestion(question._id)}
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="admin-section">
            <h2>Lịch sử thi của học viên</h2>
            <PerformanceStatsTable history={testHistory} />
            <TestHistoryTable history={testHistory} showUser={true} />
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isAddTestModalOpen}
        onClose={() => setIsAddTestModalOpen(false)}
        title="Thêm bài thi mới"
      >
        <AddTestForm
          onAddTest={handleAddTest}
          onCancel={() => setIsAddTestModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditTestModalOpen}
        onClose={() => setIsEditTestModalOpen(false)}
        title="Chỉnh sửa bài thi"
      >
        <EditTestForm
          test={currentTest}
          onSaveTest={handleSaveTest}
          onCancel={() => setIsEditTestModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isAddQuestionModalOpen}
        onClose={() => setIsAddQuestionModalOpen(false)}
        title="Thêm câu hỏi mới"
      >
        <AddQuestionForm
          onAddQuestion={handleAddQuestion}
          onCancel={() => setIsAddQuestionModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditQuestionModalOpen}
        onClose={() => setIsEditQuestionModalOpen(false)}
        title="Chỉnh sửa câu hỏi"
      >
        <EditQuestionForm
          question={currentQuestion}
          onSaveQuestion={handleSaveQuestion}
          onCancel={() => setIsEditQuestionModalOpen(false)}
        />
      </Modal>

      <AssignQuestionsModal
        test={currentTest}
        questions={questions}
        isOpen={isAssignQuestionsModalOpen}
        onClose={() => setIsAssignQuestionsModalOpen(false)}
        onSave={assignQuestionsToTest}
        onAddQuestion={handleAddQuestion}
      />
    </div>
  );
}

export default AdminPage;
