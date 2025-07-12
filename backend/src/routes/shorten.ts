import express from 'express';
import {nanoid} from 'nanoid';
import {geoLookup}  from '../utils/geoIp' 
import {PrismaClient} from '@prisma/client';
import {authMiddleware} from '../middleware/authMiddleware';
import {urlSchema} from '../utils/validation';
import {AuthRequest} from '../types/auth-request';

const prisma = new PrismaClient();
const router = express.Router();

router.post("/shorten", authMiddleware, async (req:AuthRequest, res) => {
    const result = urlSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json(result.error.format());
  
    const { longUrl, customCode } = result.data;
    const shortCode = customCode || nanoid(6);
  
    const exists = await prisma.url.findUnique({ where: { shortCode } });
    if (exists) return res.status(409).json({ message: "Short code already taken" });
  
    const url = await prisma.url.create({
      data: {
        shortCode,
        original: longUrl,
        custom: !!customCode,
        userId: req.user?.userId
      }
    });
  
    return res.json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
  });
  
  router.get("/:code", async (req, res) => {
    const { code } = req.params;
    const url = await prisma.url.findUnique({ where: { shortCode: code } });
    if (!url) return res.status(404).send("Not found");
  
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const ua = req.headers["user-agent"] || "";
    const geo = await geoLookup(ip?.toString() || "0.0.0.0");
  
    await prisma.click.create({
      data: {
        urlId: url.id,
        ip: ip?.toString() || "unknown",
        userAgent: ua,
        location: geo?.city || "unknown"
      }
    });
  
    res.redirect(url.original);
  });

export default router;