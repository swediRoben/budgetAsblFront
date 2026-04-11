import React, { useEffect, useState } from "react";
import {
  getAllStricture,
  createStricture,
  updateStricture,
} from "../../../data/classification/stricture";

type Structure = {
  id?: number;
  email: string;
  reseausocial: string;
  telephone: string;
  adresse: string;
  file?: File | null;
  fileName?: string;
};

const StructureForm = () => {
  const [form, setForm] = useState<Structure>({
    email: "",
    reseausocial: "",
    telephone: "",
    adresse: "",
    file: null,
  });

  const [id, setId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAllStricture();

        if (data && data.length > 0) {
          const s = data[0];
          setId(s.id);

          setForm({
            email: s.email || "",
            reseausocial: s.reseausocial || "",
            telephone: s.telephone || "",
            adresse: s.adresse || "",
            file: null,
            fileName: s.fileName,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm({ ...form, file: e.target.files[0] });
    }
  };

  const buildFormData = (data: Structure) => {
    const fd = new FormData();
    fd.append("email", data.email);
    fd.append("reseausocial", data.reseausocial);
    fd.append("telephone", data.telephone);
    fd.append("adresse", data.adresse);

    if (data.file) {
      fd.append("file", data.file);
    }

    return fd;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = buildFormData(form);

      if (id) {
        await updateStricture(id, payload);
        alert("Structure mise à jour ✔");
      } else {
        const res = await createStricture(payload);
        setId(res.data?.id || null);
        alert("Structure créée ✔");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500 animate-pulse">
        Chargement de la structure...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white shadow-xl rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Paramètres de la structure
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* EMAIL */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            placeholder="Email"
          />
        </div>

        {/* RESEAU SOCIAL */}
        <div>
          <label className="text-sm text-gray-600">Réseau social</label>
          <input
            name="reseausocial"
            value={form.reseausocial}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Nom de l'organisation"
          />
        </div>

        {/* TELEPHONE */}
        <div>
          <label className="text-sm text-gray-600">Téléphone</label>
          <input
            name="telephone"
            value={form.telephone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* ADRESSE */}
        <div>
          <label className="text-sm text-gray-600">Adresse</label>
          <input
            name="adresse"
            value={form.adresse}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* FILE */}
        <div>
          <label className="text-sm text-gray-600">Logo / Fichier</label>

          <input
            type="file"
            onChange={handleFile}
            className="w-full border p-2 rounded-lg"
          />

          {form.fileName && (
            <p className="text-xs text-green-600 mt-1">
              Fichier actuel : {form.fileName}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          {saving ? "Enregistrement..." : id ? "Mettre à jour" : "Créer"}
        </button>
      </form>
    </div>
  );
};

export default StructureForm;