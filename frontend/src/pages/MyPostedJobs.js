import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function MyPostedJobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://127.0.0.1:8000/my-posted-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJobs(response.data);

    } catch (error) {
      console.log(error.response?.data);
      alert("Failed to load jobs");
    }
  };

  const deleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://127.0.0.1:8000/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Job deleted successfully");
      loadJobs();

    } catch (error) {
      console.log(error.response?.data);
      alert("Failed to delete job");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h2>My Posted Jobs</h2>

        {jobs.length === 0 ? (
          <p>No jobs posted yet.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="card p-3 mb-3"
            >
              <h4>{job.title}</h4>

              <p>
                <strong>Company:</strong> {job.company}
              </p>

              <p>
                <strong>Skills:</strong> {job.skills}
              </p>

              <p>
                <strong>Location:</strong> {job.location}
              </p>

              <button
                className="btn btn-warning me-2"
                onClick={() =>
                  navigate(`/job-applicants/${job.id}`)
                }
              >
                View Applicants
              </button>

              <button
                className="btn btn-danger"
                onClick={() => deleteJob(job.id)}
              >
                Delete Job
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default MyPostedJobs;