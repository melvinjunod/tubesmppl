import { React } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import './Loginpage.css';

function RegularHomepage() {
    const location = useLocation();
    //console.log(location);

    const navigate = useNavigate();

    const goToAddQueue = (e) => {
        e.preventDefault();
        navigate("/buat_reservasi", {state: {token: location.state.token, nohp: location.state.nohp, role: location.state.role, nama: location.state.nama}})
    }

    const goToQueueList = (e) => {
        e.preventDefault();
        navigate("/antrian", {state: {token: location.state.token, nohp: location.state.nohp, role: location.state.role, nama: location.state.nama}})
    }

    return(
        <>
        
        <div className="headertext">SISTEM RESERVASI BENGKEL MOTOR
        </div>
        
        <br></br>
        <table className="navigationtable">
            <thead>
                <tr>
                    <td colSpan="2"><button className="navigationbutton" onClick={goToAddQueue} >Buat reservasi</button></td>
                    <td colSpan="2"><button className="navigationbutton" onClick={goToQueueList} >Lihat antrian</button></td>
                </tr>
            </thead>
        </table>
        <Outlet />
        </>
    );
}

export default RegularHomepage;