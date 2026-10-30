import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import MethodExplanationCard from "./MethodExplanationCard";
import serverContent from "@/assets/content/server-upload.md?raw";
import FileDropBox from "./FileDropBox";
import ZigzagProgress, { type ZigzagStep } from "./Zigzagprogress";
import { uploadImageApi } from "@/services/file-management.service";
import { socket } from "@/services/socket.service";

type Visibility = "hidden" | "in" | "out";

type ElementAnimation = {
  server: {
    uploadBtn: Visibility;
    uploadSteps: Visibility;
    uploadBox: Visibility;
    resultBox: Visibility;
  };
};
type BoxName = keyof ElementAnimation;
type ElementName = keyof ElementAnimation["server"];

const animClass = (v: Visibility) =>
  v === "in" ? "fade-in" : v === "out" ? "fade-out" : "hidden";

const FileUploadServer = () => {
  const [element, setElementAnimation] = useState<ElementAnimation>({
    server: {
      uploadBtn: "in", // fades in on load
      uploadSteps: "hidden",
      uploadBox: "hidden", // no animation on load
      resultBox: "hidden", // no animation on load
    },
  });

  const changeElementVisibility = (
    boxName: BoxName,
    elementName: ElementName,
    setTo: Visibility,
  ) => {
    setElementAnimation((prev) => ({
      ...prev,
      [boxName]: {
        ...prev[boxName],
        [elementName]: setTo,
      },
    }));
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const upload = async () => {
    const payload = new FormData();
    if (selectedFile) {
      payload.append("image", selectedFile);
      const response = await uploadImageApi(payload, "server");
      console.log(response);
    }
  };

  const [message, setMessage] = useState<ZigzagStep[]>([]);

  useEffect(() => {
    const handleFileManagement = (data: {
      mode: string;
      message: string;
      step: number;
    }) => {
      console.log("Received:", data);

      setMessage((prev) => [
        ...prev,
        {
          id: data.step,
          status: "done",
          label: data.message,
        },
      ]);
    };

    socket.on("file-management", handleFileManagement);

    return () => {
      socket.off("file-management", handleFileManagement);
    };
  }, []);

  return (
    <div className="server-section full-h-wall">
      <Button
        className={animClass(element.server.uploadBtn) + " w-max!"}
        onClick={() => {
          changeElementVisibility("server", "uploadBtn", "out");
          setTimeout(() => {
            changeElementVisibility("server", "uploadSteps", "in");
          }, 1000);
        }}
      >
        Server
      </Button>

      <div className={animClass(element.server.uploadSteps)}>
        <MethodExplanationCard
          title="Server File Upload"
          subtitle="Understand how files are uploaded, validated, and stored on the server."
          content={serverContent}
          onAccept={() => {
            {
              changeElementVisibility("server", "uploadSteps", "out");
              setTimeout(() => {
                changeElementVisibility("server", "uploadBox", "in");
              }, 1000);
            }
          }}
          onDecline={() => {
            {
              changeElementVisibility("server", "uploadSteps", "out");
              setTimeout(() => {
                changeElementVisibility("server", "uploadBtn", "in");
              }, 1000);
            }
          }}
        />
      </div>

      <div className={animClass(element.server.uploadBox)} onClick={() => {}}>
        <FileDropBox
          onBack={() => {
            changeElementVisibility("server", "uploadBox", "out");
            setTimeout(() => {
              changeElementVisibility("server", "uploadSteps", "in");
            }, 1000);
          }}
          onProceed={() => {
            upload();
            changeElementVisibility("server", "resultBox", "in");
            setTimeout(() => {
              changeElementVisibility("server", "uploadBox", "out");
            }, 500);
          }}
          onFileSelect={(file) => setSelectedFile(file)}
        />
      </div>

      <div
        className={animClass(element.server.resultBox)}
        onClick={() => {
          changeElementVisibility("server", "resultBox", "out");
          setTimeout(() => {
            changeElementVisibility("server", "uploadBtn", "in");
          }, 1000);
        }}
      >
        {/* <div>{message}</div> */}
        <ZigzagProgress columns={2} steps={message} />
      </div>
    </div>
  );
};

export default FileUploadServer;
