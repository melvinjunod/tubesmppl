import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import './Loginpage.css';

function Loginpage() {

  const [logindata, setLogindata] = useState({});
  const [customStatusMessage, setCustomStatusMessage] = useState({ message: "", error: true });

  const updateLogindata = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setLogindata(values => ({ ...values, [name]: value }));
  };

  const navigate = useNavigate();

  let errorMessage = customStatusMessage.message;
  let errorMessageClass = customStatusMessage.error ? "statusmessagered" : "statusmessagegreen";

  const goToRegister = (e) => {
    e.preventDefault();
    navigate("/register", { state: {} })
  }

  const login = (e) => {
    e.preventDefault();
    const payload = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logindata),
      mode: "cors"
    };
    fetch(backendUrl + `/login`, payload)
      .then(res => res.json())
      .then((postResponse) => {
        if (postResponse.loginsuccess === true) {
          setCustomStatusMessage({ message: postResponse.message, error: false });
          navigate("/laman", {
            state: {
              token: postResponse.token,
              nohp: postResponse.nohp,
              role: postResponse.role,
              nama: logindata.nama
            }
          });
        }
        else if (postResponse.message) {
          setCustomStatusMessage({ message: postResponse.message, error: true });
        }
        else {
          setCustomStatusMessage({ message: "Error tidak diketahui", error: true });
        }
      });
  }

  return (
    <>
      <div className="loginbox">

        {/* Avatar Icon */}
        <div className="avatar-circle" />

        <form onSubmit={login}>

          {/* Input nohp */}
          <div className="input-wrapper">
            <input
              type="text"
              className="usernameinput"
              placeholder="No. Telepon"
              name="nohp"
              title="No. Telepon"
              value={logindata.nohp || ''}
              maxLength="64"
              onChange={updateLogindata}
            />
          </div>

          {/* Input nama */}
          <div className="input-wrapper">
            <input
              type="text"
              className="usernameinput"
              placeholder="Nama Lengkap"
              name="nama"
              title="Nama"
              value={logindata.nama || ''}
              maxLength="64"
              onChange={updateLogindata}
            />
          </div>

          {/* Error / success message */}
          <p className={errorMessageClass}>{errorMessage}</p>

          {/* Tombol Login */}
          <input className="tf2button" type="submit" value="LOGIN" />

          {/* Link daftar */}
          <p className="subtextnoaccount">Belum daftar?</p>
          <p className="subtextlogin">
            <Link onClick={goToRegister}><u>Daftar di sini</u></Link>
          </p>
        </form>
      </div>

      <Outlet />
    </>
  );
}

export default Loginpage;
