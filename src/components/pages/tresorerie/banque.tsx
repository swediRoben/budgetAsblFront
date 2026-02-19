import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Target, TrendingUp, AlertTriangle } from "lucide-react";

const data = [
  { month: "Jan", real: 45000, forecast: 42000 },
  { month: "Fév", real: 48000, forecast: 46000 },
  { month: "Mar", forecast: 52000 },
  { month: "Avr", forecast: 49000 },
  { month: "Mai", forecast: 56000 },
  { month: "Juin", forecast: 60000 },
];

const renderTresorieBanquePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-xl text-gray-700 mb-8">
        Analyse et projection de votre trésorerie à 6 mois.
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graph Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Prévisions de Trésorerie
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Comparaison Réel vs Prévisionnel (Budget)
          </p>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="real" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar
                  dataKey="forecast"
                  fill="#e5e7eb"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Objectif */}
          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-md">
            <div className="flex items-center gap-2">
              <Target size={20} />
              <h3 className="font-semibold">Objectif Fin de Mois</h3>
            </div>

            <div className="text-4xl font-bold mt-4">50 000 €</div>

            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progression</span>
                <span>92%</span>
              </div>
              <div className="w-full bg-blue-400/40 h-2 rounded-full">
                <div className="bg-white h-2 rounded-full w-[92%]" />
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Insights</h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <TrendingUp size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Surperformance
                  </p>
                  <p className="text-sm text-gray-500">
                    Les encaissements de Février dépassent les prévisions de +8%.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <AlertTriangle size={18} className="text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Attention requise
                  </p>
                  <p className="text-sm text-gray-500">
                    Une grosse échéance TVA est prévue le 20 Mars (-12k€).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default renderTresorieBanquePage;