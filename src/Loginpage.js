import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import './Loginpage.css';

function Loginpage() {

  const [logindata, setLogindata] = useState({});
  const [customStatusMessage, setCustomStatusMessage] = useState({message: "", error: true});

  const updateLogindata = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setLogindata(values => ({...values, [name]: value}));
  };

  const navigate = useNavigate();

  let errorMessage = customStatusMessage.message;
  let errorMessageClass = customStatusMessage.error ? "statusmessagered" : "statusmessagegreen";

  const goToRegister = (e) => {
    e.preventDefault();
    navigate("/register", {state: {}})
}

  const login = (e) => {
    e.preventDefault();
    const payload = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logindata),
      mode: "cors"
    }
    fetch(backendUrl + `/login`, payload)
    .then(res => res.json())
    .then((postResponse) => {
      if(postResponse.loginsuccess === true) {
        setCustomStatusMessage({message: postResponse.message, error: false});
        navigate("/laman", {state: {token: postResponse.token, nohp: postResponse.nohp, role: postResponse.role, nama: logindata.nama}});
      }
      else if(postResponse.message) {
        setCustomStatusMessage({message: postResponse.message, error: true});
      }
      else {
        setCustomStatusMessage({message: "Error tidak diketahui", error: true});
      }
    });
  }

  return (
    <><div className="headertext">LOGIN
      {/* <button className="toprightnavbutton" onClick={goToRegister} >DAFTAR</button> */}
    </div>
    
    <div className="loginbox">
      <form onSubmit={login}>
        <table>
            <input type="text" className="usernameinput" placeholder="No. Telepon" name="nohp" title="No. Telepon" value={logindata.nohp} maxlength="64"
            onChange={(e) => {updateLogindata(e)}}
            />
            <input type="text" className="usernameinput" placeholder="Nama Lengkap" name="nama" title="Nama" value={logindata.nama} maxlength="64"
            onChange={(e) => {updateLogindata(e)}}
            />
            <p className={errorMessageClass}>{errorMessage}</p>
            <input className="tf2button" type="submit" value="Login" />
            <p className="subtextnoaccount">Belum daftar?</p>
            <p className="subtextlogin"><Link onClick={goToRegister}><u>daftar disini</u></Link></p>
        </table>
      </form>

    </div>
    {/* <p className="disclaimer">Font TF2 dan gayanya adalah sebuah trademark dan/atau registered trademark dari Valve Corporation. CSS website ini terinspirasi darinya.</p> */}
    <Outlet />
    </>
  );
}

export default Loginpage;
