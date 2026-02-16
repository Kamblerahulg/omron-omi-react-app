import { useEffect, useState } from "react";
import { getFiles } from "../api/omiApi";

interface FileDropdownProps {
  value: string | null;
  onSelect: (baseName: string) => void;
}

const FileDropdown: React.FC<FileDropdownProps> = ({
  value,
  onSelect,
}) => {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFiles()
      .then(setFiles)
      .catch((err) => console.error("Failed to load files", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <select
      value={value ?? ""}
      style={{ width: 300, height: 40 }}
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="">
        {loading ? "Loading..." : "-- Select Document --"}
      </option>

      {files.map((baseName) => (
        <option key={baseName} value={baseName}>
          {baseName}
        </option>
      ))}
    </select>
  );
};

export default FileDropdown;
