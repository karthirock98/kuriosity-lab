import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import MethodExplanationCard from "./MethodExplanationCard";
import objContent from "@/assets/content/obj-upload.md?raw";
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
  obj: {
    uploadBtn: Visibility;
    uploadSteps: Visibility;
    uploadBox: Visibility;
    progressBox: Visibility;
    resultBox: Visibility;
  };
};
const initialElementAnimation: ElementAnimation = {
  obj: {
    uploadBtn: "in",
    uploadSteps: "hidden",
    uploadBox: "hidden",
    progressBox: "hidden",
    resultBox: "hidden",
  },
};
type BoxName = keyof ElementAnimation;
type ElementName = keyof ElementAnimation["obj"];

const fileStatusService = fileStatusServices.obj;

const animClass = (v: Visibility) =>
  v === "in" ? "fade-in" : v === "out" ? "fade-out" : "hidden";

const FileUploadObj = () => {
  const messages = useFileStatusMsgProcess("obj");
  const [element, setElementAnimation] = useState<ElementAnimation>({
    obj: {
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
        const response = await uploadImageApi(payload, "obj");
        console.log(response);
        if (response) {
          // obj mode wraps its result: { data: { objResponse, response } }
          const image = await getImageById(response.data?.data?.response?.insertId);
          if (image) {
            const url = URL.createObjectURL(image);
            setUploadedImage(url);
          }
          changeElementVisibility("obj", "progressBox", "out");
          setTimeout(() => {
            changeElementVisibility("obj", "resultBox", "in");
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
      if (data.mode !== "obj") return;
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
    changeElementVisibility("obj", "resultBox", "out");
    setTimeout(() => {
      changeElementVisibility("obj", "uploadBtn", "in");
    }, 1000);
    setElementAnimation(initialElementAnimation)
  };

  return (
    <div className="obj-section full-h-wall">
      <Button
        className={animClass(element.obj.uploadBtn) + " w-max!"}
        onClick={() => {
          changeElementVisibility("obj", "uploadBtn", "out");
          setTimeout(() => {
            changeElementVisibility("obj", "uploadSteps", "in");
          }, 1000);
        }}
      >
        Obj
      </Button>

      <div className={animClass(element.obj.uploadSteps)}>
        <MethodExplanationCard
          title="Object Storage File Upload"
          subtitle="Understand how files are uploaded, validated, and stored in Backblaze object storage."
          content={objContent}
          onAccept={() => {
            {
              changeElementVisibility("obj", "uploadSteps", "out");
              setTimeout(() => {
                changeElementVisibility("obj", "uploadBox", "in");
              }, 1000);
            }
          }}
          onDecline={() => {
            {
              changeElementVisibility("obj", "uploadSteps", "out");
              setTimeout(() => {
                changeElementVisibility("obj", "uploadBtn", "in");
              }, 1000);
            }
          }}
        />
      </div>

      <div className={animClass(element.obj.uploadBox)} onClick={() => {}}>
        <FileDropBox
          selectedFile={selectedFile}
          onBack={() => {
            changeElementVisibility("obj", "uploadBox", "out");
            setTimeout(() => {
              changeElementVisibility("obj", "uploadSteps", "in");
            }, 1000);
          }}
          onProceed={() => {
            fileStatusService.initialize(allmessages.obj);
            upload();
            changeElementVisibility("obj", "progressBox", "in");
            setTimeout(() => {
              changeElementVisibility("obj", "uploadBox", "out");
            }, 500);
          }}
          onFileSelect={(file) => {
            setSelectedFile(file);
          }}
        />
      </div>

      {/* progress box */}
      <div className={animClass(element.obj.progressBox)}>
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
        className={`image-frame ${animClass(element.obj.resultBox)}`}
        onClick={() => {
          changeElementVisibility("obj", "resultBox", "out");
          setTimeout(() => {
            changeElementVisibility("obj", "uploadBtn", "in");
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

export default FileUploadObj;
