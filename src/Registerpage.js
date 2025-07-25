import { useState, React } from "react";
import { Outlet, Link } from "react-router-dom";
import { backendUrl } from "./index.js";
import './Loginpage.css';

function Registerpage() {

    const [userdata, setUserdata] = useState({});
    //error 0 means use default error messages for password mismatch and passwords being under 6 characters long.
    //error 1 or 2 uses the message set in customStatusMessage. 1 displays red text and 2 displays green text.
    const [customStatusMessage, setCustomStatusMessage] = useState({message: "", error: 0});
    //const [registerFormIsPosted, setRegisterFormPostedStatus] = useState(false);

    const updateUserdata = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      if(customStatusMessage.error !== 0) {
        setCustomStatusMessage({message: "", error: 0});
      }
      setUserdata(values => ({...values, [name]: value}));
    }

    // useEffect((userdata) => {
    //   if(registerFormIsPosted) {
        
    //   }
    // } ,[userdata])

    let errorMessage = " ";
    let errorMessageClass = "statusmessagered";

    if(customStatusMessage.error === 0) {
      if(userdata.nohp) {
        if((isNaN(+userdata.nohp) && userdata.nohp)) {
          errorMessage = "Nomor telepon harus berupa angka";
          errorMessageClass = "statusmessagered";
        }
      }
    }
    else if(customStatusMessage.error === 1) {
      errorMessage = customStatusMessage.message;
      errorMessageClass = "statusmessagered";
    }
    else {
      errorMessage = customStatusMessage.message;
      errorMessageClass = "statusmessagegreen";
    }
    

  const todo = (e) => {
    e.preventDefault();
    if(
      !userdata.nama ||
      !userdata.nohp
    ) {
      setCustomStatusMessage({message: "Mohon mengisi nama dan nomor telepon.", error: 1});
    }
    else {
      const payload = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify(userdata),
      };
      console.log(JSON.stringify(userdata));
      //console.log("Yes");
      fetch(backendUrl + '/register', payload)
      .then((res) => res.json())
      .then((postResponse) => {
        if(postResponse.registersuccess === true) {
            setCustomStatusMessage({message: "Sukses! Anda sekarang bisa login.", error: 2});
        }
        else if(postResponse.registersuccess === false) {
          setCustomStatusMessage({message: "Nomor HP sudah dipakai.", error: 1});
        }
        else {
          setCustomStatusMessage({message: "Error tidak diketahui", error: 1});
        }
      });
    }
  }

  return (
    <><div className="headertext">DAFTAR PENGGUNA</div>
    <br />
    <div className="loginbox">
      <form onSubmit={todo}>
        <table>
            <input type="text" className="usernameinput" placeholder="No. Telepon" value={userdata.nohp || ""} maxlength="16"
            name="nohp"
            title="No. Telepon"
            onChange={(e) => {updateUserdata(e)}}
            />
            <input type="text" className="usernameinput" placeholder="Nama Lengkap" value={userdata.nama || ""} maxlength="64" 
            name="nama"
            title="Nama Lengkap"
            onChange={(e) => {updateUserdata(e)}}
            />
            <p className={errorMessageClass}>{errorMessage}</p>
            <input className={"tf2button"} type="submit" value="Daftar" />
            <p className="subtextnoaccount">Sudah daftar?</p>
            <p className="subtextlogin"><Link to="/"><u>Login disini</u></Link></p>
            
        </table>
      </form>
    </div>
    <Outlet />
    </>
  );
}

export default Registerpage;
