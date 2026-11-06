import axios from "axios";
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

export type FileUploadMode = "server" | "db" | "obj";

const getUploadErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message;
  }
  return error instanceof Error ? error.message : "Something Went Wrong!";
};

const createFileStatusStore = () => {
  let messages: FileStatusMessage[] = [];
  const listeners = new Set<() => void>();

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  return {
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
    // Marks the step the upload stopped at and appends the reason to its label.
    // Covers failures the server reports without a socket message.
    failCurrentStep: (error: unknown) => {
      const current =
        messages.find((item) => item.status === "failed") ??
        messages.find((item) => item.status !== "completed");
      if (!current) return;

      const reason = getUploadErrorMessage(error);
      messages = messages.map((item) =>
        item.id === current.id
          ? { ...item, status: "failed", msg: `${item.msg}: ${reason}` }
          : item,
      );
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
};

// One store per mode, so uploads running at the same time don't share steps.
export const fileStatusServices = {
  server: createFileStatusStore(),
  db: createFileStatusStore(),
  obj: createFileStatusStore(),
};

export const useFileStatusMsgProcess = (mode: FileUploadMode) => {
  const store = fileStatusServices[mode];
  return useSyncExternalStore(store.subscribe, store.getMessages);
};
