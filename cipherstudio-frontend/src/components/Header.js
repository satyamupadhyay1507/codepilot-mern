import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          CodePilot
        </Link>

        <div className="navbar-nav">
          <Link className="nav-link" to="/">
            Editor
          </Link>
          <Link className="nav-link" to="/admin">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;