import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import MyApplications from "./pages/MyApplications";
import ResumeUpload from "./pages/ResumeUpload";
import AddJob from "./pages/AddJob";
import Recommendations from "./pages/Recommendations";
import Register from "./pages/Register";
import JobApplicants from "./pages/JobApplicants";
import MyPostedJobs from "./pages/MyPostedJobs"; 


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/resume-upload" element={<ResumeUpload />} />
        <Route path="/add-job" element={<AddJob />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/register" element={<Register />} />
        <Route path="/job-applicants/:jobId" element={<JobApplicants />} />
        <Route path="/my-posted-jobs" element={<MyPostedJobs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;