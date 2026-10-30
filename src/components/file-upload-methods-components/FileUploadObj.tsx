import { useState } from "react";
import { Button } from "@/components/ui/button";

type Visibility = "hidden" | "in" | "out";

type ElementAnimation = {
  obj: {
    uploadBtn: Visibility;
    uploadBox: Visibility;
    resultBox: Visibility;
  };
};
type BoxName = keyof ElementAnimation;
type ElementName = keyof ElementAnimation["obj"];

const animClass = (v: Visibility) =>
  v === "in" ? "fade-in" : v === "out" ? "fade-out" : "hidden";

const FileUploadObj = () => {
  const [element, setElementAnimation] = useState<ElementAnimation>({
    obj: {
      uploadBtn: "in",     // fades in on load
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

  return (
    <div className="obj-section full-h-wall">
      <Button
        className={animClass(element.obj.uploadBtn)}
        onClick={() => {
          changeElementVisibility("obj", "uploadBtn", "out");
          setTimeout(() => {
            changeElementVisibility("obj", "uploadBox", "in");
          }, 1000);
        }}
      >
        Obj
      </Button>

      <div
        className={animClass(element.obj.uploadBox)}
        onClick={() => {
          changeElementVisibility("obj", "uploadBox", "out");
          setTimeout(() => {
            changeElementVisibility("obj", "resultBox", "in");
          }, 1000);
        }}
      >
        upload box
      </div>

      <div
        className={animClass(element.obj.resultBox)}
        onClick={() => {
          changeElementVisibility("obj", "resultBox", "out");
          setTimeout(() => {
            changeElementVisibility("obj", "uploadBtn", "in");
          }, 1000);
        }}
      >
        Result box
      </div>
    </div>
  );
};

export default FileUploadObj;