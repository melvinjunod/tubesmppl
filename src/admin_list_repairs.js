import { React, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import './Loginpage.css';

function AdminListRepairs() {
    // const location = useLocation();
    //console.log(location);

    const [tableData, setTableData] = useState([{id_kerusakan: "Memuat...", nama_kerusakan: "Memuat data...", estimasi_biaya: "Memuat data...", status: "", nama_kategori: "Memuat data..."}]);
    // const [customStatusMessage, setCustomStatusMessage] = useState({message: "", error: 0, id_kerusakan: -1});

    const navigate = useNavigate();

    useEffect(() => {
        fetch(backendUrl + `/viewtable?table=5`)
        .then(res => res.json())
        .then(jsondata => {setTableData(jsondata)});
    }, [navigate]);

    let errorMessage = " ";
    let errorMessageClass = "statusmessagered";

    // if(customStatusMessage.error === 0) {
    //     errorMessage = "";
    //     errorMessageClass = "statusmessagered";
    // }

    // else if(customStatusMessage.error === 1) {
    //     errorMessage = customStatusMessage.message;
    //     errorMessageClass = "statusmessagered";
    // }
    // else {
    //     errorMessage = customStatusMessage.message;
    //     errorMessageClass = "statusmessagegreen";
    // }
    
    const changeData = (e) => {
        const repairs_id = e.target.name;
        navigate("/admin_edit_kerusakan", {state: {id_kerusakan: repairs_id}})
    }

    const goToQueueList = (e) => {
        e.preventDefault();
        navigate("/admin_daftar_antrian", {state: {}})
    }

    const goToAddRepairsData = (e) => {
        e.preventDefault();
        navigate("/admin_tambah_kerusakan", {state: {}})
    }

    return(
        <>
        
        <div className="headertext">DATA KERUSAKAN
            <button className="toprightnavbutton" onClick={goToQueueList} >DAFTAR ANTRIAN</button>
            <button className="topleftnavbutton" onClick={goToAddRepairsData} >TAMBAH DATA</button>
        </div>
        <div className={errorMessageClass}>{errorMessage}</div>
        <br></br>
        <table className="kitstable">
            <thead>
                <tr>
                    <th>ID kerusakan</th>
                    <th>Nama</th>
                    <th>Estimasi biaya</th>
                    <th>Kategori kerusakan</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((data) => {
                    return(
                        <tr>
                            <td>{data.id_kerusakan}</td>
                            <td>{data.nama_kerusakan}</td>
                            <td>Rp {data.estimasi_biaya.toLocaleString("en")}</td>
                            <td>{data.nama_kategori}</td>
                            <td>{data.status}</td>
                            <td><button
                            className="changedatabutton"
                            name={data.id_kerusakan}
                            onClick={(e) => {changeData(e)}}
                            >UBAH DATA</button></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        <Outlet />
        </>
    );
}

export default AdminListRepairs;