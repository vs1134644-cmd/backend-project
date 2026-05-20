const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
mongoose.connect(process.env.DB);

const root = process.cwd();
console.log(root);
const express = require("express");
const path = require("path");
const { v4: uniqueId } = require("uuid");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, "files/");
  },
  filename: (req, file, next) => {
    const nameArr = file.originalname.split(".");
    const ext = nameArr.pop();
    const name = `${uniqueId()}.${ext}`;
    next(null, name);
  },
});

const upload = multer({ storage: storage });

const morgan = require("morgan");
const { signup, login } = require("./controller/user.controller");
const {
  createFile,
  fetchFile,
  deleteFile,
  downloadFile,
} = require("./controller/file.controller");
const fetchDashboard = require("./controller/dashboard.controller");
const { verifyToken } = require("./controller/token.controller");
const { shareFile } = require("./controller/shareFile.controller");
const app = express();
app.listen(process.env.PORT || 8080);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("view"));
// ui endpoinds

const getPath = (filename) => {
  return path.join(root, "view", filename);
};

app.get("/login", (req, res) => {
  res.sendFile(getPath("index.html"));
});

app.get("/", (req, res) => {
  res.sendFile(getPath("index.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(getPath("signup.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(getPath("app/dashboard.html"));
});
app.get("/file", (req, res) => {
  res.sendFile(getPath("app/file.html"));
});

// API endpoints
app.post("/signup", signup);
app.post("/login", login);
app.post("/file", upload.single("file"), createFile);
app.get("/files", fetchFile);
app.delete("/files/:id", deleteFile);
app.get("/files/download/:id", downloadFile);
app.get("/dashboard", fetchDashboard);
app.post("/token/verify", verifyToken);
app.post("/share", shareFile);
