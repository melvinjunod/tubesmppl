//      C:\Users\ACER\Documents\react\mppl\mppl\backend node websitenode.js
//      C:\Users\ACER\Documents\react\mppl\mppl npm start
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = 8082;
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const crypto = require('crypto');

let userdata = {};

app.use(cors());

const con = mysql.createConnection({
    host: "localhost",
    port: "3307",
    user: "mppl_user",
    password: "password_untuk_mppl",
    database: "bengkel_motor_database"
});

app.use(multer().array());
app.use(express.json());
 
app.use(bodyParser.json());
 
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());

dotenv.config();

function generateAccessToken(identifier) {
    return jwt.sign(identifier, `${process.env.TOKEN_SECRET}`, { expiresIn: '86400s' });
}

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if(token == null) {
        return res.status(401).json({
            message: "Anda harus login untuk melakukan ini."
        });
    }
    else {
        jwt.verify(token, `${process.env.TOKEN_SECRET}`.toString(), (err, user) => {
            if(err) {
                console.log(err);
                return res.status(403).json({
                    message: "Login salah."
                });
            }
            else {
                req.user = user;
                //console.log(user);
                //console.log(user.identifier);
                const sqlQueryCheckCustomerIdFromPhoneNumber = "SELECT id_pelanggan FROM pelanggan WHERE nohp = '" + user.identifier + "'";
                con.query(sqlQueryCheckCustomerIdFromPhoneNumber, (err, rows) => {
                    //console.log(rows[0]);
                    if(rows[0]) {
                        // req.nohp = rows[0].nohp;
                        //console.log(req.nohp);
                        next();
                    }
                    else {
                        return res.status(403).json({
                            message: "Error!"
                        });
                    }
                });
                
            }
        });
    }
}

// Handling Errors
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});

app.post('/login', (req, res) => {
    if(req.body.nama && req.body.nohp) {
        userdata = {
            nama: req.body.nama,
            nohp: req.body.nohp
        };
        const sqlQueryCheckUser = "SELECT nohp FROM pelanggan WHERE nama = '" + userdata.nama + "'";
        con.query(sqlQueryCheckUser, (err, rows) => {
            if(err) {
                res.sendStatus(403);
            }
            else {
                if(rows[0]) {
                    if(userdata.nohp == rows[0].nohp ) {
                        const token = generateAccessToken({ identifier: userdata.nohp });
                        res.status(200).json({
                            token: token,
                            loginsuccess: true,
                            nohp: userdata.nohp,
                            message: "Login sukses!"
                        });
                    }
                    else {
                        res.status(400).json({
                            loginsuccess: false,
                            message: "Nama atau nomor telepon salah"
                        });
                    }
                }
                else {
                    //console.log("This also got triggered");
                    res.status(400).json({
                        loginsuccess: false,
                        message: "Nama atau nomor telepon salah"
                    });
                }
            }
        });
    }
    else {
        res.status(400).json({
            loginsuccess: false,
            message: "Mohon mengisi semua kolom"
        });
    }
});

app.get('/login', (req, res) => {
    //console.log("Detected GET request at /register");
    res.status(200).json({
        message: "Pakai post method disini :>",
        loginsuccess: false
        //token: token
    });
});

app.post('/register', (req, res) => {
    userdata = {
        nama: req.body.nama,
        nohp: req.body.nohp
    };
    if(userdata.nama && userdata.nohp) {
        sqlQueryInsertUser = "INSERT INTO pelanggan (nama, nohp) VALUES ('" + userdata.nama + "', '" + userdata.nohp + "')";
        con.query(sqlQueryInsertUser, (err) => {
            if (err) {
                res.status(400).json({
                    message: "Gagal. Nomor HP sudah dipakai.",
                    registersuccess: false
                });
            }
            else {
                res.status(200).json({
                    message: "Sukses. Anda bisa login sekarang.",
                    registersuccess: true
                    //token: token
                });
            }
        });
    // let token = jwt.sign(userdata, global.config.secretKey, {
    //     algorithm: global.config.algorithm,
    //     expiresIn: '1h'
    // });
    }
    else {
        res.status(400).json({
            message: "Gagal. Error tidak diketahui.",
            registersuccess: false
            //token: token
        });
    }
});

app.get('/register', (req, res) => {
    //console.log("Detected GET request at /register");
    res.status(200).json({
        message: "Pakai post method disini :>",
        registersuccess: false
        //token: token
    });
});

app.get('/testlogin',  authenticateToken, (req, res) => {
    res.status(200).json({
        message: "Login dengan token sukses.",
        nohp: req.nohp
    });
});

app.get('/test', (req, res) => {
    res.status(200).json({
        message: "Halooooo halo halo halo",
    });
});

app.get('/viewtable', (req, res) => {

    //Default (1): tabel kerusakan per kategori + hanya tersedia
    //2: tabel antrian + a-kerusakan 
    //3: tabel pelanggan
    //4: tabel kategori kerusakan
    //5: tabel kerusakan semua

    let sqlQueryToUse = "SELECT * FROM `pelanggan`";
    
    const tableToView = req.query.table;

    switch(tableToView) {
        case "1":
            sqlQueryToUse = "SELECT kerusakan.*, kategori_kerusakan.nama_kategori nama_kategori FROM kerusakan INNER JOIN kategori_kerusakan ON kategori_kerusakan.id_kategori = kerusakan.id_kategori WHERE kategori_kerusakan.id_kategori = " + req.query.category + " AND status = 'Tersedia';";
            break;
        case "2":
            sqlQueryToUse = "SELECT antrian.*, pelanggan.nama nama_pelanggan, GROUP_CONCAT(kerusakan.nama_kerusakan SEPARATOR ', ') daftar_kerusakan FROM antrian_kerusakan INNER JOIN kerusakan ON kerusakan.id_kerusakan = antrian_kerusakan.id_kerusakan INNER JOIN antrian ON antrian_kerusakan.id_antrian = antrian.id_antrian INNER JOIN pelanggan ON pelanggan.id_pelanggan = antrian.id_pelanggan GROUP BY id_antrian;";
            break;
        case "3":
            sqlQueryToUse = "SELECT * FROM pelanggan;";
            break;
        case "4":
            sqlQueryToUse = "SELECT * FROM kategori_kerusakan;";
            break;
        case "5":
            sqlQueryToUse = "SELECT kerusakan.*, kategori_kerusakan.nama_kategori nama_kategori FROM kerusakan INNER JOIN kategori_kerusakan ON kategori_kerusakan.id_kategori = kerusakan.id_kategori;";
            break;
        default: 
            break;
    }

    

    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        if (rows) {
            // console.log(tableToView);
            res.status(200).json(rows);
        }
    });
});

app.get('/viewentry', (req, res) => {

    //Default (1): tabel kerusakan
    //2: tabel antrian (tidak digunakan) 
    //3: tabel pelanggan
    //4: tabel kategori kerusakan

    let sqlQueryToUse = "SELECT * FROM kerusakan WHERE id_kerusakan = " + req.query.id;
    
    const tableToView = req.query.table;

    switch(tableToView) {
        case "1":
            sqlQueryToUse = "SELECT * FROM kerusakan WHERE id_kerusakan = " + req.query.id;
            break;
        case "2":
            sqlQueryToUse = "SELECT * FROM antrian WHERE id_antrian = " + req.query.id;
            break;
        case "3":
            sqlQueryToUse = "SELECT * FROM pelanggan WHERE id_pelanggan = " + req.query.id;
            break;
        case "4":
            sqlQueryToUse = "SELECT * FROM kategori_kerusakan WHERE id_kategori = " + req.query.id;
            break;
        default: break;
        
    }
    

    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        if (rows) {
            // console.log(rows);
            // if(tableToView == 2 || tableToView == 3 || tableToView == 4) {
            //     const day = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(rows[0].tanggal_diterima);
            //     const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(rows[0].tanggal_diterima);
            //     const year = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(rows[0].tanggal_diterima);
            //     rows[0].tanggal_diterima = `${day}-${month}-${year}`;
            // }
            // if(tableToView == 5) {
            //     rows[0].peran = req.query.peran;
            // }
            //console.log(rows[0]);
            res.status(200).json(rows[0]);
        }
    });
});

// app.post('/users', function(req, res) {
//     console.log(req.body);
//     let user_id = req.body.id;
  
//     res.send({
//       'user_id': user_id
//     });
//   });

app.post('/addrepairsdata', (req, res) => {
    
    const nama_kerusakan = req.body.nama_kerusakan;
    const estimasi_biaya = req.body.estimasi_biaya;
    const id_kategori = req.body.id_kategori;
    const status = req.body.status;

    let sqlQueryToUse = "INSERT INTO kerusakan (nama_kerusakan, estimasi_biaya, id_kategori, status) VALUES ('"+ nama_kerusakan +"', '" + estimasi_biaya + "', '" + id_kategori + "', '"+ status +"')";
    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(400).json({ msg: "Gagal. Error tidak diketahui.", success: 1 });
        }
        else {
            res.status(200).json({ msg: "Data kerusakan telah disimpan.", success: 2 });
        }
    });
});

app.post('/editrepairsdata', (req, res) => {
    
    const nama_kerusakan = req.body.nama_kerusakan;
    const estimasi_biaya = req.body.estimasi_biaya;
    const id_kategori = req.body.id_kategori;
    const status = req.body.status;

    let sqlQueryToUse = "UPDATE kerusakan SET nama_kerusakan = '"+ nama_kerusakan +"', estimasi_biaya = '" + estimasi_biaya + "', id_kategori = '" + id_kategori + "', status = '" + status + "' WHERE id_kerusakan = " + req.query.id;
    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(400).json({ msg: "Gagal. Error tidak diketahui.", success: 1 });
        }
        else {
            res.status(200).json({ msg: "Data kerusakan telah diedit.", success: 2 });
        }
    });
});

app.post('/addqueue', (req, res) => {
    
    const repairs_list = req.body.repairs_list;
    const form_data = req.body.form_data;
    const nohp = req.body.nohp;

    if(nohp == null) {
        res.status(400).json({ message: "Belum login!", error: 1 });
        return;
    }

    let id_pelanggan = -1;

    console.log("Langkah 1");

    con.query("SELECT id_pelanggan FROM pelanggan WHERE nohp = " + nohp + ";", (err, rows) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error!", error: 1 });
            return;
        }
        else {
            id_pelanggan = rows[0].id_pelanggan;
            console.log("Langkah 2 id pelanggan: " + id_pelanggan);
            let sqlQueryOrder = "INSERT INTO `antrian` (`id_pelanggan`, `merk`, `tipe`, `plat_nomor`, `tanggal`, `status`) VALUES (" + id_pelanggan + ", '" + form_data.merk + "', '" + form_data.tipe + "', '" + form_data.plat_nomor + "', '" + form_data.tanggal + "', 'Menunggu');";
            let orderId = 0;
            con.query(sqlQueryOrder, (err, rows) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({ message: "Error!", error: 1 });
                    return;
                }
                else {
                    orderId = rows.insertId;
                    // console.log(orderId);
                    console.log("Langkah 3 id order: " + orderId);
                    res.status(200).json({ message: "Reservasi telah dibuat!", error: 2 });
                    for(let repair of repairs_list) {
                        let sqlQueryOrderItems = "INSERT INTO antrian_kerusakan (id_antrian, id_kerusakan) VALUES (" + orderId + ", " + repair.id_kerusakan + ")";
                        con.query(sqlQueryOrderItems);
                        console.log("AK " + orderId + " " + repair.id_kerusakan);
                    }
                }
            });
        }
    });

    
});

app.post('/editqueuestatus', (req, res) => {
    
    const queueId = req.body.queueId;
    const status = req.body.status;

    let sqlQueryToUse = "UPDATE antrian SET status = '" + status + "' WHERE id_antrian = " + queueId;
    // console.log(sqlQueryToUse)
    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Gagal. Error tidak diketahui.", error: 1 });
        }
        else {
            res.status(200).json({ message: "Status antrian telah diubah.", error: 2 });
        }
    });
});

app.post('/deletequeuedata', (req, res) => {
    const queueIdToDelete = req.body.queueId;
    let rowThatMatchesWithQueueId = -1;
    const sqlQuerySelect = "SELECT * FROM antrian";
    con.query(sqlQuerySelect, (err, rows) => {
        for(i in rows) {
            if(queueIdToDelete == rows[i].id_antrian) {
                console.log("Antrian cocok ditemukan");
                rowThatMatchesWithQueueId = i;
                break;
            }
        }
        if(rowThatMatchesWithQueueId == -1) {
            console.log("Tidak ada antrian yang ditemukan dengan id tersebut!");
        }
        else {
            const sqlQueryDelete = "DELETE FROM antrian WHERE id_antrian = " + queueIdToDelete;
            con.query(sqlQueryDelete);
            res.status(200).json({
                message: "Antrian sukses dihapuskan.",
                err: false
            });
        }
        if (err) {
            res.status(500).json({
                message: "Error tidak diketahui.",
                err: true
            });
        }
        else if(rowThatMatchesWithQueueId == -1) {
            res.status(400).json({
                message: "Tidak ditemukan antrian dengan ID tersebut.",
                err: false
            });
        }
    });
});

app.listen(port, () => {
    console.log("Backend tubes MPPL berjalan!");
});