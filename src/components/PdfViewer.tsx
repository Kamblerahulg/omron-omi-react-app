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

  const absoluteUrl = pdfUrl.startsWith("/") ? pdfUrl : `/${pdfUrl}`;
  const zoomedUrl = `${absoluteUrl}#zoom=${zoom}`;

  const handleZoomIn = () => setZoom((prev) => prev + 10);
  const handleZoomOut = () =>
    setZoom((prev) => (prev > 50 ? prev - 10 : prev));

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = absoluteUrl;
    link.download =
      absoluteUrl.split("/").pop() || "document.pdf";
    link.click();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* PDF Area */}
      <Box sx={{ flex: 1 }}>
        <iframe
          key={zoom}
          src={zoomedUrl}
          title="PDF Viewer"
          width="100%"
          height="100%"
          style={{
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />
      </Box>

      {/* Controls - ALWAYS Visible */}
      <Box
        sx={{
          // visibility:"hidden",
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
          p: 1,
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fff",
        }}
      >
        <Button
          size="small"
          variant="outlined"
          onClick={handleZoomOut}
          startIcon={<ZoomOutIcon sx={{ fontSize: 14 }} />}
          sx={{
            fontSize: 10,
            minHeight: 26,
            px: 1,
            textTransform: "none",
            color: "#475569",
            borderColor: "#CBD5E1",
          }}
        >
          Zoom Out
        </Button>

        <Button
          size="small"
          variant="outlined"
          onClick={handleZoomIn}
          startIcon={<ZoomInIcon sx={{ fontSize: 14 }} />}
          sx={{
            fontSize: 10,
            minHeight: 26,
            px: 1,
            textTransform: "none",
            color: "#475569",
            borderColor: "#CBD5E1",
          }}
        >
          Zoom In
        </Button>

        <Button
          size="small"
          variant="contained"
          onClick={handleDownload}
          startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
          sx={{
            fontSize: 10,
            minHeight: 26,
            px: 1.2,
            textTransform: "none",
            backgroundColor: "#2563EB",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#1D4ED8",
            },
          }}
        >
          Download
        </Button>
      </Box>
    </Box>
  );
};

export default PdfViewer;