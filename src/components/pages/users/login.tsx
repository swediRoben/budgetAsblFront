import React, { useState } from "react";
import { User, Lock } from "lucide-react";
// import logo from "../assets/logo.png"; // 👈 ton logo ici
import Budget from "../../../budget"
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
useNavigate
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
   const [log, setLog] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/budget/v1/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) { 
        throw new Error("Username ou mot de passe incorrect");
      }
      setLog(true)
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      // alert("Connexion réussie ✅");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {log?<Budget/>:
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900">
     
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md text-white">

        {/* 🔥 LOGO */}
        <div className="flex flex-col items-center mb-6">
          {/* <img
            src={logo}
            alt="Logo"
            className="w-16 h-16 object-contain mb-2"
          /> */}
          <h2 className="text-2xl font-bold">Connexion</h2>
          <p className="text-sm text-gray-300">
            Système Comptable
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Username */}
          <div>
            <label className="text-sm text-gray-300">Username</label>
            <div className="flex items-center mt-1 bg-white/10 border border-white/20 rounded-xl px-3">
              <User className="w-4 h-4 text-gray-300" />
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full bg-transparent px-3 py-2 outline-none text-white"
                placeholder="Entrer votre username"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <div className="flex items-center mt-1 bg-white/10 border border-white/20 rounded-xl px-3">
              <Lock className="w-4 h-4 text-gray-300" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent px-3 py-2 outline-none text-white"
                placeholder="Entrer votre mot de passe"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-200 text-sm p-2 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 transition py-2.5 rounded-xl font-semibold"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 - Votre Société
        </p>
      </div>
    </div>
    }
    </>
  );
};

export default Login;