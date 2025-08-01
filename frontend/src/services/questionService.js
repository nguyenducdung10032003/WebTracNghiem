import axios from "axios";

const API_URL = "http://localhost:9999/api/questions";

export const fetchQuestionsByTest = async (testId) => {
  return axios.get(`http://localhost:9999/api/questions/questions?testId=${testId}`);
};

export const fetchAllQuestions = (searchTerm = "", category, level) =>
  axios.get(API_URL, {
    params: { search: searchTerm, category, level }
  });
// export const checkAnswer = async (questionId, answer) => {
//     const res = await axios.post(`${API_URL}/answer`, {
//         questionId,
//         answer
//     });
//     return res.data;
// };
export const checkAnswer = async (questionId, answer) => {
  const res = await axios.post(`${API_URL}/answer`, {
    questionId,
    answer, 
  });
  return res.data;
};


export const createQuestion = (questionData) => axios.post(API_URL, questionData);
export const deleteQuestion = (id) => axios.delete(`${API_URL}/${id}`);
export const updateQuestion = (id,question) => axios.put(`${API_URL}/${id}`, question);
