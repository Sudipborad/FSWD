import express from "express"; 
import cors from "cors"; 
import { appendFile, readFile } from "fs"; 
import path from "path"; 
import { fileURLToPath } from "url"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); 
const PORT = 3000; 

// Middleware
app.use(cors()); 
app.use(express.static(path.join(__dirname, "public"))); 

// Logging Middleware
app.use((req, res, next) => { 
    const logEntry = `${new Date().toISOString()} - ${req.ip} - ${req.method} ${req.url}\n`; 
    appendFile("visits.log", logEntry, (err) => { 
        if (err) console.error("Logging error", err); 
    }); 
    next(); 
}); 

// Route to fetch logs
app.get("/logs", (req, res) => { 
    readFile("visits.log", "utf8", (err, data) => { 
        if (err) return res.status(500).json({ error: "Could not read log file" }); 
        const logs = data.split("\n").filter(Boolean).map((entry) => ({ log: entry })); 
        res.json(logs); 
    }); 
}); 

// Product Data
const products = [ 
    { id: 1, name: "Laptop", category: "electronics" }, 
    { id: 2, name: "Phone", category: "electronics" }, 
    { id: 3, name: "Shoes", category: "fashion" } 
]; 

// Fetch all products or filter by category
app.get("/products", (req, res) => { 
    const category = req.query.category; 
    if (category) { 
        return res.json(products.filter(p => p.category === category)); 
    } 
    res.json(products); 
}); 

// Fetch a product by ID
app.get("/products/:id", (req, res) => { 
    const product = products.find(p => p.id === parseInt(req.params.id)); 
    if (!product) return res.status(404).json({ error: "Product not found" }); 
    res.json(product); 
}); 

// Start the server
app.listen(PORT, () => { 
    console.log(`Server running on http://localhost:${PORT}`); 
});
