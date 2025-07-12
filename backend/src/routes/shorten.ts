import express from 'express';
import {nanoid} from 'nanoid';
import {geoLookup}  from '../utils/geoIp' // Assuming you have a utility function for geolocation lookup

const router = express.Router();

const url:Record<string, string> = {};

const clickLog: any[] = [];

router.post('/shorten',async(req,res)=>{
    const { originalUrl } = req.body;
    if(!originalUrl || typeof originalUrl !== 'string') {
        return res.status(400).json({ error: 'Invalid URL' });
    }
    const shortId = nanoid(6);
    url[shortId] = originalUrl;
    return res.status(201).json({ shortUrl: `${process.env.BASE_URL}/${shortId}` });
})

export const handleRedirect = async(req:express.Request,res:express.Response)=>{
    const {shortId} = req.params;
    const originalUrl = url[shortId];
    if(!originalUrl) {
        return res.status(404).json({ error: 'URL not found' });
    }
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ua = req.headers['user-agent'] || "";
    const geo = await geoLookup(ip?.toString()|| "0.0.0.0");
    clickLog.push({
        shortId,
        originalUrl,
        ip,
        ua,
        geo,
        timestamp: new Date().toISOString()
    });
    return res.redirect(originalUrl);
}
export default router;