// src/lib/axios.ts
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";

// Простой тип ошибки, которым мы будем оперировать в UI
export interface ApiError {
  message: string;
  status?: number;
  code?: string; // например 'NETWORK_ERROR', 'TIMEOUT', 'UNAUTHORIZED'
  original?: Error | AxiosError;
  isNetworkError?: boolean;
}

interface ServerError {
  message?: string;
  error?: string;
  detail?: string;
  code?: string;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "/",
  timeout: 10000, // 10s
  headers: {
    "Content-Type": "application/json",
  },
});

// Normalize axios error to ApiError
function normalizeError(error: Error | AxiosError): ApiError {
  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError;

    // Network error (no response)
    if (!ax.response) {
      return {
        message: ax.message || "Сетевая ошибка. Проверьте подключение.",
        code: "NETWORK_ERROR",
        isNetworkError: true,
        original: ax,
      };
    }

    const status = ax.response.status;
    const data = ax.response.data as ServerError;
    const serverMsg = data && (data.message || data.error || data.detail);

    // Timeout
    if (ax.code === "ECONNABORTED") {
      return {
        message: "Превышено время ожидания запроса.",
        status,
        code: "TIMEOUT",
        original: ax,
      };
    }

    return {
      message: serverMsg || `Ошибка ${status}`,
      status,
      code: "HTTP_ERROR",
      original: ax,
    };
  }
  else{
    // Unknown error
    return {
      message: (error as Error)?.message || "Неизвестная ошибка",
      code: "UNKNOWN",
      original: error,
    };

  }

}

// Обёртка для вызовов — возвращает уже распарсенный data или выбрасывает ApiError
export async function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  try {
    const res: AxiosResponse<T> = await axiosInstance.request<T>(config);
    return res.data;
  } catch (e: unknown) {
    const err = normalizeError(e);
    // Логирование можно оставить для dev
    if (import.meta.env.DEV) console.error("API ERROR", err);
    throw err;
  }
}

// Экспорт самого инстанса если нужно (для multipart, progress и т.д.)
export { axiosInstance };

// Экспорт типов и функций
export default request;
