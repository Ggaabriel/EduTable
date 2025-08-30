// src/api/axiosInstance.ts
import axios from "axios";

// Базовый инстанс
export const api = axios.create({
  baseURL: "ыыы", // реальный URL, но будем скрывать в коде
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Запрос на регионы
export const getRegions = async () => {
  try {
    // Не используем слово компании нигде кроме baseURL
    const response = await api.get("/regions");
    return response.data.data;
  } catch (err) {
    console.error("Ошибка при получении регионов:", err);
    return [];
  }
};
