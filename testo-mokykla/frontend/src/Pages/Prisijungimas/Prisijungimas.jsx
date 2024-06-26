﻿import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import UI from "../../components/UI/UI.jsx";
import styles from "./prisijungimas.module.css";
import { Link } from "react-router-dom";

function Prisijungimas() {
  const { login, error, setError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch {
      console.log(error);
    }
  };

  return (
    <UI>
      <div className="container mt-5">
        <div className={styles.formColor}>
          <form onSubmit={handleLogin}>
            <h2 className="mb-4">Prisijungimas</h2>
            {error && <div className="mb-3 text-danger">{error}</div>}
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Vartotojo vardas
              </label>
              <input
                autoComplete="off"
                type="text"
                id="username"
                onChange={(e) => setUsername(e.target.value)}
                name="username"
                className="form-control bg-light text-dark"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label ">
                Slaptažodis
              </label>
              <input
                autoComplete="off"
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                className="form-control  bg-light text-dark"
              />
            </div>
            <div className="mb-3 text-danger">{error}</div>
            <Link to="/email" className="mb-3">
              Pamišote slaptažodį?
            </Link>
            <div className="mb-3">
              <button type="submit" className="btn btn-lg btn-dark">
                Prisijungti
              </button>
            </div>
          </form>
        </div>
      </div>
    </UI>
  );
}

export default Prisijungimas;
