import { React, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import "./Loginpage.css";

function AdminEditRepairs() {
    const location = useLocation();
    const [repairsData, setRepairsData] = useState({id_kerusakan: "", nama_kerusakan: "", estimasi_biaya: "", status: "Tersedia", id_kategori: "Memuat data..."});
    const [customStatusMessage, setCustomStatusMessage] = useState({message: "", error: 0});
    const [categoryList, setCategoryList] = useState([{nama_kategori: "Memuat data...", id_kategori: "-1"}]);

    const navigate = useNavigate();

    useEffect(() => {
        if(!location.state.id_kerusakan) navigate("/admin_daftar_kerusakan", {state: {}});
        fetch(backendUrl + `/viewentry?table=1&id=`+location.state.id_kerusakan)
        .then(res => res.json())
        .then(jsondata => {setRepairsData(jsondata)});
        fetch(backendUrl + `/viewtable?table=4`)
        .then(res => res.json())
        .then(jsondata => {setCategoryList(jsondata)});
    }, [location, navigate]);

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

    const submitEditedRepairsData = (e) => {
        e.preventDefault();
        if(repairsData.nama_kerusakan  === undefined
            || repairsData.estimasi_biaya  === undefined
            || repairsData.id_kategori  === undefined) {
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
            fetch(backendUrl + "/editrepairsdata?id="+location.state.id_kerusakan, payload)
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
        <div className="headertext">EDIT DATA KERUSAKAN
            <button className="toprightnavbutton" onClick={goToQueueList} >DATA ANTRIAN</button>
            <button className="topleftnavbutton" onClick={goToRepairsList} >DATA KERUSAKAN</button>
        </div>
        <div className="secondarytext"></div>
        <br></br>
        <form onSubmit={submitEditedRepairsData}>
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
                    <select name="id_kerusakan" className="submitkitinput"
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
                        <input className="submitkitbutton" type="submit" value="SIMPAN" />
                    </td>
                </tr>
            </table>
        </form>
        </>
    );
}

export default AdminEditRepairs;