
import "@/assets/css/file-details-card.scss"
import { Trash2 } from "lucide-react";

export interface FileCardProps {
  name: string;
  size: number;
  type: string;
  deleteFile: () => void
}

export default function FileDetailsCard({ name, size, type, deleteFile }: FileCardProps) {
  return (
    <div className="fcard-card mx-auto">
      <div className="fcard-head">
        <div className="fcard-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
            <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
          </svg>
        </div>
        <div className="w-full">
          <div className="flex justify-between">
            <p className="fcard-label">Name</p>
            <Trash2 onClick={deleteFile} size="14px" className="text-red-500 cursor-pointer" />
          </div>
          <p className="fcard-name">{name}</p>
        </div>
      </div>

      <div className="fcard-details">
        <div className="fcard-row">
          <span className="fcard-key">Size</span>
          <span className="fcard-value">
             {(size / 1024).toFixed(2)} KB
          </span>
        </div>
        <div className="fcard-row">
          <span className="fcard-key">Type</span>
          <span className="fcard-value">{type}</span>
        </div>
      </div>
    </div>
  );
}

// Usage:
// <FileCard name="report.pdf" size="2.4 MB" type="PDF document" />