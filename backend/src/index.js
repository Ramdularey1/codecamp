
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
    origin: [
      "https://codecamp-neon.vercel.app",
      "https://codecamp-64vn89cdr-ram-dulareys-projects.vercel.app"
    ],
    credentials: true,
  })
);

app.use(cookieparser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
   origin: "https://codecamp-neon.vercel.app",
    methods: ["GET", "POST"],
  },
});


global.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ROUTES
import userRoute from "./routes/user.Route.js";
app.use("/api/v1/users", userRoute);

const Port = process.env.port || 3000;

connectDB()
  .then(() => {
    server.listen(Port, () => {
      console.log(`Server running at port ${Port}`);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed !!! ", error);
  });
