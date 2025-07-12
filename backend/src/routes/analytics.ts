import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/authMiddleware";
import { AuthRequest } from "../types/auth-request";
import { Response } from "express";
import { Parser } from "json2csv";
import ExcelJS from "exceljs";
const router = express.Router();
const prisma = new PrismaClient();


router.get("/", authMiddleware, async (req:AuthRequest, res) => {
    const userId = req.user?.userId;
  
    const urls = await prisma.url.findMany({
      where: { userId },
      include: { clicks: true },
    });
  
    const result = urls.map((url) => {
      const totalClicks = url.clicks.length;
  
      return {
        shortCode: url.shortCode,
        originalUrl: url.original,
        totalClicks,
        breakdown: {
          countries: groupBy(url.clicks, "country"),
          cities: groupBy(url.clicks, "city"),
          devices: groupBy(url.clicks, "userAgent"),
        },
        recentClicks: url.clicks
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5),
      };
    });
  
    return res.json({ urls: result });
});
  
router.get("/exports", authMiddleware, async (req:AuthRequest, res: Response) => {
    const userId = req.user?.userId;
  
    // Get all clicks for URLs created by the user
    const urls = await prisma.url.findMany({
      where: { userId },
      include: { clicks: true },
    });
  
    const records = urls.flatMap((url) =>
      url.clicks.map((click) => ({
        shortCode: url.shortCode,
        originalUrl: url.original,
        ip: click.ip,
        city: click.city,
        region: click.region,
        country: click.country,
        org: click.org,
        userAgent: click.userAgent,
        createdAt: click.createdAt,
      }))
    );
  
    if (records.length === 0) {
      return res.status(404).json({ message: "No click data found to export." });
    }
  
    // Convert JSON to CSV
    const parser = new Parser();
    const csv = parser.parse(records);
  
    // Send file download
    res.header("Content-Type", "text/csv");
    res.attachment("analytics.csv");
    return res.send(csv);
  });

router.get("/export-excel", authMiddleware, async (req:AuthRequest, res) => {
    const userId = req.user?.userId;
  
    const urls = await prisma.url.findMany({
      where: { userId },
      include: { clicks: true },
    });
  
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Click Analytics");
  
    // Header Row
    sheet.columns = [
      { header: "Short Code", key: "shortCode", width: 15 },
      { header: "Original URL", key: "originalUrl", width: 40 },
      { header: "IP", key: "ip", width: 20 },
      { header: "City", key: "city", width: 15 },
      { header: "Region", key: "region", width: 15 },
      { header: "Country", key: "country", width: 15 },
      { header: "ISP", key: "org", width: 25 },
      { header: "Device (UA)", key: "userAgent", width: 40 },
      { header: "Timestamp", key: "createdAt", width: 25 },
    ];
  
    // Fill rows
    urls.forEach((url) => {
      url.clicks.forEach((click) => {
        sheet.addRow({
          shortCode: url.shortCode,
          originalUrl: url.original,
          ip: click.ip,
          city: click.city,
          region: click.region,
          country: click.country,
          org: click.org,
          userAgent: click.userAgent,
          createdAt: click.createdAt,
        });
      });
    });
  
    if (sheet.rowCount === 1) {
      return res.status(404).json({ message: "No data to export." });
    }
  
    // Prepare response
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=analytics.xlsx");
  
    await workbook.xlsx.write(res);
    res.end();
  });
router.get("/:shortCode", authMiddleware, async (req:AuthRequest, res) => {
  const { shortCode } = req.params;
  const userId = req.user?.userId;

  // Get URL by shortCode and check ownership
  const url = await prisma.url.findUnique({
    where: { shortCode },
    include: { clicks: true },
  });

  if (!url || url.userId !== userId) {
    return res.status(404).json({ message: "URL not found or unauthorized" });
  }

  const totalClicks = url.clicks.length;

  // Group by country/city/org/userAgent
  const countryStats = groupBy(url.clicks, "country");
  const cityStats = groupBy(url.clicks, "city");
  const ispStats = groupBy(url.clicks, "org");
  const deviceStats = groupBy(url.clicks, "userAgent");

  return res.json({
    shortCode,
    originalUrl: url.original,
    totalClicks,
    breakdown: {
      countries: countryStats,
      cities: cityStats,
      isps: ispStats,
      devices: deviceStats,
    },
    recentClicks: url.clicks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10),
  });
});


// Utility function to group and count
function groupBy(array: any[], key: string) {
  const map: Record<string, number> = {};
  for (const item of array) {
    const value = item[key] || "Unknown";
    map[value] = (map[value] || 0) + 1;
  }
  return map;
}

export default router;
