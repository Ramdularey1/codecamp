// import express from "express";
// import mongoose from "mongoose"
// import dotenv from "dotenv"
// import path from "path"
// import cors from "cors"
// import cookieparser from "cookie-parser"
// import connectDB from "./db/db.js";


// const app = express();

// dotenv.config({
//     path: "./.env"
// })

// app.use(cors({
//     // origin: 'http://localhost:5173',
//       origin: 'https://codecamp-neon.vercel.app',
    
//     credentials: true
// }));

// app.use(cookieparser());


// const Port = process.env.port || 3000;

// app.use(express.urlencoded({extended:true}));
// app.use(express.json());

// app.get("/",(req, res) => {
//     res.send("hello")
// })

// import userRoute from "./routes/user.Route.js"




// app.use("/api/v1/users", userRoute);

// connectDB().then(() => {
//     app.listen(Port, () => {
//         console.log(`Server is running at port ${Port}`);
//     });
// }).catch((error) => {
//     console.log("MONGO db connection failed !!! ", error);
// });


import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieparser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./db/db.js";

const app = express();

dotenv.config({
  path: "./.env",
});

app.use(
  cors({
    origin: "https://codecamp-neon.vercel.app",
    credentials: true,
  })
);

app.use(cookieparser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

// 🔥 CREATE SERVER FOR SOCKET
const server = http.createServer(app);

// 🔥 SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
   origin: "https://codecamp-neon.vercel.app",
    methods: ["GET", "POST"],
  },
});

// 🔥 GLOBAL ACCESS
global.io = io;

io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
  });
});

// ROUTES
import userRoute from "./routes/user.Route.js";
app.use("/api/v1/users", userRoute);

const Port = process.env.port || 3000;

connectDB()
  .then(() => {
    server.listen(Port, () => {
      console.log(`🚀 Server running at port ${Port}`);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed !!! ", error);
  });
