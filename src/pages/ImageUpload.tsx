import "@/assets/css/image-upload.scss";
import FileUploadDB from "@/components/file-upload-methods-components/FileUploadDB";
import FileUploadObj from "@/components/file-upload-methods-components/FileUploadObj";
import FileUploadServer from "@/components/file-upload-methods-components/FileUploadServer";

const ImageUpload = () => {
  return (
    <>
      <div className="image-upload-main">
        <div className="sections">
            <FileUploadServer/>
            <FileUploadDB/>
            <FileUploadObj/>
        </div>
      </div>
    </>
  );
};

export default ImageUpload;
