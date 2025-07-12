import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LiveFeed from "../component/LiveFeed";
import API from "../utils/axios";
import io from "socket.io-client";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const socket = io(`${import.meta.env.VITE_API_URL}`);

function UrlShortenerForm() {
  const [longUrl, setLongUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: { longUrl: string; customCode?: string } = { longUrl: longUrl.trim() };
      if (customCode.trim()) payload.customCode = customCode.trim();

      const res = await API.post("/shorten", payload);
      setSuccess(`URL shortened successfully! ${res.data.shortUrl}`);
      setLongUrl("");
      setCustomCode("");

      // Refresh the analytics table
      window.location.reload();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Shorten a new URL</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="url"
            placeholder="Enter long URL..."
            className="border rounded-md p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Custom code (optional)"
            className="border rounded-md p-3 w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            minLength={3}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Shortening..." : "Shorten"}
          </button>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
      </form>
    </div>
  );
}

interface AnalyticsTableProps {
  onSelect: (shortCode: string) => void;
}

function AnalyticsTable({ onSelect }: AnalyticsTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    API.get("/api/analytics")
      .then((res) => setData(res.data.urls || []))
      .catch((e) => setError(e?.response?.data?.message || "Failed to fetch"))
      .finally(() => setLoading(false));
  }, []);

  // Listen for real-time click updates
  useEffect(() => {
    const handleClick = (clickData: { shortCode: string }) => {
      setData((prevData) =>
        prevData.map((url) =>
          url.shortCode === clickData.shortCode
            ? { ...url, totalClicks: url.totalClicks + 1 }
            : url
        )
      );
    };

    socket.on("click", handleClick);

    return () => {
      socket.off("click", handleClick);
    };
  }, []);

  const copyToClipboard = async (shortCode: string) => {
    const shortUrl = `${import.meta.env.VITE_API_URL}/${shortCode}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(shortCode);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-2">Your Shortened URLs</h2>
      {loading && <div className="text-blue-600">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-2">Short Code</th>
              <th className="p-2">Shortened URL</th>
              <th className="p-2">Original URL</th>
              <th className="p-2">Clicks</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && !loading && !error && (
              <tr>
                <td colSpan={5} className="p-2 text-center text-gray-500">
                  No URLs found.
                </td>
              </tr>
            )}
            {data.map((row) => (
              <tr className="border-t" key={row.shortCode}>
                <td className="p-2 font-mono">{row.shortCode}</td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={`${import.meta.env.VITE_API_URL}/${row.shortCode}`}
                      className="text-blue-600 underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {import.meta.env.VITE_API_URL}/{row.shortCode}
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(row.shortCode)}
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === row.shortCode ? (
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </td>
                <td className="p-2 truncate max-w-xs">
                  <a
                    href={row.originalUrl}
                    className="text-blue-600 underline break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {row.originalUrl}
                  </a>
                </td>
                <td className="p-2">{row.totalClicks}</td>
                <td className="p-2">
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => onSelect(row.shortCode)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface AnalyticsDetailsProps {
  shortCode: string | null;
  onClose: () => void;
}

function AnalyticsDetails({ shortCode, onClose }: AnalyticsDetailsProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shortCode) return;
    setLoading(true);
    setError(null);
    setData(null);
    API.get(`/api/analytics/${shortCode}`)
      .then((res) => setData(res.data))
      .catch((e) => setError(e?.response?.data?.message || "Failed to fetch"))
      .finally(() => setLoading(false));
  }, [shortCode]);

  const prepareChartData = (chartData: Record<string, number>) => {
    return Object.entries(chartData).map(([name, value]) => ({
      name: name || "Unknown",
      value: value as number,
    }));
  };

  if (!shortCode) return null;

  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Analytics for <span className="text-blue-700">{shortCode}</span>
        </h2>
        <button
          type="button"
          className="text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      {loading && <div className="text-blue-600">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-gray-700">
              <span className="font-semibold">Original URL:</span>
              <a
                href={data.originalUrl}
                className="text-blue-600 underline break-all ml-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.originalUrl}
              </a>
            </div>
            <div className="text-gray-700">
              <span className="font-semibold">Total Clicks:</span>
              <span className="ml-2 text-2xl font-bold text-blue-600">
                {data.totalClicks}
              </span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Countries Chart */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-center">Countries</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={prepareChartData(data.breakdown.countries)}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                    }
                  >
                    {prepareChartData(data.breakdown.countries).map(
                      (_entry, index) => (
                        <Cell
                          key={`cell-country-${index}`}
                          fill={`hsl(${index * 60}, 70%, 50%)`}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Cities Chart */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-center">Cities</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={prepareChartData(data.breakdown.cities).slice(0, 5)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ISPs Chart */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-center">ISPs</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={prepareChartData(data.breakdown.isps).slice(0, 5)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Devices Chart */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-center">Devices</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={prepareChartData(data.breakdown.devices)}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#ffc658"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : "0"}%`
                    }
                  >
                    {prepareChartData(data.breakdown.devices).map(
                      (_entry, index) => (
                        <Cell
                          key={`cell-device-${index}`}
                          fill={`hsl(${index * 45 + 120}, 70%, 50%)`}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Clicks Table */}
          <div>
            <h3 className="font-semibold mb-3">Recent Clicks</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-left border">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-2">Time</th>
                    <th className="p-2">Country</th>
                    <th className="p-2">City</th>
                    <th className="p-2">ISP</th>
                    <th className="p-2">Device</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentClicks.map((click: any, i: number) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">
                        {new Date(click.createdAt).toLocaleString()}
                      </td>
                      <td className="p-2">{click.country || "Unknown"}</td>
                      <td className="p-2">{click.city || "Unknown"}</td>
                      <td className="p-2">{click.org || "Unknown"}</td>
                      <td className="p-2 line-clamp-1">
                        {click.userAgent || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [selectedShortCode, setSelectedShortCode] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) nav("/login");
  }, [loading, user, nav]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-2">Welcome {user?.email}</h1>
      <UrlShortenerForm />
      <AnalyticsTable onSelect={setSelectedShortCode} />
      <AnalyticsDetails
        shortCode={selectedShortCode}
        onClose={() => setSelectedShortCode(null)}
      />
      <LiveFeed />
    </div>
  );
}
