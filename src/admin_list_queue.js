import { React, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import './Loginpage.css';

function AdminListQueue() {
    // const location = useLocation();
    //console.log(location);

    const [tableData, setTableData] = useState([{id_antrian: "Memuat...", daftar_kerusakan: "Memuat data...", nama_pelanggan: "Memuat data...", tanggal: "Memuat data...", merk: "Memuat data...", tipe: "Memuat data...", plat_nomor: "Memuat data...", status: "Memuat data..."}]);
    const [customStatusMessage, setCustomStatusMessage] = useState({message: "", error: 0, id_antrian: -1});

    const navigate = useNavigate();

    useEffect(() => {
        fetch(backendUrl + `/viewtable?table=2`)
        .then(res => res.json())
        .then(jsondata => {setTableData(jsondata)});
    }, [navigate, customStatusMessage]);

    let errorMessage = " ";
    let errorMessageClass = "statusmessagered";

    if(customStatusMessage.error === 0) {
        errorMessage = "";
        errorMessageClass = "statusmessagered";
    }

    else if(customStatusMessage.error === 1) {
        errorMessage = customStatusMessage.message;
        errorMessageClass = "statusmessagered";
    }
    else {
        errorMessage = customStatusMessage.message;
        errorMessageClass = "statusmessagegreen";
    }
    
    const changeData = (e) => {
        const payload = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({queueId: e.target.name, status: e.target.value}),
            mode: "cors"
        }
        fetch(backendUrl + "/editqueuestatus", payload)
        .then(res => res.json())
        .then(postResponse => setCustomStatusMessage({message: postResponse.msg, error: postResponse.success, id_antrian: -1}));
    }

    const deleteData = (e) => {
        if(customStatusMessage.id_antrian !== e.target.name) {
            setCustomStatusMessage({message: "Yakin? Tekan tombol lagi untuk lanjut dengan penghapusan data", error: 1, id_antrian: e.target.name});
            return;
        }
        const payload = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({queueId: e.target.name}),
            mode: "cors"
        }
        fetch(backendUrl + "/deletequeuedata", payload)
        .then(res => res.json())
        .then(postResponse => setCustomStatusMessage({message: postResponse.msg, error: postResponse.success, id_antrian: -1}));
    }

    

    const goToHome = (e) => {
        e.preventDefault();
        navigate("/admin_laman", {state: {}})
    }

    const goToRepairsList = (e) => {
        e.preventDefault();
        navigate("/admin_daftar_kerusakan", {state: {}})
    }

    return(
        <>
    <div className="headertext">
  <div className="titletext">DATA ANTRIAN</div>
  <button className="toprightnavbutton" onClick={goToHome}>MENU UTAMA</button>
  <button className="topleftnavbutton" onClick={goToRepairsList}>DATA KERUSAKAN</button>
</div>

        <div className={errorMessageClass}>{errorMessage}</div>
        <br></br>
        <table className="kitstable">
            <thead>
                <tr>
                    <th>ID antrian</th>
                    <th>Daftar Kerusakan</th>
                    <th>Nama pelanggan</th>
                    <th>Tanggal servis</th>
                    <th>Merk</th>
                    <th>Tipe</th>
                    <th>Plat nomor</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((data) => {
                    return(
                        <tr>
                            <td>{data.id_antrian}</td>
                            <td>{data.daftar_kerusakan}</td>
                            <td>{data.nama_pelanggan}</td>
                            <td>{data.tanggal.substring(0, 10)}</td>
                            <td>{data.merk}</td>
                            <td>{data.tipe}</td>
                            <td>{data.plat_nomor}</td>
                            <td><select name={data.id_antrian} className="submitkitinput"
                                value={data.status} onChange={(e) => changeData(e)}>
                                <option value="Menunggu">Menunggu</option>
                                <option value="Diproses">Diproses</option>
                                <option value="Selesai">Selesai</option>
                            </select></td>
                            <td><button
                            className="changedatabutton"
                            name={data.id_antrian}
                            onClick={(e) => {deleteData(e)}}
                            >{parseInt(customStatusMessage.id_antrian) === parseInt(data.id_antrian) ? "YAKIN, HAPUS" : "HAPUS DATA"}</button></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        <Outlet />
        </>
    );
}

export default AdminListQueue;