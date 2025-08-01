import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import TestCard from "../components/TestCard";
import TestHistoryTable from "../components/TestHistoryTable";
import { useQuiz } from "../contexts/QuizContext";
import { useAuth } from "../contexts/AuthContext";
import "./css/DashboardPage.css";
import AIChat from "../components/AIChat";
import AISettings from "../components/AISetting";
import Pagination from "../components/Paging";
import { useDebounce } from "use-debounce";

function DashboardPage() {
  const [activeTab, setActiveTab] = useState("tests");
  const {
    startTest,
    testHistory,
    testResults,
    resetQuiz,
    tests,
    currentPage,
    setCurrentPage,
    totalPages,
    fetchTests,
  } = useQuiz();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearch] = useDebounce(searchKeyword, 500);
  const { user } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (testResults) {
  //     resetQuiz();
  //   }
  //   fetchTests(currentPage, 6);
  // }, [testResults, resetQuiz, currentPage]);

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
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
  }, [debouncedSearch, currentPage, fetchTests]);
  const handleStartTest = async (test) => {
    // await startTest(test);
    navigate(`/test/${test._id}`);
  };

  // Filter history for current user
  const userHistory =
    user && Array.isArray(testHistory)
      ? testHistory.filter((history) => history.userId === user._id)
      : [];

  return (
    <div className="dashboard-page">
      <Header title="Bảng điều khiển học viên" />
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
      <div className="container">
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === "tests" ? "active" : ""}`}
            onClick={() => setActiveTab("tests")}
          >
            📝 Bài thi
          </button>
          <button
            className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            📊 Lịch sử thi
          </button>
          <button
            className="tab-btn ai-btn"
            onClick={() => setIsAIChatOpen(true)}
          >
            🤖 Trợ lý AI
          </button>
        </div>

        {activeTab === "tests" && (
          <div className="tests-grid">
            {tests.map((test) => (
              <TestCard
                key={test._id}
                test={test}
                onStartTest={handleStartTest}
              />
            ))}
          </div>
        )}

        {activeTab === "history" && (
          <div className="history-section">
            <h2>Lịch sử thi</h2>
            <TestHistoryTable history={userHistory} />
          </div>
        )}

        <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
        {/* <AISettings
          isOpen={isAISettingsOpen}
          onClose={() => setIsAISettingsOpen(false)}
        /> */}
      </div>
      {activeTab === "tests" && (
        <Pagination
          page={currentPage}
          setPage={setCurrentPage}
          total={totalPages}
        />
      )}
    </div>
  );
}

export default DashboardPage;
