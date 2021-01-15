import { ipcRenderer } from "electron";
import { useEffect } from "react";
import { useIpcInvoke } from "../hooks/ipc";
import { ListGroup } from "react-bootstrap";

export const History = () => {
  const [clipboardHistory, loaded] = useIpcInvoke<string[]>("get-history");

  function copy(content: string) {
    ipcRenderer.invoke("copy", content);
  }

  useEffect(() => {
    setTimeout(() => {
      ipcRenderer.invoke("loaded", document.body.offsetHeight);
    }, 0);
  }, [clipboardHistory]);

  useEffect(() => {
    document.onkeyup = (e) => {
      if (e.key.toLowerCase() === "escape") {
        ipcRenderer.invoke("close");
      }

      const number = Number(e.key);
      if (isNaN(number) || !clipboardHistory) {
        return;
      } else {
        const content = clipboardHistory[number - 1];
        if (content) {
          copy(content);
        }
      }
    };

    return () => (document.onkeyup = undefined);
  }, [clipboardHistory]);

  if (!loaded) return <></>;

  return (
    <ListGroup>
      {clipboardHistory.map((h, i) => (
        <ListGroup.Item action key={i} onClick={() => copy(h)}>
          <div
            style={{
              display: "block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <span className="mr-2">{i + 1}|</span>
            <span>{h.trimStart()}</span>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};
