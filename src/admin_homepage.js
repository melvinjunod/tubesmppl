import { React } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import './Loginpage.css';

function AdminHomepage() {
    // const location = useLocation();
    //console.log(location);

    const navigate = useNavigate();

    const goToListRepairs = (e) => {
        e.preventDefault();
        navigate("/admin_daftar_kerusakan", {state: {}})
    }

    const goToQueueList = (e) => {
        e.preventDefault();
        navigate("/admin_daftar_antrian", {state: {}})
    }

    return(
        <>
        
        <div className="headertext">MENU NAVIGASI ADMIN
        </div>
        
        <br></br>
        <table className="navigationtable">
            <thead>
                <tr>
                    <td><button className="navigationbutton" onClick={goToListRepairs} >Data Kerusakan</button></td>
                    <td><button className="navigationbutton" onClick={goToQueueList} >Data Antrian</button></td>
                </tr>
            </thead>
        </table>
        <Outlet />
        </>
    );
}

export default AdminHomepage;