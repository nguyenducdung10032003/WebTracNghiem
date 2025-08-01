import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { mockTestHistory } from "../data/mockData";
import { useAuth } from "./AuthContext";
import * as testService from "../services/testService";
import * as questionService from "../services/questionService";
import * as historyService from "../services/historyService";

const QuizContext = createContext();

export function QuizProvider({ children }) {
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [currentTest, setCurrentTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [testResults, setTestResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [testHistory, setTestHistory] = useState(mockTestHistory);
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTests, setTotalTests] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [totalHistory, setTotalHistory] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [mostFrequentLevel, setMostFrequentLevel] = useState([]);
  const [tilteLastes, setTilteLastes] = useState([]);
  const fetchTests = useCallback(
    async (page, limit, searchTerm = "") => {
      console.log("fetchTests called with", { page, limit, searchTerm });
      try {
        const res = await testService.fetchTests(page, limit, searchTerm);
        setTests(res.data.tests || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalTests(res.data.total);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    },
    [] // Empty dependency array để hàm không bị tạo lại
  );
  // const fetchTests = useCallback(
  //   async (page, limit, searchTerm = "") => {
  //     console.log("fetchTests called with", { page, limit, searchTerm });
  //     try {
  //       const res = await testService.fetchTests(page, limit, searchTerm);

  //       if (JSON.stringify(res.data.tests) !== JSON.stringify(tests)) {
  //         setTests(res.data.tests || []);
  //       }
  //       if (res.data.totalPages !== totalPages) {
  //         setTotalPages(res.data.totalPages || 1);
  //       }
  //       if (res.data.total !== totalTests) {
  //         setTotalTests(res.data.total);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching tests:", error);
  //     }
  //   },
  //   [tests, totalPages, totalTests]
  // );
  const fetchQuestions = async () => {
    try {
      const res = await questionService.fetchAllQuestions();
      setQuestions(res.data.questions);
      setTotalQuestions(res.data.total);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  const fetchHistory = async (
    sortField = "completedAt",
    sortOrder = "desc"
  ) => {
    try {
      const res = await historyService.getHistory(
        sortField,
        sortOrder,
        user.id,
        user.role
      );
      setTestHistory(res.data.histories);
      setTotalHistory(res.data.countHistories);
      setAverageScore(res.data.averageScore);
      setMostFrequentLevel(res.data.mostFrequentLevel);
      setTilteLastes(res.data.tilteLastes);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };
  const addQuestion = async (questionData) => {
    try {
      await questionService.createQuestion(questionData);
      const updated = await questionService.fetchAllQuestions();
      setQuestions(updated.data.tests);
      fetchQuestions();
      alert("Thêm câu hỏi thành công!");
    } catch (err) {
      alert("Thêm câu hỏi thất bại!");
    }
  };

  const updateQuestion = async (question) => {
    try {
      const dataToUpdate = {
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        level: question.level,
        category: question.category,
        testId: question.testId,
      };
      await questionService.updateQuestion(question._id, dataToUpdate);
      fetchQuestions();
      alert("Cập nhật câu hỏi thành công!");
    } catch (error) {
      alert("Cập nhật câu hỏi thất bại!");
    }
  };

  const deleteQuestion = async (id) => {
    await questionService.deleteQuestion(id);
    try {
      alert("Xóa thành công!");
      await fetchTests(currentPage);
    } catch (error) {
      console.error("Lỗi khi xóa câu hỏi:", error);
      alert("Xóa thất bại!");
    }
  };

  const addTest = async (testData) => {
    try {
      await testService.createTest(testData);
      const addtest = await testService.fetchTests();
      setTests(addtest.data.tests);
      await fetchTests(currentPage, itemsPerPage);
      alert("Thêm bài test thành công!");
    } catch (error) {
      alert("Thêm bài test thất bại!");
    }
  };

  const updateTest = async (test) => {
    try {
      const dataToUpdate = {
        title: test.title,
        question: test.question,
        duration: test.duration,
        level: test.level,
      };
      await testService.updateTest(test._id, dataToUpdate);
      await fetchTests(currentPage);
      alert("Cập nhật câu hỏi thành công!");
    } catch (error) {
      alert("Cập nhật câu hỏi thất bại!");
    }
  };

  const deleteTest = async (id) => {
    await testService.deleteTest(id);
    try {
      alert("Xóa thành công!");
      await fetchTests(currentPage);
    } catch (error) {
      console.error("Lỗi khi xóa test:", error);
      alert("Xóa thất bại!");
    }
  };

  const assignQuestionsToTest = async (testId, questionIds) => {
    try {
      alert(`Câu hỏi được cập nhật thành công`);
      await fetchTests(currentPage);
    } catch (error) {
      console.error("Lỗi khi thêm question vào test:", error);
      alert("Thêm câu hỏi thất bại!");
    }
  };

  const startTest = async (test) => {
    try {
      const res = await questionService.fetchQuestionsByTest(test._id);
      const testQuestions = res.data.questions;

      if (
        !testQuestions ||
        !Array.isArray(testQuestions) ||
        testQuestions.length === 0
      ) {
        alert("Không có câu hỏi nào được trả về cho test:", test._id);
        return;
      }

      setQuestions(testQuestions);
      setCurrentTest(test);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setTimeLeft(test.duration * 60);
      setTestResults(null);
    } catch (error) {
      console.error("Lỗi khi tải câu hỏi:", error);
    }
  };

  const selectAnswer = (questionId, updatedAnswers, isCorrect) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        answers: updatedAnswers,
        isCorrect,
      },
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitTest = async () => {
    if (!currentTest || !user) return;

    const correctAnswers = Object.values(userAnswers).reduce((count, ans) => {
      return ans.isCorrect ? count + 1 : count;
    }, 0);

    const results = {
      userId: user.id,
      testId: currentTest._id,
      totalQuestions: questions.length,
      correctAnswers,
      score: Math.round((correctAnswers / questions.length) * 100),
      timeSpent: currentTest.duration * 60 - timeLeft,
      userName: user.name,
      testTitle: currentTest.title,
      completedAt: new Date().toISOString(),
    };
    await historyService.addHistory(results);
    setTestResults(results);

    const newHistoryEntry = {
      ...results,
    };

    setTestHistory((prev) => [newHistoryEntry, ...prev]);

    setTestResults(results);
  };

  const resetQuiz = () => {
    setCurrentTest(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTestResults(null);
    setTimeLeft(0);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (user && user.id && user.role) {
      fetchHistory();
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    if (currentPage > 0 && itemsPerPage > 0 && isMounted) {
      fetchTests(currentPage, itemsPerPage);
    }
    return () => {
      isMounted = false;
    };
  }, [currentPage, itemsPerPage, fetchTests]);

  return (
    <QuizContext.Provider
      value={{
        questions,
        tests,
        currentTest,
        currentQuestionIndex,
        userAnswers,
        testResults,
        timeLeft,
        testHistory,
        totalTests,
        currentPage,
        totalPages,
        totalQuestions,
        totalHistory,
        averageScore,
        mostFrequentLevel,
        tilteLastes,
        setTotalQuestions,
        setQuestions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        addTest,
        updateTest,
        deleteTest,
        assignQuestionsToTest,
        startTest,
        selectAnswer,
        nextQuestion,
        prevQuestion,
        submitTest,
        setTimeLeft,
        resetQuiz,
        fetchTests,
        fetchQuestions,
        setCurrentPage,
        fetchHistory,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
