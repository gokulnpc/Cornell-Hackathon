import express, { Request, Response } from "express";
import multer from "multer";
import { readFileSync } from "fs";
import path from "path";
import natural from "natural";
import cosineSimilarity from "cosine-similarity";
import bodyParser from "body-parser";

const app = express();
const upload = multer({ dest: "uploads/" });
const PORT = 5000;
const SIMILARITY_THRESHOLD = 0.95; // 95% threshold for matching

// Use JSON parser middleware
app.use(bodyParser.json());

// Sample job descriptions
const jobDescriptions = [
  {
    title: "Software Engineer",
    description:
      "Develop software using TypeScript, Vite, Node.js, backend development.",
  },
  {
    title: "Data Scientist",
    description: "Analyze data using machine learning, Python, and NLP.",
  },
  {
    title: "Blockchain Developer",
    description:
      "Develop blockchain applications using Solidity, Ethereum, and Web3.",
  },
];

// Function to read uploaded resume content
const getFileContent = (filePath: string): string =>
  readFileSync(filePath, "utf8");

// Calculate cosine similarity between resume text and job description
const calculateSimilarity = (resumeText: string, jobText: string): number => {
  const tokenizer = new natural.WordTokenizer();
  const resumeTokens = tokenizer.tokenize(resumeText.toLowerCase());
  const jobTokens = tokenizer.tokenize(jobText.toLowerCase());
  const combinedTokens = Array.from(new Set([...resumeTokens, ...jobTokens]));

  const resumeVector = combinedTokens.map((token) =>
    resumeTokens.includes(token) ? 1 : 0
  );
  const jobVector = combinedTokens.map((token) =>
    jobTokens.includes(token) ? 1 : 0
  );

  return cosineSimilarity(resumeVector, jobVector);
};

// Endpoint to handle resume upload and job matching
app.post(
  "/upload",
  upload.single("resume"),
  (req: Request, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    // Your logic to read file content and calculate similarity
    const resumeText = getFileContent(req.file.path); // Assuming getFileContent is defined
    const matches = jobDescriptions // Assuming jobDescriptions and calculateSimilarity are defined
      .map((job) => ({
        ...job,
        similarity: calculateSimilarity(resumeText, job.description),
      }))
      .filter((match) => match.similarity >= SIMILARITY_THRESHOLD);

    res.json({ matches });
  }
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
