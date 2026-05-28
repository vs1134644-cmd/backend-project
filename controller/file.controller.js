const FileModel = require("../model/file.model");
const fs = require("fs");
const path = require("path");

const getType = (type) => {
  const ext = type.split("/").pop();
  if (ext === "x-msdownload") return "application/exe";

  return type;
};

const createFile = async (req, res) => {
  try {
    const file = req.file;
    const payload = {
      path: file.destination + file.filename,
      filename: file.filename,
      size: file.size,
      type: getType(file.mimetype),
      user: req.user.id,
    };
    const newFile = await FileModel.create(payload);

    res.status(200).json({ newFile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const fetchFile = async (req, res) => {
  try {
    const {limit} = req.query;
    const file = await FileModel.find().limit(limit);
    res.status(200).json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await FileModel.findByIdAndDelete(id);
    if (!file) return res.status(404).json({ message: "File not found" });

    const filePath = path.join(__dirname, "..", file.path);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await FileModel.findById(id);
    console.log(file);
    const root = process.cwd();
    const filePath = path.join(root, file.path);

    res.setHeader(
      "Content-Disposition",
      `attchment:filename="${file.filename}"`,
    );

    res.sendFile(filePath, (err) => {
      res.status(500).json({ message: "File not found" });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createFile,
  fetchFile,
  deleteFile,
  downloadFile,
};
