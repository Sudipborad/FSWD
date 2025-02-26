import { createServer } from "http";
import { existsSync, writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const usersFile = join(__dirname, "users.json");

// Ensure users.json exists
if (!existsSync(usersFile)) {
  writeFileSync(usersFile, JSON.stringify([]));
}

// Helper functions
const readUsers = () => JSON.parse(readFileSync(usersFile, "utf-8"));
const writeUsers = (users) =>
  writeFileSync(usersFile, JSON.stringify(users, null, 2));

// Create server
const server = createServer((req, res) => {
  const { method, url } = req;

  if (url === "/users" && method === "GET") {
    // GET /users: Return all users
    const users = readUsers();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } else if (url === "/users" && method === "POST") {
    // POST /users: Add a new user
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const newUser = JSON.parse(body);
        if (!newUser.id || !newUser.name) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          return res.end("Invalid user data");
        }

        const users = readUsers();
        users.push(newUser);
        writeUsers(users);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newUser));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Invalid JSON format");
      }
    });
  } else if (url.startsWith("/users/") && method === "DELETE") {
    // DELETE /users/:id - Delete user by ID
    const id = url.split("/")[2];
    const users = readUsers();
    const filteredUsers = users.filter((user) => user.id !== parseInt(id));

    if (users.length === filteredUsers.length) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("User not found");
    } else {
      writeUsers(filteredUsers);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User deleted" }));
    }
  } else {
    // Handle 404 for invalid routes
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

// Start server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
