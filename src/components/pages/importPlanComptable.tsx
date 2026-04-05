import React, { useState } from "react";
import axios from "axios";

const ExcelImportPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Veuillez sélectionner un fichier Excel.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8080/budget/v1/api/excel/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(res.data);
    } catch (error) {
      setMessage("Erreur lors de l'import !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          📊 Import Excel
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Importer le plan comptable depuis un fichier Excel
        </p>

        {/* Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
            id="fileUpload"
          />

          <label
            htmlFor="fileUpload"
            className="cursor-pointer flex flex-col items-center"
          >
            <span className="text-4xl mb-2">📁</span>
            <span className="text-gray-600">
              {file ? file.name : "Cliquez pour choisir un fichier"}
            </span>
          </label>
        </div>

        {/* Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50"
        >
          {loading ? "Importation en cours..." : "Importer"}
        </button>

        {/* Message */}
        {message && (
          <div
            className={`mt-4 text-center font-semibold ${
              message.includes("réussi")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelImportPage;