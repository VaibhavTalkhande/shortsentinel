export const geoLookup = async(ip: string)=>{
    try{
        const res = await fetch(`https://ipapi.co/${ip}/json/`);
        if(!res.ok) {
            throw new Error(`Error fetching geo data: ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    }
    catch(error) {
        console.error(`Geo lookup failed for IP ${ip}:`, error);
        return null; // Return null or a default value if the lookup fails
    }
}