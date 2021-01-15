import { clipboard } from "electron";

export let history: string[] = [];
let watcher: NodeJS.Timeout;

export const toggleClipboardWatcher = (enable: boolean) => {
  if (watcher) {
    clearInterval(watcher);
  }

  if (enable) {
    watcher = setInterval(() => {
      const text = clipboard.readText();
      if (!text || history[0] === text) {
        return;
      }

      history = [text, ...history].slice(0, 10);
    }, 500);
  }
};
