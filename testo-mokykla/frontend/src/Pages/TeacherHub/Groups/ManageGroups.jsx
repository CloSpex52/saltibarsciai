import React from "react";
import UI from "../../../components/UI/UI";
import { Link } from "react-router-dom";
function ManageGroups() {
  return (
    <UI>
      <div className="container mt-4">
        <h2>Grupių tvarkyklė</h2>
        <div className="d-grid gap-2">
          <Link
            to="/valdymas/mokytojas/tvarkyti/grupes/kurti"
            className="btn btn-primary"
          >
            Kurti Grupę
          </Link>
          <Link
            to="/valdymas/mokytojas/tvarkyti/grupes/redaguoti"
            className="btn btn-primary"
          >
            Redaguoti Grupes
          </Link>
          <Link to="/" className="btn btn-primary">
            Peržiūrėti Grupę
          </Link>
        </div>
      </div>
    </UI>
  );
}

export default ManageGroups;