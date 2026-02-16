import axios from "axios";

const API_BASE = "http://localhost:4000";

/**
 * Returns base names
 * Example: ["ACTON_1", "PT ASTOM INDONESIA_1"]
 */
export const getFiles = async (): Promise<string[]> => {
  const res = await axios.get<string[]>(`${API_BASE}/files`);
  return res.data;
};

/**
 * Build PDF URL from base name (served from /public/S3)
 */
export const getPdfUrl = (baseName: string): string => {
  return `/S3/${encodeURIComponent(baseName)}.pdf`;
};

export const getJsonData = async (baseName: string): Promise<any> => {
  const res = await fetch(`/S3/${encodeURIComponent(baseName)}.json`);

  if (!res.ok) {
    throw new Error(`Failed to load JSON for ${baseName}`);
  }

  return res.json();
};

export const rejectFile = async ({
  fileName,
  reason,
  targetBucket,
}: {
  fileName: string | null;
  reason: string;
  targetBucket: string;
}) => {
  if (!fileName) throw new Error("File name missing");

  const response = await fetch("/api/reject", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName,
      reason,
      targetBucket,
    }),
  });

  if (!response.ok) {
    throw new Error("Reject API failed");
  }

  return response.json();
};


