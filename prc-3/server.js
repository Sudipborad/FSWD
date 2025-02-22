const express = require('express');
const si = require('systeminformation'); // This will help gather system info
const app = express();
const port = 3000;

// Serve static files (HTML)
app.use(express.static('public'));

// Endpoint to get system information
app.get('/system-info', async (req, res) => {
    try {
        const cpu = await si.cpu();
        const memory = await si.mem();
        const osInfo = await si.osInfo();
        const uptime = await si.time();

        const systemData = {
            "Operating System": osInfo.distro + " " + osInfo.release, 
            "OS Version": osInfo.version, 
            "Architecture": osInfo.arch, 
            "CPU": cpu.manufacturer + " " + cpu.brand, 
            "Total Memory": (memory.total / (1024 ** 3)).toFixed(2) + " GB", 
            "Free Memory": (memory.available / (1024 ** 3)).toFixed(2) + " GB", 
            "Home Directory": osInfo.home,
            "Uptime": `${uptime.uptime} seconds`
        };

        res.json(systemData); // Send the data as JSON response
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch system information" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(si.osInfo)
});
