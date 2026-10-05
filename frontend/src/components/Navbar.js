import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">

        <Link className="navbar-brand" to="/dashboard">
          CareerAI
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/jobs">
                Jobs
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/my-applications">
                Applications
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/resume-upload">
                Resume Analyzer
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/add-job">
                Add Job
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/my-posted-jobs">
                My Posted Jobs
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/recommendations">
                AI Jobs
              </Link>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;