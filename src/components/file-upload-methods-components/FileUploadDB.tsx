import { Button } from "@/components/ui/button";
import { useState } from "react";

type Visibility = "hidden" | "in" | "out";

type ElementAnimation = {
  db: {
    uploadBtn: Visibility;
    uploadBox: Visibility;
    resultBox: Visibility;
  };
};
type BoxName = keyof ElementAnimation;
type ElementName = keyof ElementAnimation["db"];

const animClass = (v: Visibility) =>
  v === "in" ? "fade-in" : v === "out" ? "fade-out" : "hidden";

export default function FileUploadDB() {
  const [element, setElementAnimation] = useState<ElementAnimation>({
    db: {
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
    <div className="db-section full-h-wall">
      <Button
        className={animClass(element.db.uploadBtn)}
        onClick={() => {
          changeElementVisibility("db", "uploadBtn", "out");
          setTimeout(() => {
            changeElementVisibility("db", "uploadBox", "in");
          }, 1000);
        }}
      >
        DB
      </Button>

      <div
        className={animClass(element.db.uploadBox)}
        onClick={() => {
          changeElementVisibility("db", "uploadBox", "out");
          setTimeout(() => {
            changeElementVisibility("db", "resultBox", "in");
          }, 1000);
        }}
      >
        upload box
      </div>

      <div
        className={animClass(element.db.resultBox)}
        onClick={() => {
          changeElementVisibility("db", "resultBox", "out");
          setTimeout(() => {
            changeElementVisibility("db", "uploadBtn", "in");
          }, 1000);
        }}
      >
        result box
      </div>
    </div>
  );
}