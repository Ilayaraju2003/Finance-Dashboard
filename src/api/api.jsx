import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // or your deployed backend
});

export const getTransactions = () => API.get("/transactions");

export const addTransaction = (data) =>
  API.post("/transactions", data);

export const deleteTransaction = (id) =>
  API.delete(`/transactions/${id}`);

export const updateTransaction = (id, data) =>
  API.put(`/transactions/${id}`, data);