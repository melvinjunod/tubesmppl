import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import "./Loginpage.css";

function AdminAddRepairs() {
    // const location = useLocation();
    const [repairsData, setRepairsData] = useState({nama_kerusakan: "", estimasi_biaya: "", status: "Tersedia", id_kategori: ""});
    const [customStatusMessage, setCustomStatusMessage] = useState({message: "", error: 0});
    const [categoryList, setCategoryList] = useState([{nama_kategori: "Memuat data...", id_kategori: "-1"}]);

    const navigate = useNavigate();

    useEffect(() => {
        fetch(backendUrl + `/viewtable?table=4`)
        .then(res => res.json())
        .then(jsondata => {setCategoryList(jsondata)});
    }, [navigate]);

    let errorMessage = " ";
    let errorMessageClass = "statusmessagered";

    const updateRepairsData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setRepairsData(values => ({...values, [name]: value}));
        customStatusMessage.error = 0
    };
    
    if(customStatusMessage.error === 0) {
        if((isNaN(+repairsData.estimasi_biaya) && repairsData.estimasi_biaya)) {
            errorMessage = "Estimasi biaya harus berupa angka";
            errorMessageClass = "statusmessagered";
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

    const submitNewRepairsData = (e) => {
        e.preventDefault();
        if(repairsData.nama_kerusakan  === ""
        || repairsData.estimasi_biaya  === ""
        || repairsData.id_kategori  === "") {
            setCustomStatusMessage({message: "Mohon mengisi semua kolom", error: 1});
        }
        else if((isNaN(+repairsData.estimasi_biaya) && repairsData.estimasi_biaya)) {
            setCustomStatusMessage({message: "Estimasi biaya harus berupa angka", error: 1});
        }
        else {
            const payload = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(repairsData),
                mode: "cors"
            }
            fetch(backendUrl + "/addrepairsdata", payload)
            .then(res => res.json())
            .then(postResponse => setCustomStatusMessage({message: postResponse.msg, error: postResponse.success}));
        }
    }

    const goToQueueList = (e) => {
        e.preventDefault();
        navigate("/admin_daftar_antrian", {state: {}})
    }

    const goToRepairsList = (e) => {
        e.preventDefault();
        navigate("/admin_daftar_kerusakan", {state: {}})
    }

    return(
        <>
        <div className="headertext">TAMBAH DATA KERUSAKAN
            <button className="toprightnavbutton" onClick={goToQueueList} >DATA ANTRIAN</button>
            <button className="topleftnavbutton" onClick={goToRepairsList} >DATA KERUSAKAN</button>
        </div>
        <div className="secondarytext"></div>
        <br></br>
        <form onSubmit={submitNewRepairsData}>
            <table className="submitkittable">
                <tr>
                    <td>NAMA KERUSAKAN</td>
                    <td><input className="submitkitinput" type="text" name="nama_kerusakan"
                    value={repairsData.nama_kerusakan} onChange={(e) => updateRepairsData(e)} /></td>
                </tr>
                <tr>
                    <td>ESTIMASI BIAYA</td>
                    <td>RP <input className="submitkitinputprice" type="text" name="estimasi_biaya"
                    value={repairsData.estimasi_biaya} onChange={(e) => updateRepairsData(e)} /></td>
                </tr>
                <tr>
                    <td>KATEGORI KERUSAKAN</td>
                    <select name="id_kategori" className="submitkitinput"
                        value={repairsData.id_kategori} onChange={(e) => updateRepairsData(e)}>
                            {categoryList.map((categoryEntry) => {
                                return(
                                    <option value={categoryEntry.id_kategori}>{categoryEntry.nama_kategori}</option>
                                )
                            })}
                    </select>
                </tr>
                <tr>
                    <td>STATUS</td>
                    <select name="status" className="submitkitinput"
                        value={repairsData.status} onChange={(e) => updateRepairsData(e)}>
                            <option value="Tersedia">Tersedia</option>
                            <option value="Tersembunyi">Tersembunyi</option>
                    </select>
                </tr>
                <tr>
                    <td colSpan="2">
                        <div className={errorMessageClass}>{errorMessage}</div>
                        <input className="submitkitbutton" type="submit" value="TAMBAH" />
                    </td>
                </tr>
            </table>
        </form>
        </>
    );
}

export default AdminAddRepairs;