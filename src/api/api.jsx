import axios from "axios";

const API = axios.create({
  baseURL: "https://finance-dashboard-b3z6.vercel.app/",
});

const cors = require("cors");

app.use(cors({
  origin: "*"
}));

export const getTransactions = () => API.get("/transactions");

export const addTransaction = (data) =>
  API.post("/transactions", data);

export const deleteTransaction = (id) =>
  API.delete(`/transactions/${id}`);

export const updateTransaction = (id, data) =>
  API.put(`/transactions/${id}`, data);