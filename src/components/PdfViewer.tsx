import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import DownloadIcon from "@mui/icons-material/Download";

interface PdfViewerProps {
  pdfUrl: string | null;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl }) => {
  const [zoom, setZoom] = useState(100);

  if (!pdfUrl) return <p>No PDF selected</p>;

  const absoluteUrl = pdfUrl.startsWith("/")
    ? pdfUrl
    : `/${pdfUrl}`;

  const zoomedUrl = `${absoluteUrl}#zoom=${zoom}`;

  const handleZoomIn = () => {
    setZoom((prev) => prev + 10);
  };

  const handleZoomOut = () => {
    setZoom((prev) => (prev > 50 ? prev - 10 : prev));
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = absoluteUrl;
    link.download = absoluteUrl.split("/").pop() || "document.pdf";
    link.click();
  };

  return (
    <Box>
      {/* Controls */}
      <Box display="flex" justifyContent="flex-end" gap={1} mb={1}>
        <Button
          size="small"
          onClick={handleZoomOut}
          startIcon={<ZoomOutIcon sx={{ fontSize: 16 }} />}
          sx={{
            fontSize: 11,
            minHeight: 28,
            px: 1.2,
            textTransform: "none",
          }}
        >
          Zoom Out
        </Button>

        <Button
          size="small"
          onClick={handleZoomIn}
          startIcon={<ZoomInIcon sx={{ fontSize: 16 }} />}
          sx={{
            fontSize: 11,
            minHeight: 28,
            px: 1.2,
            textTransform: "none",
          }}
        >
          Zoom In
        </Button>

        <Button
          size="small"
          onClick={handleDownload}
          startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
          sx={{
            fontSize: 11,
            minHeight: 28,
            px: 1.2,
            textTransform: "none",
          }}
        >
          Download
        </Button>

      </Box>

      {/* 🔥 Force Reload with key */}
      <iframe
        key={zoom}   // 👈 important
        src={zoomedUrl}
        title="PDF Viewer"
        width="100%"
        height="500px"
        style={{ border: "1px solid #ccc", borderRadius: 6 }}
      />
    </Box>
  );
};

export default PdfViewer;
