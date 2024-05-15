import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

//import from other files
import connect from "./db.js";
import documentModel from "../models/document.model.js";
import apiError from "../utils/apiError.js";

//user routes
import userRouter from "./routes/user.routes.js";
import documentRouter from "./routes/document.routes.js";

connect();
const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
});

dotenv.config();
app.use(express.json());

// list of active users
let activeUsers = {};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joindocuments", async (data) => {
    const document = await documentModel.findById(data.documentId);
    if (document && document.collaborators.includes(data.userId)) {
      socket.join(data.documentId);
      await documentModel.findByIdAndUpdate(
        data.documentId,
        { $addToSet: { collaborators: data.userId } },
        { new: true, useFindAndModify: false }
      );
    } else {
      socket.emit(
        "unauthorized",
        "You are not authorized to join this document."
      );
    }
  });

  socket.on("user-active", (data) => {
    const { userId, documentId } = data;
    if (!activeUsers[documentId]) {
      activeUsers[documentId] = [];
    }
    if (!activeUsers[documentId].includes(userId)) {
      activeUsers[documentId].push(userId);
    }
    io.to(documentId).emit("update-active-users", activeUsers[documentId]);
  });

  socket.on("text-change", (data) => {
    documentModel
      .findByIdAndUpdate(
        data.documentId,
        { $set: { content: data.content } },
        { new: true, useFindAndModify: false }
      )
      .then((updatedDocument) => {
        socket.to(data.documentId).emit("text-change", updatedDocument);
      })
      .catch((error) => {
        return res.json(new apiError(500, error.message));
      });
  });

  socket.on("cursor-move", (position) => {
    try {
      socket.broadcast.emit("cursorPosition", position);
    } catch (err) {
      return res.json(new apiError(500, err.message));
    }
  });

  socket.on("selection-change", (selection) => {
    try {
      socket.broadcast.emit("selection-change", selection);
    } catch (err) {
      return res.json(new apiError(500, err.message));
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

//routing
app.use("/api/user", userRouter);
app.use("/api/document", documentRouter);

const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
  console.log(`listening on port ${port}`);
});
