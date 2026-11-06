import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import MethodExplanationCard from "./MethodExplanationCard";
import dbContent from "@/assets/content/db-upload.md?raw";
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
  db: {
    uploadBtn: Visibility;
    uploadSteps: Visibility;
    uploadBox: Visibility;
    progressBox: Visibility;
    resultBox: Visibility;
  };
};
const initialElementAnimation: ElementAnimation = {
  db: {
    uploadBtn: "in",
    uploadSteps: "hidden",
    uploadBox: "hidden",
    progressBox: "hidden",
    resultBox: "hidden",
  },
};
type BoxName = keyof ElementAnimation;
type ElementName = keyof ElementAnimation["db"];

const fileStatusService = fileStatusServices.db;

const animClass = (v: Visibility) =>
  v === "in" ? "fade-in" : v === "out" ? "fade-out" : "hidden";

const FileUploadDB = () => {
  const messages = useFileStatusMsgProcess("db");
  const [element, setElementAnimation] = useState<ElementAnimation>({
    db: {
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
        const response = await uploadImageApi(payload, "db");
        console.log(response);
        if (response) {
          const image = await getImageById(response.data?.insertId);
          if (image) {
            const url = URL.createObjectURL(image);
            setUploadedImage(url);
          }
          changeElementVisibility("db", "progressBox", "out");
          setTimeout(() => {
            changeElementVisibility("db", "resultBox", "in");
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
      if (data.mode !== "db") return;
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
    changeElementVisibility("db", "resultBox", "out");
    setTimeout(() => {
      changeElementVisibility("db", "uploadBtn", "in");
    }, 1000);
    setElementAnimation(initialElementAnimation)
  };

  return (
    <div className="db-section full-h-wall">
      <Button
        className={animClass(element.db.uploadBtn) + " w-max!"}
        onClick={() => {
          changeElementVisibility("db", "uploadBtn", "out");
          setTimeout(() => {
            changeElementVisibility("db", "uploadSteps", "in");
          }, 1000);
        }}
      >
        DB
      </Button>

      <div className={animClass(element.db.uploadSteps)}>
        <MethodExplanationCard
          title="Database File Upload"
          subtitle="Understand how files are uploaded, validated, and stored directly in the database."
          content={dbContent}
          onAccept={() => {
            {
              changeElementVisibility("db", "uploadSteps", "out");
              setTimeout(() => {
                changeElementVisibility("db", "uploadBox", "in");
              }, 1000);
            }
          }}
          onDecline={() => {
            {
              changeElementVisibility("db", "uploadSteps", "out");
              setTimeout(() => {
                changeElementVisibility("db", "uploadBtn", "in");
              }, 1000);
            }
          }}
        />
      </div>

      <div className={animClass(element.db.uploadBox)} onClick={() => {}}>
        <FileDropBox
          selectedFile={selectedFile}
          onBack={() => {
            changeElementVisibility("db", "uploadBox", "out");
            setTimeout(() => {
              changeElementVisibility("db", "uploadSteps", "in");
            }, 1000);
          }}
          onProceed={() => {
            fileStatusService.initialize(allmessages.db);
            upload();
            changeElementVisibility("db", "progressBox", "in");
            setTimeout(() => {
              changeElementVisibility("db", "uploadBox", "out");
            }, 500);
          }}
          onFileSelect={(file) => {
            setSelectedFile(file);
          }}
        />
      </div>

      {/* progress box */}
      <div className={animClass(element.db.progressBox)}>
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
        className={`image-frame ${animClass(element.db.resultBox)}`}
        onClick={() => {
          changeElementVisibility("db", "resultBox", "out");
          setTimeout(() => {
            changeElementVisibility("db", "uploadBtn", "in");
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

export default FileUploadDB;
