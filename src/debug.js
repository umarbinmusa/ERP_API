const jwt = require("jsonwebtoken");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2Q5ZmE5NmI4OTc2MDMyZTgxZTE2MCIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc0MTUyOTAwMSwiZXhwIjoxNzQyMTMzODAxfQ.sQ-1fgaxtKwPnZN8LODQuvPpHQGMIEzcdPMESkmbT8Y"; // Replace with your actual token
const secret = "ultra"; // The same secret from .env

try {
  const decoded = jwt.verify(token, secret);
  console.log("✅ Token is valid:", decoded);
} catch (err) {
  console.log("❌ JWT Verification Error:", err.message);
}
