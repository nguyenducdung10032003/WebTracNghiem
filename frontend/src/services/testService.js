import axios from "axios";

const API_URL = "http://localhost:9999/api/tests";

export const fetchTests = (page = 1, limit = 6, searchTerm = "") =>
  axios.get(API_URL, {
    params: {
      page,
      limit,
      search: searchTerm
    }
  });
export const createTest = (testData) => axios.post(API_URL, testData);
export const deleteTest = (id) => axios.delete(`${API_URL}/${id}`);
export const updateTest = (id,testData) => axios.put(`${API_URL}/${id}`, testData);
export const addQuestionToTest = (id,questionIds) => axios.put(`${API_URL}/questions/${id}`, questionIds);
export const deleteQuestionToTest = (testId, questionId) => axios.put(`${API_URL}/question/${testId}`, { questionId });
