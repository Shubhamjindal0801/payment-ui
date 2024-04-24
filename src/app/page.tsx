"use client";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./Signup/page";
import { apiContract } from "@/common/apiContract";
import axios from "axios";

const App = () => {
  useEffect(() => {
    const dataString = localStorage.getItem("users");
    const data = dataString ? JSON.parse(dataString) : null;
    if (data) {
      axios
        .get(`http://localhost:8080${apiContract.checkLogin}/${data.creatorId}`)
        .then(() => {
          window.location.href = `/dashboard`;
        })
        .catch(() => {
          localStorage.removeItem("users");
        });
    }
  }, []);

  const handleLogin = (tokenProp: string, creatorIdProp: string) => {
    const payload = {
      token: tokenProp,
      creatorId: creatorIdProp,
    };
    localStorage.setItem("users", JSON.stringify(payload));
    window.location.href = `/dashboard`;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp handleLogin={handleLogin} />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
