import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const getTransactions = () => API.get("/transactions");
export const addTransaction = (data) => API.post("/transactions", data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);

export const updateTransaction = async (title, data) => {
  const res = await axios.put(
    `http://localhost:5000/transactions/${title}`,
    data
  );
  return res.data;

};