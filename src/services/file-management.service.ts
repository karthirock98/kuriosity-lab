import apiAxios from "./api-axios";
import { useSyncExternalStore } from "react";

const BASE_URL = "http://localhost:3333";

export const uploadImageApi = async (payload: FormData, mode: string) => {
  const res = await apiAxios.post(
    `${BASE_URL}/generic/upload-images?mode=${mode}`,
    payload,
  );
  return res;
};

export const getImageById = async (id: number) => {
  const res = await apiAxios.get(
    `${BASE_URL}/generic/get-images-by-id?id=${id}`, {responseType: 'blob'}
  );
  return res.data;
};

export interface FileStatusMessage {
  id: number;
  msg: string;
  status: "pending" | "completed" | "processing" | "failed";
}

let messages: FileStatusMessage[] = [];

const listeners = new Set<() => void>();

export const fileStatusService = {
  initialize: (allmessages: string[]) => {
    messages = allmessages.map((msg, index) => ({
      id: index + 1,
      msg,
      status: "pending",
    }));

    notify();
  },
  getMessages: () => messages,
  updateStatus: (id: number, status: FileStatusMessage["status"]) => {
    messages = messages.map((item) => {
      return item.id === id ? { ...item, status } : item;
    });
    notify();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  reset: () => {
    messages = messages.map((item) => ({
      ...item,
      status: "pending",
    }));

    notify();
  },
};

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const useFileStatusMsgProcess = () => {
  return useSyncExternalStore(
    fileStatusService.subscribe,
    fileStatusService.getMessages,
  );
};
