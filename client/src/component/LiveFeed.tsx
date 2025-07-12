import { useEffect, useState } from "react";
import io from "socket.io-client";

type ClickData = {
  shortCode: string;
  timestamp: string;
  geo: {
    city?: string;
    country?: string;
    org?: string;
  };
  userAgent?: string;
};

const socket = io(`${import.meta.env.VITE_API_URL}`);
export default function LiveFeed() {
  const [clicks, setClicks] = useState<ClickData[]>([]);

  useEffect(() => {
    socket.on("click", (data: ClickData) => {
      setClicks((prev) => [data, ...prev.slice(0, 49)]); // max 50
    });

    return () => {
      socket.off("click");
    };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🔴 Live Click Feed</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-2">Time</th>
              <th className="p-2">Short Code</th>
              <th className="p-2">Country</th>
              <th className="p-2">City</th>
              <th className="p-2">ISP</th>
              <th className="p-2">User Agent</th>
            </tr>
          </thead>
          <tbody>
            {clicks.map((click, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-2">{new Date(click.timestamp).toLocaleString()}</td>
                <td className="p-2">{click.shortCode}</td>
                <td className="p-2">{click.geo.country || "Unknown"}</td>
                <td className="p-2">{click.geo.city || "Unknown"}</td>
                <td className="p-2">{click.geo.org || "Unknown"}</td>
                <td className="p-2 line-clamp-1">{click.userAgent || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
