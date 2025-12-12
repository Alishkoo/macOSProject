import { useState } from "react";
import { Folder, FileText, ChevronRight } from "lucide-react";

const folders = [
  { id: 1, name: "Projects", items: 12 },
  { id: 2, name: "Documents", items: 8 },
  { id: 3, name: "Downloads", items: 24 },
  { id: 4, name: "Desktop", items: 15 },
];

const files = [
  { id: 1, name: "Resume.pdf", size: "245 KB", modified: "Dec 10, 2025" },
  { id: 2, name: "Portfolio.sketch", size: "12.4 MB", modified: "Dec 8, 2025" },
  { id: 3, name: "Notes.txt", size: "8 KB", modified: "Dec 12, 2025" },
  { id: 4, name: "Project-Plan.docx", size: "1.2 MB", modified: "Dec 5, 2025" },
];

const FinderContent = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);

  return (
    <div className="flex h-full bg-white">
      <div className="w-48 bg-gray-50 border-r border-gray-200 p-3">
        <div className="mb-4">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
            Favorites
          </p>
          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => setSelectedFolder(folder.id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer mb-1 ${
                selectedFolder === folder.id
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200"
              }`}
            >
              <Folder size={16} />
              <span className="text-sm">{folder.name}</span>
              <span className="ml-auto text-xs text-gray-500">
                {folder.items}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <span>Home</span>
          <ChevronRight size={14} />
          <span className="font-semibold">
            {selectedFolder
              ? folders.find((f) => f.id === selectedFolder)?.name
              : "All Files"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-1">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <FileText size={18} className="text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">{file.name}</p>
              </div>
              <span className="text-xs text-gray-500">{file.size}</span>
              <span className="text-xs text-gray-500 w-28">
                {file.modified}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinderContent;
