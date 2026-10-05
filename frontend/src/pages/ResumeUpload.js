import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [scoreResult, setScoreResult] = useState(null);

  const handleUpload = async () => {
  if (!file) {
    alert("Please select a PDF Resume");
    return;
  }

  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/analyze-resume",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setResult(response.data);

  } catch (error) {
    console.log(error.response?.data);
    alert("Resume Upload Failed");
  }
};

  const handleScore = async () => {
    if (!file) {
      alert("Please select a PDF Resume");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/resume-score",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setScoreResult(response.data);
    } catch (error) {
      console.log(error.response?.data);
      alert("Resume Score Failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h1>Resume Analyzer</h1>

        <input
          type="file"
          accept=".pdf"
          className="form-control"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />

        <br />

        <button
          className="btn btn-primary me-2"
          onClick={handleUpload}
        >
          Analyze Resume
        </button>

        <button
          className="btn btn-success"
          onClick={handleScore}
        >
          Resume Score
        </button>

        <hr />

        {result && (
          <div className="card p-3 mb-3">
            <h3>Resume Analysis</h3>

            <p>
              <strong>Resume ID:</strong>
              {" "}
              {result.resume_id}
            </p>

            <p>
              <strong>Filename:</strong>
              {" "}
              {result.filename}
            </p>

            <p>
              <strong>Skills Count:</strong>
              {" "}
              {result.skills_count}
            </p>

            <h5>Extracted Skills</h5>

            <ul>
              {result.skills.map(
                (skill, index) => (
                  <li key={index}>
                    {skill}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {scoreResult && (
          <div className="card p-3">
            <h3>
              Resume Score:
              {" "}
              {scoreResult.resume_score}%
            </h3>

            <h5>Skills Found</h5>

            <ul>
              {scoreResult.skills_found.map(
                (skill, index) => (
                  <li key={index}>
                    ✅ {skill}
                  </li>
                )
              )}
            </ul>

            <h5>Missing Skills</h5>

            <ul>
              {scoreResult.missing_skills.map(
                (skill, index) => (
                  <li key={index}>
                    ❌ {skill}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default ResumeUpload;