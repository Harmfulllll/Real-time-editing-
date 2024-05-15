import express from "express";

import verifyToken from "../middlewares/verify.middleware.js";
import {
  createDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  shareDocument,
  updateDocument,
} from "../client/controllers/document.controller.js";

const documentRouter = express.Router();

documentRouter.post("/create", verifyToken, createDocument);

documentRouter.get("/get/:id", verifyToken, getDocument);

documentRouter.get("/getall", verifyToken, getDocuments);

documentRouter.delete("/delete/:id", verifyToken, deleteDocument);

documentRouter.post("/share", verifyToken, shareDocument);

documentRouter.patch("/update/:id", verifyToken, updateDocument);

export default documentRouter;
