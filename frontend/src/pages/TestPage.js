import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import TestTimer from "../components/TestTimer";
import { useQuiz } from "../contexts/QuizContext";
import "./css/TestPage.css";
import { useRef } from "react";

function TestPage() {
  const startTestCalled = useRef(false);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    questions,
    currentTest,
    currentQuestionIndex,
    userAnswers,
    timeLeft,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    submitTest, 
    setTimeLeft,
    tests,
    startTest,
  } = useQuiz();

  useEffect(() => {
    if (!startTestCalled.current && tests.length > 0) {
      const test = tests.find((t) => t._id === id);
      if (!test) {
        navigate("/dashboard");
        return;
      } else {
        startTest(test);
        startTestCalled.current = true;
      }
    }
  }, [id, tests, startTest, navigate]);

  if (!currentTest) return null;

  // Nếu test không có câu hỏi thì hiển thị thông báo
  if (questions === null) {
    return (
      <div className="test-page">
        <header className="test-header">
          <div className="container">
            <div className="test-header-content">
              <h1>{currentTest.title}</h1>
            </div>
          </div>
        </header>
        <div className="container">
          <div
            className="alert alert-warning"
            role="alert"
            style={{ marginTop: "2rem" }}
          >
            Bài thi này hiện chưa có câu hỏi nào. Vui lòng quay lại sau.
          </div>
        </div>
      </div>
    );
  }
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleTimeUp = async () => {
    if (!submitted) {
      setSubmitted(true);
      await submitTest();
      navigate("/results");
    }
  };

  const handleSubmit = async () => {
    if (!submitted) {
      setSubmitted(true);
      await submitTest();
      navigate("/results");
    }
  };

  return (
    <div className="test-page">
      <header className="test-header">
        <div className="container">
          <div className="test-header-content">
            <h1>{currentTest.title}</h1>
            <div className="test-header-info">
              <TestTimer
                timeLeft={timeLeft}
                onTimeUpdate={setTimeLeft}
                onTimeUp={handleTimeUp}
              />
              <span className="badge badge-secondary">
                {currentQuestionIndex + 1}/{questions.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="test-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="progress-text">
            Câu {currentQuestionIndex + 1} / {questions.length}
          </p>
        </div>

        <div className="question-container">
          <QuestionCard
            question={currentQuestion}
            userAnswers={userAnswers}
            onAnswerSelect={selectAnswer}
          />
        </div>

        <div className="test-navigation">
          <button
            className="btn btn-secondary"
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Câu trước
          </button>
          <button className="btn btn-primary submit-btn" onClick={handleSubmit}>
            Nộp bài luôn
          </button>
          {currentQuestionIndex === questions.length - 1 ? (
            <button
              className="btn btn-primary submit-btn"
              onClick={handleSubmit}
            >
              Nộp bài
            </button>
          ) : (
            <button className="btn btn-primary" onClick={nextQuestion}>
              Câu tiếp theo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestPage;
