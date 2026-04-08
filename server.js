import "dotenv/config";
import http from "http";
import { createApp } from "./app.js";
import { setupSocket } from "./config/socket.js";
import { connectDB } from "./db/DBconnect.js";

const PORT = process.env.PORT || 4000;

//and http server
const app = createApp();
const server = http.createServer(app);

//socket connect
setupSocket(server);

//Databse connection
await connectDB();

//Running the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
