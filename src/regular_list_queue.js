import { React, useEffect, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import './Loginpage.css';

function RegularListQueue() {
    const location = useLocation();
    //console.log(location);

    const [tableData, setTableData] = useState([{id_antrian: "Memuat...", daftar_kerusakan: "Memuat data...", nama_pelanggan: "Memuat data...", tanggal: "Memuat data...", merk: "Memuat data...", tipe: "Memuat data...", plat_nomor: "Memuat data...", status: "Memuat data..."}]);

    const navigate = useNavigate();

    useEffect(() => {
        fetch(backendUrl + `/viewtable?table=2`)
        .then(res => res.json())
        .then(jsondata => {setTableData(jsondata)});
    }, [navigate]);

    const goToHome = (e) => {
        e.preventDefault();
        navigate("/laman", {state: {token: location.state.token, nohp: location.state.nohp, role: location.state.role, nama: location.state.nama}})
    }

    const goToAddQueueData = (e) => {
        e.preventDefault();
        navigate("/buat_reservasi", {state: {token: location.state.token, nohp: location.state.nohp, role: location.state.role, nama: location.state.nama}})
    }

    return(
        <>
        
        <div className="headertext">ANTRIAN
            <button className="toprightnavbutton" onClick={goToHome} >MENU UTAMA</button>
            <button className="topleftnavbutton" onClick={goToAddQueueData} >BUAT RESERVASI</button>
        </div>
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
                            <td>{data.status}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        <Outlet />
        </>
    );
}

export default RegularListQueue;