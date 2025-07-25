//      Tutorial menjalankan
//      Ganti ke directory folder yang tepat, contohnya:
//      cd C:\Users\ACER\Documents\react\mppl\mppl\website\backend
//      node websitenode.js
//      cd C:\Users\ACER\Documents\react\mppl\mppl\website
//      npm start

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Loginpage from "./Loginpage.js";
import Registerpage from "./Registerpage.js";

import AdminHomepage from "./admin_homepage.js";

import AdminAddRepairs from "./admin_add_repairs.js";
import AdminEditRepairs from "./admin_edit_repairs.js";
import AdminListRepairs from "./admin_list_repairs.js";

import AdminListQueue from "./admin_list_queue.js";

import RegularHomepage from "./regular_homepage.js";
import RegularAddQueue from "./regular_add_queue.js";
import RegularListQueue from "./regular_list_queue.js";

import Forbidden from "./forbidden.js";
// import reportWebVitals from './reportWebVitals';

const backendUrl = "http://localhost:8082";
export { backendUrl };

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={ <Loginpage />} />
        <Route path="admin_laman" element={ <AdminHomepage />} />
        <Route path="register" element={ <Registerpage />} />
        <Route path="laman" element={ <RegularHomepage />} />
        <Route path="antrian" element={ <RegularListQueue />} />
        <Route path="buat_reservasi" element={ <RegularAddQueue />} />
        <Route path="admin_tambah_kerusakan" element={ <AdminAddRepairs />} />
        <Route path="admin_edit_kerusakan" element={ <AdminEditRepairs />} />
        <Route path="admin_daftar_kerusakan" element={ <AdminListRepairs />} />

        <Route path="admin_daftar_antrian" element={ <AdminListQueue />} />
        
        <Route path="forbidden" element={ <Forbidden />} />
        <Route path="*" element={ <Loginpage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
