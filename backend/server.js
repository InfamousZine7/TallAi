const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const XLSX = require("xlsx");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Compass
mongoose.connect("mongodb://127.0.0.1:27017/tallai_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schema and Model
const saleSchema = new mongoose.Schema({
  month: String,
  purchase: Number,
  sales: Number,
});

const SaleData = mongoose.model("saledatas", saleSchema);

// Multer Setup for File Uploads (Processing in Memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload API - Process Excel File and Store Data
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const formattedData = sheetData.map((row) => ({
      month: row.Month,
      purchase: row.Purchase || 0,
      sales: row.Sales || 0,
    }));

    // Clear existing data (optional) and insert new data
    await SaleData.deleteMany({});
    await SaleData.insertMany(formattedData);

    res.json({ message: "File uploaded and data stored successfully!" });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API to Fetch Stored Data
app.get("/data", async (req, res) => {
  try {
    const data = await SaleData.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

// Start Server
app.listen(5001, () => console.log("🚀 Server running on port 5001"));
