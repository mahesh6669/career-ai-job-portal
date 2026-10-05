import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Recommendations() {

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://127.0.0.1:8000/job-recommendations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJobs(response.data);

    } catch (error) {

      console.log(error.response?.data);
      alert("Failed to load recommendations");

    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <h1>AI Job Recommendations</h1>

        {jobs.length === 0 ? (
          <p>No recommendations found.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.job_id}
              className="card p-3 mb-3"
            >
              <h4>{job.title}</h4>

              <p>
                <strong>Company:</strong> {job.company}
              </p>

              <h5>
                Match Score: {job.match_score}%
              </h5>
            </div>
          ))
        )}

      </div>
    </>
  );
}

export default Recommendations;