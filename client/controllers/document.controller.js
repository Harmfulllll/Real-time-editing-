import jwt from "jsonwebtoken";
import userModel from "../../models/user.model.js";
import documentModel from "../../models/document.model.js";
import editModel from "../../models/edit.model.js";
import apiError from "../../utils/apiError.js";
import apiResponse from "../../utils/apiResponse.js";

const createDocument = async (req, res) => {
  try {
    const { title, content } = req.body;
    const owner = req.user._id;
    const newDocument = await documentModel.create({ title, content, owner });
    return res.json(
      new apiResponse(201, "Document created successfully", newDocument)
    );
  } catch (error) {
    return res.json(new apiError(500, error.message));
  }
};

const getDocuments = async (req, res) => {
  try {
    const owner = req.user._id;
    const documents = await documentModel.find({ owner });
    return res.json(new apiResponse(200, "Documents fetched", documents));
  } catch (error) {
    return res.json(new apiError(500, error.message));
  }
};

const getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = req.user._id;
    const document = await documentModel.findOne({ _id: id, owner });
    if (!document) {
      return res.json(new apiError(404, "Document not found"));
    }
    return res.json(new apiResponse(200, "Document fetched", document));
  } catch (error) {
    return res.json(new apiError(500, error.message));
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = req.user._id;
    const document = await documentModel.findOne({ _id: id, owner });
    if (!document) {
      return res.json(new apiError(404, "Document not found"));
    }
    await documentModel.deleteOne({ _id: id });
    return res.json(new apiResponse(200, "Document deleted"));
  } catch (error) {
    return res.json(new apiError(500, error.message));
  }
};

const shareDocument = async (req, res) => {
  try {
    const { id, email } = req.body;
    const owner = req.user._id;
    const document = await documentModel.findOne({ _id: id, owner });
    if (!document) {
      return res.json(new apiError(404, "Document not found"));
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json(new apiError(404, "User not found"));
    }
    if (document.collaborators.includes(user._id)) {
      return res.json(new apiError(400, "User already has access"));
    }
    document.collaborators.push(user._id);
    await document.save();
    return res.json(new apiResponse(200, "Document shared"));
  } catch (error) {
    return res.json(new apiError(500, error.message));
  }
};

const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = req.user._id;
    const document = await documentModel.findOne({ _id: id, owner });
    if (!document) {
      return res.json(new apiError(404, "Document not found"));
    }
    const { title, content } = req.body;
    document.title = title;
    document.content = content;
    await document.save();
    return res.json(new apiResponse(200, "Document updated", document));
  } catch (error) {
    return res.json(new apiError(500, error.message));
  }
};

export {
  createDocument,
  getDocument,
  deleteDocument,
  getDocuments,
  shareDocument,
  updateDocument,
};
