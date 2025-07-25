import { React, useEffect, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import './Loginpage.css';

function RegularAddQueue() {
    const location = useLocation();
    //console.log(location);

    const [tableData, setTableData] = useState([{id_kerusakan: "Memuat...", nama_kerusakan: "Memuat data...", estimasi_biaya: "Memuat data..."}]);
    const [categoryData, setCategoryData] = useState([{id_kategori: -1, nama_kategori: "Memuat data..."}]);
    const [categoryChosen, setCategoryChosen] = useState({id_kategori: 1});
    const [formData, setFormData] = useState({merk: "", tipe: "", plat_nomor: "", tanggal: ""});
    const [customStatusMessage, setCustomStatusMessage] = useState({message: "", error: 0});
    const [chosenRepairs, setChosenRepairs] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        console.log(categoryChosen.id_kategori);
        fetch(backendUrl + `/viewtable?table=1&category=` + categoryChosen.id_kategori)
        .then(res => res.json())
        .then(jsondata => {setTableData(jsondata)});
    }, [categoryChosen]);

    useEffect(() => {
        if(!location.state.token) navigate("/");
        fetch(backendUrl + `/viewtable?table=4`)
        .then(res => res.json())
        .then(jsondata => {setCategoryData(jsondata)});
    }, [navigate, location.state.token]);

    useEffect(() => {
        let tempTotalPrice = 0;
        for(let i = 0; i < chosenRepairs.length; i++) {
            tempTotalPrice += parseInt(chosenRepairs[i].estimasi_biaya);
        }
        setTotalPrice(tempTotalPrice);
    }, [chosenRepairs]);

    const setCategoryChosenEvent = (event) => {
        const value = event.target.value;
        setCategoryChosen({id_kategori: value});
    }

    let errorMessage = " ";
    let errorMessageClass = "statusmessagered";

    const updateFormData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(values => ({...values, [name]: value}));
        customStatusMessage.error = 0
    };

    if(customStatusMessage.error === 0) {
        // errorMessage = "";
    }

    else if(customStatusMessage.error === 1) {
        errorMessage = customStatusMessage.message;
        errorMessageClass = "statusmessagered";
    }
    else {
        errorMessage = customStatusMessage.message;
        errorMessageClass = "statusmessagegreen";
    }

    const addChosenRepairs = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const itemId = parseInt(chosenRepairs.length) + 1;
        const repairId = e.target.getAttribute('data-tag');
        console.log("Added id " + itemId);
        setChosenRepairs(values => [...values, {id: itemId, id_kerusakan: repairId, nama_kerusakan: name, estimasi_biaya: value}]);
    }

    const removeChosenRepairs = (e) => {
        const name = parseInt(e.target.name);
        console.log("removed id " + name);
        setChosenRepairs(chosenRepairs => chosenRepairs.filter((item) => item.id !== name));
    }

    const goToHome = (e) => {
        e.preventDefault();
        navigate("/laman", {state: {token: location.state.token, nohp: location.state.nohp, role: location.state.role, nama: location.state.nama}})
    }

    const goToQueueList = (e) => {
        e.preventDefault();
        navigate("/antrian", {state: {token: location.state.token, nohp: location.state.nohp, role: location.state.role, nama: location.state.nama}})
    }

    const submitQueue = (e) => {
        e.preventDefault();
        if(formData.merk  === ""
            || formData.tipe  === ""
            || formData.plat_nomor  === ""
            || formData.tanggal  === "") {
            setCustomStatusMessage({message: "Mohon mengisi semua kolom", error: 1});
        }
        else if(chosenRepairs.length <= 0) {
            setCustomStatusMessage({message: "Mohon memilih setidaknya satu layanan servis", error: 1});
        }
        else {
            const payload = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({repairs_list: chosenRepairs, form_data: formData, nohp: location.state.nohp}),
                mode: "cors"
            }
            console.log(payload);
            fetch(backendUrl + "/addqueue", payload)
            .then(res => res.json())
            .then(postResponse => setCustomStatusMessage({message: postResponse.message, error: postResponse.success}));
        }
    }

    return(
        <>
        
        <div className="headertext">ESTIMASI BIAYA
            <button className="toprightnavbutton" onClick={goToHome} >MENU UTAMA</button>
            <button className="topleftnavbutton" onClick={goToQueueList} >LIHAT ANTRIAN</button>
            <br></br>
            <select name="id_kategori" className="submitkitinput"
                value={categoryChosen.id_kategori} onChange={(e) => setCategoryChosenEvent(e)}>
                    {categoryData.map((categoryEntry) => {
                        return(
                            <option value={categoryEntry.id_kategori}>{categoryEntry.nama_kategori}</option>
                        )
                    })}
            </select>
        </div>

        <br></br>

        <table className="doubletablecontainer">
            <tr>
                <td rowSpan="1">
                    <table className="kitstable">
                        <thead>
                            <tr>
                                <th>Nama servis</th>
                                <th>Estimasi biaya</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((data) => {
                                return(
                                    <tr>
                                        <td>{data.nama_kerusakan}</td>
                                        <td>Rp {data.estimasi_biaya.toLocaleString("en")}</td>
                                        <td><button
                                        className="changedatabutton"
                                        data-tag={data.id_kerusakan}
                                        name={data.nama_kerusakan}
                                        value={data.estimasi_biaya}
                                        onClick={(e) => {addChosenRepairs(e)}}
                                        >MASUKKAN SERVIS</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </td>
                
                <td rowSpan="2">
                    <table className="kitstable">
                        <thead>
                            <tr>
                                <th>Servis dipilih</th>
                                <th>Estimasi biaya</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {chosenRepairs.length > 0 ? chosenRepairs.map((c_data) => {
                                return(
                                    <tr>
                                        <td>{c_data.nama_kerusakan}</td>
                                        <td>Rp {c_data.estimasi_biaya.toLocaleString("en")}</td>
                                        <td><button
                                        className="changedatabutton"
                                        name={c_data.id}
                                        onClick={(e) => {removeChosenRepairs(e)}}
                                        >BATAL</button></td>
                                    </tr>
                                )
                            }) : ""}
                        </tbody>
                    </table>
                </td>
                </tr>
                <tr>
                    <td className="nomormejacontainer">
                        <form onSubmit={submitQueue}>
                            <table className="submitkittable">
                                <tr>
                                    <td>NAMA PELANGGAN</td>
                                    <td>{location.state.nama || "???"}</td>
                                </tr>
                                <tr>
                                    <td>MERK MOTOR</td>
                                    <td><input className="submitkitinput" type="text" name="merk"
                                        value={formData.merk} onChange={(e) => updateFormData(e)} /></td>
                                </tr>
                                <tr>
                                    <td>TIPE MOTOR</td>
                                    <td><input className="submitkitinput" type="text" name="tipe"
                                        value={formData.tipe} onChange={(e) => updateFormData(e)} /></td>
                                </tr>
                                <tr>
                                    <td>PLAT MOTOR</td>
                                    <td><input className="submitkitinput" type="text" name="plat_nomor"
                                        value={formData.plat_nomor} onChange={(e) => updateFormData(e)} /></td>
                                </tr>
                                <tr>
                                    <td>TANGGAL SERVIS</td>
                                    <td><input className="submitkitinput" type="date" name="tanggal"
                                        value={formData.tanggal} onChange={(e) => updateFormData(e)} /></td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <div className={errorMessageClass}>{errorMessage}</div>
                                        <input className="submitkitbuttonwide" type="submit" value="BUAT RESERVASI" />
                                    </td>
                                </tr>
                            </table>
                        </form>
                        Total harga: Rp {totalPrice.toLocaleString("en")}
                    </td>
                </tr>
        </table>

        
        <Outlet />
        </>
    );
}

export default RegularAddQueue;