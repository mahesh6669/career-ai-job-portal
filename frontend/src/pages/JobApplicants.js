import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function JobApplicants() {
  const { jobId } = useParams();

  const [applicants, setApplicants] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    loadApplicants();
  }, [jobId]);

  const loadApplicants = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://127.0.0.1:8000/job-applicants/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplicants(response.data);
    } catch (error) {
      console.log(error.response?.data);
      alert("Failed to load applicants");
    }
  };

  const getMatchScore = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://127.0.0.1:8000/applicant-match-score/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setScores((prev) => ({
        ...prev,
        [applicationId]: response.data,
      }));

    } catch (error) {
      console.log(error.response?.data);
      alert("Failed to get AI match score");
    }
  };

  const downloadResume = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://127.0.0.1:8000/download-resume/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        `resume_${applicationId}.pdf`
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.log(error.response?.data);
      alert("Failed to download resume");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <h2 className="mb-4">
          Job Applicants
        </h2>

        {applicants.length === 0 ? (

          <div className="alert alert-info">
            No applications yet.
          </div>

        ) : (

          applicants.map((app, index) => {

            const scoreData =
              scores[app.application_id];

            return (
              <div
                key={app.application_id}
                className="card p-4 mb-4 shadow-sm"
              >

                {/* Candidate ranking */}
                <div className="d-flex justify-content-between align-items-center">

                  <h4>
                    #{index + 1} {app.candidate_name}
                  </h4>

                  {scoreData && (
                    <span className="badge bg-success fs-6">
                      {scoreData.match_score}%
                    </span>
                  )}

                </div>

                <p className="mb-1">
                  <strong>Email:</strong>{" "}
                  {app.candidate_email}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {app.status}
                </p>

                <hr />

                {/* AI Match Score */}
                {scoreData && (
                  <div className="mb-3">

                    <h5>
                      🤖 AI Match Score
                    </h5>

                    <div className="progress mb-3">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${scoreData.match_score}%`,
                        }}
                      >
                        {scoreData.match_score}%
                      </div>
                    </div>

                    {/* Matched Skills */}
                    <h6>
                      ✅ Matched Skills
                    </h6>

                    {scoreData.matched_skills &&
                    scoreData.matched_skills.length > 0 ? (

                      <div className="mb-3">

                        {scoreData.matched_skills.map(
                          (skill, index) => (

                            <span
                              key={index}
                              className="badge bg-success me-2 mb-2"
                            >
                              {skill}
                            </span>

                          )
                        )}

                      </div>

                    ) : (

                      <p className="text-muted">
                        No matching skills found.
                      </p>

                    )}

                    {/* Missing Skills */}
                    <h6>
                      ❌ Missing Skills
                    </h6>

                    {scoreData.missing_skills &&
                    scoreData.missing_skills.length > 0 ? (

                      <div className="mb-3">

                        {scoreData.missing_skills.map(
                          (skill, index) => (

                            <span
                              key={index}
                              className="badge bg-danger me-2 mb-2"
                            >
                              {skill}
                            </span>

                          )
                        )}

                      </div>

                    ) : (

                      <p className="text-success">
                        No missing skills 🎉
                      </p>

                    )}

                  </div>
                )}

                {/* Buttons */}
                <div className="mt-3">

                  <button
                    className="btn btn-primary me-2"
                    onClick={() =>
                      downloadResume(
                        app.application_id
                      )
                    }
                  >
                    📄 Download Resume
                  </button>

                  <button
                    className="btn btn-success"
                    onClick={() =>
                      getMatchScore(
                        app.application_id
                      )
                    }
                  >
                    🤖 AI Match Score
                  </button>

                </div>

              </div>
            );
          })

        )}

      </div>
    </>
  );
}

export default JobApplicants;