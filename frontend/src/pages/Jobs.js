import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://127.0.0.1:8000/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCurrentUser(response.data);

    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/jobs"
      );

      setJobs(response.data);

    } catch (error) {
      console.log(error);
      alert("Failed to load jobs");
    }
  };

  const applyJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://127.0.0.1:8000/apply-job",
        {
          job_id: jobId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

    } catch (error) {
      console.log(error.response?.data);
      alert("Failed to Apply");
    }
  };

  const deleteJob = async (jobId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {

      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `http://127.0.0.1:8000/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      fetchJobs();

    } catch (error) {

      console.log(error.response?.data);

      alert(
        error.response?.data?.detail ||
        "Failed to delete job"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h1>Available Jobs</h1>

        {jobs.map((job) => (
          <div
            key={job.id}
            className="card p-3 mb-3"
          >
            <h3>{job.title}</h3>

            <p>
              <strong>Company:</strong> {job.company}
            </p>

            <p>
              <strong>Skills:</strong> {job.skills}
            </p>

            <p>
              <strong>Location:</strong> {job.location}
            </p>

            {currentUser &&
 currentUser.user_id !== job.user_id && (
  <button
    className="btn btn-success me-2"
    onClick={() => applyJob(job.id)}
  >
    Apply Job
  </button>
)}

            {currentUser &&
 currentUser.user_id === job.user_id && (
  <button
    className="btn btn-danger me-2"
    onClick={() => deleteJob(job.id)}
  >
    Delete Job
  </button>
)}
{currentUser &&
 currentUser.user_id === job.user_id && (
  <button
    className="btn btn-warning me-2"
    onClick={() =>
      navigate(`/job-applicants/${job.id}`)
    }
  >
    View Applicants
  </button>
)}

          </div>
        ))}
      </div>
    </>
  );
}

export default Jobs;