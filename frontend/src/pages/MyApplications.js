import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function MyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://127.0.0.1:8000/my-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(response.data);
    } catch (error) {
      console.log(error.response?.data);
      alert("Failed to load applications");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h1>My Applications</h1>

        {applications.map((app) => (
          <div
            key={app.id}
            className="card p-3 mb-3"
          >
            <p>
              <strong>Application ID:</strong> {app.id}
            </p>

            <p>
              <strong>Job ID:</strong> {app.job_id}
            </p>

            <p>
              <strong>Status:</strong> {app.status}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default MyApplications;