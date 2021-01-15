import { ipcRenderer } from "electron";
import { useAsync } from "./async";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function useIpcInvoke<T = any>(channel: string, ...args: any[]) {
  return useAsync<T>(async () => ipcRenderer.invoke(channel, ...args), args);
}
