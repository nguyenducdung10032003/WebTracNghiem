import axios from "axios";

const API_URL = "http://localhost:9999/api/history";

export const addHistory = (historyData) => axios.post(`${API_URL}/add`, historyData);
export const getHistory = (sortField = "completedAt", sortOrder = "desc", userId, role) =>
  axios.get(API_URL, {
    params: {
      sortField,
      sortOrder,
      userId,
      role
    }
  });