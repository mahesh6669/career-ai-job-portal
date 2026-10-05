import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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

      setUser(response.data);
    } catch (error) {
      console.log(error.response?.data);
      alert("Failed to load profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <div className="card shadow p-4">

          <h1 className="text-primary mb-4">
            CareerAI Dashboard
          </h1>

          {user ? (
            <>
              <h3>User Profile</h3>

              <p>
                <strong>ID:</strong> {user.user_id}
              </p>

              <p>
                <strong>Name:</strong> {user.name}
              </p>

              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <div className="mt-4">

                <button
                  className="btn btn-primary me-2"
                  onClick={() => navigate("/jobs")}
                >
                  View Jobs
                </button>

                <button
                  className="btn btn-success me-2"
                  onClick={() =>
                    navigate("/resume-upload")
                  }
                >
                  Resume Analyzer
                </button>

                <button
                  className="btn btn-warning me-2"
                  onClick={() =>
                    navigate("/my-applications")
                  }
                >
                  My Applications
                </button>

                <button
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </div>
            </>
          ) : (
            <h3>Loading Profile...</h3>
          )}

        </div>
      </div>
    </>
  );
}

export default Dashboard;