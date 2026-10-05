import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function AddJob() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");

  const handleAddJob = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://127.0.0.1:8000/add-job",
        {
          title,
          company,
          skills,
          location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      setTitle("");
      setCompany("");
      setSkills("");
      setLocation("");

    } catch (error) {
      console.log(error.response?.data);
      alert(
        JSON.stringify(error.response?.data) ||
        "Failed to add job"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <div className="card p-4">

          <h1>Add New Job</h1>

          <form onSubmit={handleAddJob}>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Job Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Company Name"
              value={company}
              onChange={(e) =>
                setCompany(e.target.value)
              }
              required
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Skills (comma separated)"
              value={skills}
              onChange={(e) =>
                setSkills(e.target.value)
              }
              required
            />

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Location"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              required
            />

            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Add Job
            </button>

          </form>
        </div>
      </div>
    </>
  );
}

export default AddJob;