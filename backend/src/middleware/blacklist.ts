const blackListIPs = new Set<string>();

export const addToBlackList = (req:any,res:any,next:any)=>{
    const ip = req.headers["x-forwared-for"] || req.socket.remoteAddress;
    if(ip && blackListIPs.has(ip.toString())){
        return res.status(403).json({
            status: 403,
            error: "Forbidden: Your IP is blacklisted."
        });
    }
    next();
}