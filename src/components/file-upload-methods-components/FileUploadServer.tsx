import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import MethodExplanationCard from "./MethodExplanationCard";
import serverContent from "@/assets/content/server-upload.md?raw";
import FileDropBox from "./FileDropBox";
import ZigzagProgress from "./Zigzagprogress";
import {
  fileStatusServices,
  getImageById,
  uploadImageApi,
  useFileStatusMsgProcess,
  type FileStatusMessage,
} from "@/services/file-management.service";
import { socket } from "@/services/socket.service";
import allmessages from "../../../shared/file-management-messages.json";
import { intentionalSleep } from "@/utils/generic.utils";
import { RefreshCcwIcon } from "lucide-react";

type Visibility = "hidden" | "in" | "out";

type ElementAnimation = {
  server: {
    uploadBtn: Visibility;
    uploadSteps: Visibility;
    uploadBox: Visibility;
    progressBox: Visibility;
    resultBox: Visibility;
  };
};
const initialElementAnimation: ElementAnimation = {
  server: {
    uploadBtn: "in",
    uploadSteps: "hidden",
    uploadBox: "hidden",
    progressBox: "hidden",
    resultBox: "hidden",
  },
};
type BoxName = keyof ElementAnimation;
type ElementName = keyof ElementAnimation["server"];

const fileStatusService = fileStatusServices.server;

const animClass = (v: Visibility) =>
  v === "in" ? "fade-in" : v === "out" ? "fade-out" : "hidden";

const FileUploadServer = () => {
  const messages = useFileStatusMsgProcess("server");
  const [element, setElementAnimation] = useState<ElementAnimation>({
    server: {
      uploadBtn: "in", // fades in on load
      uploadSteps: "hidden",
      uploadBox: "hidden", // no animation on load
      progressBox: "hidden", // no animation on load
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [uploadedImage, setUploadedImage] = useState<any>();
  const [uploadFailed, setUploadFailed] = useState<boolean>(false);

  const upload = async () => {
    try {
      fileStatusService.updateStatus(1, "processing");
      await intentionalSleep(1500);
      const payload = new FormData();
      if (selectedFile) {
        fileStatusService.updateStatus(1, "completed");
        fileStatusService.updateStatus(2, "processing");
        await intentionalSleep(1500);
        fileStatusService.updateStatus(2, "completed");
        payload.append("image", selectedFile);
        const response = await uploadImageApi(payload, "server");
        console.log(response);
        if (response) {
          const image = await getImageById(response.data?.insertId);
          if (image) {
            const url = URL.createObjectURL(image);
            setUploadedImage(url);
          }
          changeElementVisibility("server", "progressBox", "out");
          setTimeout(() => {
            changeElementVisibility("server", "resultBox", "in");
            fileStatusService.reset();
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      fileStatusService.failCurrentStep(error);
      setUploadFailed(true);
    }
  };

  useEffect(() => {
    const handleFileManagement = (data: {
      mode: string;
      message: string;
      step: number;
      status: FileStatusMessage["status"];
    }) => {
      // all upload sections listen on this event, so handle only our own mode
      if (data.mode !== "server") return;
      console.log("Received:", data);
      fileStatusService.updateStatus(data.step, data.status);
      if (data.status === "failed") {
        setUploadFailed(true);
      }
    };

    socket.on("file-management", handleFileManagement);

    return () => {
      socket.off("file-management", handleFileManagement);
    };
  }, []);

  const resetAll = () => {
    setUploadedImage(null);
    setSelectedFile(null);
    setUploadFailed(false);
    changeElementVisibility("server", "resultBox", "out");
    setTimeout(() => {
      changeElementVisibility("server", "uploadBtn", "in");
    }, 1000);
    setElementAnimation(initialElementAnimation)
  };

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
          selectedFile={selectedFile}
          onBack={() => {
            changeElementVisibility("server", "uploadBox", "out");
            setTimeout(() => {
              changeElementVisibility("server", "uploadSteps", "in");
            }, 1000);
          }}
          onProceed={() => {
            fileStatusService.initialize(allmessages.server);
            upload();
            changeElementVisibility("server", "progressBox", "in");
            setTimeout(() => {
              changeElementVisibility("server", "uploadBox", "out");
            }, 500);
          }}
          onFileSelect={(file) => {
            setSelectedFile(file);
          }}
        />
      </div>

      {/* progress box */}
      <div className={animClass(element.server.progressBox)}>
        <ZigzagProgress columns={2} steps={messages} />
        {uploadFailed && (
          <Button
            onClick={resetAll}
            className="flex mx-auto mt-2 -bottom-12.5 left-1/3 w-max absolute"
          >
            <RefreshCcwIcon /> Start Again
          </Button>
        )}
      </div>

      {/* result box */}
      <div
        className={`image-frame ${animClass(element.server.resultBox)}`}
        onClick={() => {
          changeElementVisibility("server", "resultBox", "out");
          setTimeout(() => {
            changeElementVisibility("server", "uploadBtn", "in");
          }, 1000);
        }}
      >
        <img src={uploadedImage} alt="Uploaded preview" />
        <span className="image-frame-label">Uploaded successfully</span>
        <Button
          onClick={resetAll}
          className="flex mx-auto mt-2 -bottom-12.5 left-1/3 w-max absolute"
        >
          <RefreshCcwIcon /> Start Again
        </Button>
      </div>
    </div>
  );
};

export default FileUploadServer;
