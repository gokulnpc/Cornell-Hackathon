import React, { useState } from "react";

const ResumeMatcher: React.FC = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [results, setResults] = useState<
    { title: string; description: string; similarity: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setResume(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!resume) {
      return alert("Please upload a resume file.");
    }

    const formData = new FormData();
    formData.append("resume", resume);

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResults(data.matches);
    } catch (error) {
      console.error(error);
      alert("Error uploading resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Upload Your Resume</h2>
      <div style={styles.uploadContainer}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf, .doc, .docx, .txt"
          style={styles.fileInput}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ ...styles.button, ...(loading ? {} : styles.buttonHover) }}
          onMouseEnter={() =>
            !loading &&
            (styles.button.backgroundColor = styles.buttonHover.backgroundColor)
          }
          onMouseLeave={() =>
            !loading && (styles.button.backgroundColor = "#6200ea")
          }
        >
          {loading ? "Matching..." : "Find Matching Jobs"}
        </button>
      </div>

      {results.length > 0 ? (
        <div style={styles.resultsContainer}>
          <h3 style={styles.resultsHeading}>Matching Jobs</h3>
          <ul style={styles.resultsList}>
            {results.map((job, index) => (
              <li key={index} style={styles.resultItem}>
                <strong>{job.title}</strong> (
                {(job.similarity * 100).toFixed(2)}%)
                <p>{job.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={styles.noMatch}>
          No matches found at 95% or above similarity.
        </p>
      )}
    </div>
  );
};

export default ResumeMatcher;

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "2rem",
    backgroundColor: "#1e1e2d", // Darker blue-gray to match the theme
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    color: "#ffffff",
    textAlign: "center" as const,
  },
  heading: {
    fontSize: "24px",
    marginBottom: "1rem",
    color: "#ffd700", // A soft yellow for contrast with the dark background
  },
  uploadContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  },
  fileInput: {
    color: "#ffffff",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #4a4a4a",
    backgroundColor: "#333", // Matches the dark theme
    cursor: "pointer",
  },
  button: {
    padding: "10px 16px",
    borderRadius: "4px",
    backgroundColor: "#6200ea", // Vibrant purple to match the theme's accent
    border: "none",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "bold" as const,
    transition: "background-color 0.3s",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  },
  buttonHover: {
    backgroundColor: "#3700b3", // Darker shade for hover effect
  },
  resultsContainer: {
    marginTop: "2rem",
    textAlign: "left" as const,
  },
  resultsHeading: {
    fontSize: "20px",
    marginBottom: "1rem",
    color: "#ffd700", // Consistent with heading color
  },
  resultsList: {
    listStyleType: "none" as const,
    padding: 0,
  },
  resultItem: {
    backgroundColor: "#2a2a3b", // Slightly lighter shade for list items
    padding: "1rem",
    borderRadius: "4px",
    marginBottom: "1rem",
    color: "#e0e0e0", // Light gray for readability
  },
  noMatch: {
    color: "#e0e0e0",
    marginTop: "1rem",
  },
};
