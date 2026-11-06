import "@/assets/css/file-drop-box.scss";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import FileDetailsCard from "./FileDetailsCard";

function FileDropBox({
  selectedFile,
  onBack,
  onFileSelect,
  onProceed,
}: {
  selectedFile: File | null;
  onBack: () => void;
  onFileSelect: (file: File | null) => void;
  onProceed: () => void;
}) {
  return (
    <>
      {selectedFile && (
        <Button className="flex ml-[10%] w-max" onClick={onBack}>
          <ArrowLeft /> Go Back
        </Button>
      )}
      {!selectedFile && (
        <div className="file-folder-container">
          <Button type="button" className="absolute -top-25" onClick={onBack}>
            <ArrowLeft /> Go Back
          </Button>
          <div className="file-folder-icon">
            <div className="file-folder-front">
              <div className="file-folder-tab"></div>
              <div className="file-folder-cover"></div>
            </div>
            <div className="file-folder-back file-folder-cover"></div>
          </div>

          <label className="file-folder-upload">
            <input
              className="file-folder-input"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  onFileSelect(file);
                }
              }}
              type="file"
            />
            Choose a file
          </label>
        </div>
      )}

      {selectedFile && (
        <>
          <div className="mt-2">
            <FileDetailsCard
              deleteFile={() => onFileSelect(null)}
              name={selectedFile.name}
              size={selectedFile.size}
              type={selectedFile.type}
            />
          </div>
          <Button className="flex ml-[70%] w-max mt-2" type="button" onClick={(e) => {e.preventDefault(); onProceed()}}>
            Next <ArrowRight />
          </Button>
        </>
      )}
    </>
  );
}

export default FileDropBox;
