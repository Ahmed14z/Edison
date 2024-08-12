import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import jsPDF from "jspdf";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2canvas from "html2canvas";

interface ProjectTutorialProps {
  tutorial: string;
}

const ProjectTutorial: React.FC<ProjectTutorialProps> = ({ tutorial }) => {
  const [tutorialContent, setTutorialContent] = useState("");
  const tutorialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTutorialContent(tutorial);
    if (!tutorialRef.current) {
      return;
    } else {
      const scrollBarHeight = tutorialRef.current.scrollHeight;
      tutorialRef.current.scrollTo({
        top: scrollBarHeight,
        behavior: "smooth",
      });
    }
  }, [tutorial]);

  const handleDownloadPDF = async () => {
    if (tutorialRef.current) {
      const formData = new FormData();
      formData.append("markdown", tutorial.trim());

      // Temporarily remove the overflow restriction and expand the element to fit all content
      const pdf = await fetch("https://md-to-pdf.fly.dev",{
        method: "POST",
        body:formData
      })

      const pdfBlob = await pdf.blob();

      if (!window) {
        return;
      }
      const blobUrl = window.URL.createObjectURL(pdfBlob);
      const anchor = window.document.createElement('a');
      anchor.download = "tutorial.pdf";
      anchor.href = blobUrl;
      anchor.click();
      window.URL.revokeObjectURL(blobUrl);
    }
  };

  return (
    <Card variant="outlined" sx={{ backgroundColor: "#2c2c2c" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: "#00bfa5" }}>
          Project Tutorial
        </Typography>
        <Box
          ref={tutorialRef}
          sx={{
            maxHeight: "700px",
            overflowY: "auto",
            border: "1px solid #555",
            borderRadius: "8px",
            padding: "16px",
            backgroundColor: "#1e1e1e",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose w-full text-white prose-a:text-white prose-ul:text-white prose-li:text-white prose-ol:text-white prose-strong:text-white prose-h3:text-white prose-h1:text-white prose-h2:text-white marker:text-white"
          >
            {tutorialContent}
          </ReactMarkdown>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadPDF}
          sx={{
            marginTop: "16px",
            backgroundColor: "#00bfa5",
            "&:hover": {
              backgroundColor: "#00897b",
            },
          }}
        >
          Download PDF
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectTutorial;
