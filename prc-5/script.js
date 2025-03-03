async function fetchProducts() { 
    try {
        const category = document.getElementById("category").value.trim(); 
        const url = category ? `http://localhost:3000/products?category=${category}` : "http://localhost:3000/products"; 
        
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const products = await res.json();
        console.log("Fetched Products:", products);

        // Store data in localStorage to persist after refresh
        localStorage.setItem("products", JSON.stringify(products));

        renderProducts(products);

    } catch (error) {
        console.error("Error fetching products:", error);
        document.getElementById("productList").innerHTML = "<li>Error loading products</li>";
    }
}

function renderProducts(products) {
    document.getElementById("productList").innerHTML = products.length 
        ? products.map(p => `<li>${p.name} (${p.category})</li>`).join("") 
        : "<li>No products found</li>";
}

async function fetchLogs() { 
    try {
        const res = await fetch("http://localhost:3000/logs");
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const logs = await res.json();
        console.log("Fetched Logs:", logs);

        document.getElementById("logs").textContent = logs.length 
            ? logs.map(l => l.log).join("\n") 
            : "No logs available.";

    } catch (error) {
        console.error("Error fetching logs:", error);
        document.getElementById("logs").textContent = "Error loading logs.";
    }
}

// Load saved products on page load
document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded, checking for saved products...");
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
        renderProducts(JSON.parse(savedProducts));
    }
});
