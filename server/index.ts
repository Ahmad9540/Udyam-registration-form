// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const { prisma } = require("./src/prisma");

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// const OTP_STORE = {}; // { aadhaar: { otp: '123456', expiresAt: ts } }
// const SUBMISSIONS_FILE = path.join(__dirname, "data", "submissions.json");
// if (!fs.existsSync(path.dirname(SUBMISSIONS_FILE))) fs.mkdirSync(path.dirname(SUBMISSIONS_FILE), { recursive: true });
// if (!fs.existsSync(SUBMISSIONS_FILE)) fs.writeFileSync(SUBMISSIONS_FILE, "[]");

// function generateOtp() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// app.post("/api/send-otp", (req, res) => {
//   const { aadhaar } = req.body;
//   if (!/^\d{12}$/.test(aadhaar || "")) {
//     return res.status(400).json({ success: false, message: "Invalid Aadhaar" });
//   }
//   const otp = generateOtp();
//   OTP_STORE[aadhaar] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 minutes
//   console.log(`[DEV] OTP for ${aadhaar}: ${otp}`); // developer-only: console log
//   return res.json({ success: true, message: "OTP sent (simulated)" });
// });

// app.post("/api/verify-otp", (req, res) => {
//   const { aadhaar, otp } = req.body;
//   const entry = OTP_STORE[aadhaar];
//   if (!entry) return res.status(400).json({ success: false, message: "No OTP requested" });
//   if (Date.now() > entry.expiresAt) return res.status(400).json({ success: false, message: "OTP expired" });
//   if (entry.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });
//   delete OTP_STORE[aadhaar];
//   return res.json({ success: true });
// });

// app.post("/api/submit", (req, res) => {
//   const submission = { ...req.body, receivedAt: new Date().toISOString() };
//   const data = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, "utf8"));
//   data.push(submission);
//   fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(data, null, 2));
//   return res.json({ success: true, submissionId: data.length });
// });

// const port = process.env.PORT || 5000;
// app.listen(port, () => console.log("Server listening on", port));















// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const { PrismaClient } = require("@prisma/client");

// const prisma = new PrismaClient();
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// const OTP_STORE = {}; // { aadhaar: { otp: '123456', expiresAt: ts } }

// // Generate OTP
// function generateOtp() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // Send OTP
// app.post("/api/send-otp", (req, res) => {
//   const { aadhaar } = req.body;
//   if (!/^\d{12}$/.test(aadhaar || "")) {
//     return res.status(400).json({ success: false, message: "Invalid Aadhaar" });
//   }
//   const otp = generateOtp();
//   OTP_STORE[aadhaar] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
//   console.log(`[DEV] OTP for ${aadhaar}: ${otp}`);
//   return res.json({ success: true, message: "OTP sent (simulated)" });
// });

// // Verify OTP
// app.post("/api/verify-otp", (req, res) => {
//   const { aadhaar, otp } = req.body;
//   const entry = OTP_STORE[aadhaar];
//   if (!entry) return res.status(400).json({ success: false, message: "No OTP requested" });
//   if (Date.now() > entry.expiresAt) return res.status(400).json({ success: false, message: "OTP expired" });
//   if (entry.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });
//   delete OTP_STORE[aadhaar];
//   return res.json({ success: true });
// });

// // Submit form to PostgreSQL
// app.post("/api/submit", async (req, res) => {
//   try {
//     const { aadhaarNumber, panNumber, pincode, city, state } = req.body;

//     // Aadhaar validation
//     if (!/^\d{12}$/.test(aadhaarNumber)) {
//       return res.status(400).json({ success: false, message: "Invalid Aadhaar Number" });
//     }

//     // PAN validation
//     if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
//       return res.status(400).json({ success: false, message: "Invalid PAN Number" });
//     }

//     // Store in DB
//     const submission = await prisma.submission.create({
//       data: { aadhaarNumber, panNumber, pincode, city, state },
//     });

//     return res.json({ success: true, submissionId: submission.id });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: "Database error" });
//   }
// });

// const port = process.env.PORT || 5000;
// app.listen(port, () => console.log("Server listening on", port));







// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const { prisma } = require("./src/prisma");

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // OTP store
// const OTP_STORE = {};
// const SUBMISSIONS_FILE = path.join(__dirname, "data", "submissions.json");
// if (!fs.existsSync(path.dirname(SUBMISSIONS_FILE))) fs.mkdirSync(path.dirname(SUBMISSIONS_FILE), { recursive: true });
// if (!fs.existsSync(SUBMISSIONS_FILE)) fs.writeFileSync(SUBMISSIONS_FILE, "[]");

// // Load scraped schema
// const scrapedSchemaPath = path.join(__dirname, "scraped_schema.json");
// let scrapedSchema = null;
// if (fs.existsSync(scrapedSchemaPath)) {
//     scrapedSchema = JSON.parse(fs.readFileSync(scrapedSchemaPath, "utf8"));
// } else {
//     console.warn("⚠ scraped_schema.json not found. Validation will be skipped.");
// }

// // OTP generator
// function generateOtp() {
//     return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // Validate data using scraped schema
// function validateSubmission(data) {
//     if (!scrapedSchema) return { valid: true };

//     const allFields = [...(scrapedSchema.step1 || []), ...(scrapedSchema.step2 || [])];

//     for (const field of allFields) {
//         const value = data[field.name];

//         // Required check
//         if (field.required && (value === undefined || value === "")) {
//             return { valid: false, message: `${field.label} is required` };
//         }

//         // Pattern check
//         if (field.pattern && value) {
//             const regex = new RegExp(field.pattern);
//             if (!regex.test(value)) {
//                 return { valid: false, message: `${field.label} is invalid` };
//             }
//         }
//     }

//     return { valid: true };
// }

// // OTP send
// app.post("/api/send-otp", (req, res) => {
//     const { aadhaar } = req.body;
//     if (!/^\d{12}$/.test(aadhaar || "")) {
//         return res.status(400).json({ success: false, message: "Invalid Aadhaar" });
//     }
//     const otp = generateOtp();
//     OTP_STORE[aadhaar] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
//     console.log(`[DEV] OTP for ${aadhaar}: ${otp}`);
//     return res.json({ success: true, message: "OTP sent (simulated)" });
// });

// // OTP verify
// app.post("/api/verify-otp", (req, res) => {
//     const { aadhaar, otp } = req.body;
//     const entry = OTP_STORE[aadhaar];
//     if (!entry) return res.status(400).json({ success: false, message: "No OTP requested" });
//     if (Date.now() > entry.expiresAt) return res.status(400).json({ success: false, message: "OTP expired" });
//     if (entry.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });
//     delete OTP_STORE[aadhaar];
//     return res.json({ success: true });
// });

// // Form submission
// // Form submission
// app.post("/api/submit", async (req, res) => {
//     const submission = { ...req.body, receivedAt: new Date().toISOString() };

//     // Validate
//     const validation = validateSubmission(submission);
//     if (!validation.valid) {
//         return res.status(400).json({ success: false, message: validation.message });
//     }

//     // Save to file
//     const data = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, "utf8"));
//     data.push(submission);
//     fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(data, null, 2));

//     // Save to DB (map aadhaar -> aadhaarNumber)
//     try {
//         await prisma.submission.create({
//             data: {
//                 aadhaarNumber: submission.aadhaar,
//                 ...submission
//             }
//         });
//     } catch (err) {
//         console.error("DB Save Error:", err.message);
//     }

//     return res.json({ success: true, submissionId: data.length });
// });


// const port = process.env.PORT || 5000;

// // 🟢 ये condition ensure करती है कि tests में server listen ना हो
// if (require.main === module) {
//     app.listen(port, () => console.log("Server listening on", port));
// }

// // 🟢 Jest के लिए app export कर रहे हैं
// module.exports = app;






// import express, { Request, Response } from "express";
// import fs from "fs";
// import path from "path";
// import cors from "cors";
// import bodyParser from "body-parser";

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // OTP store
// const OTP_STORE: Record<string, { otp: string; expiresAt: number }> = {};
// const SUBMISSIONS_FILE = path.join(__dirname, "data", "submissions.json");

// // Ensure data folder exists
// if (!fs.existsSync(path.dirname(SUBMISSIONS_FILE))) {
//   fs.mkdirSync(path.dirname(SUBMISSIONS_FILE), { recursive: true });
// }
// if (!fs.existsSync(SUBMISSIONS_FILE)) {
//   fs.writeFileSync(SUBMISSIONS_FILE, "[]");
// }

// // Load scraped schema if exists
// const scrapedSchemaPath = path.join(__dirname, "scraped_schema.json");
// let scrapedSchema: any = null;
// if (fs.existsSync(scrapedSchemaPath)) {
//   scrapedSchema = JSON.parse(fs.readFileSync(scrapedSchemaPath, "utf8"));
// } else {
//   console.warn("⚠ scraped_schema.json not found. Validation will be skipped.");
// }

// // OTP generator
// function generateOtp() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // Validate data using scraped schema
// function validateSubmission(data: any) {
//   if (!scrapedSchema) return { valid: true };

//   const allFields = [...(scrapedSchema.step1 || []), ...(scrapedSchema.step2 || [])];

//   for (const field of allFields) {
//     const value = data[field.name];

//     // Required check
//     if (field.required && (value === undefined || value === "")) {
//       return { valid: false, message: `${field.label} is required` };
//     }

//     // Pattern check
//     if (field.pattern && value) {
//       const regex = new RegExp(field.pattern);
//       if (!regex.test(value)) {
//         return { valid: false, message: `${field.label} is invalid` };
//       }
//     }
//   }

//   return { valid: true };
// }

// // OTP send
// app.post("/api/send-otp", (req: Request, res: Response) => {
//   const { aadhaar } = req.body;

//   if (!/^\d{12}$/.test(aadhaar || "")) {
//     return res.status(400).json({ success: false, message: "Invalid Aadhaar" });
//   }

//   const otp = generateOtp();
//   OTP_STORE[aadhaar] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

//   console.log(`[DEV] OTP for ${aadhaar}: ${otp}`); // Simulated OTP send
//   return res.json({ success: true, message: "OTP sent (simulated)" });
// });

// // OTP verify
// app.post("/api/verify-otp", (req: Request, res: Response) => {
//   const { aadhaar, otp } = req.body;
//   const entry = OTP_STORE[aadhaar];

//   if (!entry) return res.status(400).json({ success: false, message: "No OTP requested" });
//   if (Date.now() > entry.expiresAt) return res.status(400).json({ success: false, message: "OTP expired" });
//   if (entry.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });

//   delete OTP_STORE[aadhaar];
//   return res.json({ success: true });
// });

// // Form submission
// app.post("/api/submit", async (req: Request, res: Response) => {
//   const submission = { ...req.body, receivedAt: new Date().toISOString() };

//   // Validate
//   const validation = validateSubmission(submission);
//   if (!validation.valid) {
//     return res.status(400).json({ success: false, message: validation.message });
//   }

//   // Save to file
//   const data = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, "utf8"));
//   data.push(submission);
//   fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(data, null, 2));

//   return res.json({ success: true, submissionId: data.length });
// });

// const port = process.env.PORT || 5000;

// // Run server only if not in test mode
// if (require.main === module) {
//   app.listen(port, () => console.log("Server listening on", port));
// }

// // Export for testing
// export default app;













import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// OTP memory store
const OTP_STORE: Record<string, { otp: string; expiresAt: number }> = {};
const SUBMISSIONS_FILE = path.join(__dirname, "data", "submissions.json");

// Ensure submissions file exists
if (!fs.existsSync(path.dirname(SUBMISSIONS_FILE))) {
  fs.mkdirSync(path.dirname(SUBMISSIONS_FILE), { recursive: true });
}
if (!fs.existsSync(SUBMISSIONS_FILE)) {
  fs.writeFileSync(SUBMISSIONS_FILE, "[]");
}

// Load scraped schema if exists
const scrapedSchemaPath = path.join(__dirname, "scraped_schema.json");
let scrapedSchema: any = null;
if (fs.existsSync(scrapedSchemaPath)) {
  scrapedSchema = JSON.parse(fs.readFileSync(scrapedSchemaPath, "utf8"));
} else {
  console.warn("⚠ scraped_schema.json not found. Validation will be skipped.");
}

// OTP generator
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Validate form submission
function validateSubmission(data: any) {
  if (!scrapedSchema) return { valid: true };

  const allFields = [...(scrapedSchema.step1 || []), ...(scrapedSchema.step2 || [])];

  for (const field of allFields) {
    const value = data[field.name];

    // Required field check
    if (field.required && (value === undefined || value === "")) {
      return { valid: false, message: `${field.label} is required` };
    }

    // Pattern check
    if (field.pattern && value) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        return { valid: false, message: `${field.label} is invalid` };
      }
    }
  }

  return { valid: true };
}

// API — Send OTP
app.post("/api/send-otp", (req: Request, res: Response) => {
  const { aadhaar } = req.body;

  if (!/^\d{12}$/.test(aadhaar || "")) {
    return res.status(400).json({ success: false, message: "Invalid Aadhaar" });
  }

  const otp = generateOtp();
  OTP_STORE[aadhaar] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  console.log(`[DEV] OTP for ${aadhaar}: ${otp}`); // Simulated SMS send
  return res.json({ success: true, message: "OTP sent (simulated)" });
});

// API — Verify OTP
app.post("/api/verify-otp", (req: Request, res: Response) => {
  const { aadhaar, otp } = req.body;
  const entry = OTP_STORE[aadhaar];

  if (!entry) return res.status(400).json({ success: false, message: "No OTP requested" });
  if (Date.now() > entry.expiresAt) return res.status(400).json({ success: false, message: "OTP expired" });
  if (entry.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });

  delete OTP_STORE[aadhaar];
  return res.json({ success: true });
});

// API — Submit form
app.post("/api/submit", (req: Request, res: Response) => {
  const submission = { ...req.body, receivedAt: new Date().toISOString() };

  const validation = validateSubmission(submission);
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  const data = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, "utf8"));
  data.push(submission);
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(data, null, 2));

  return res.json({ success: true, submissionId: data.length });
});

const port = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(port, () => console.log("✅ Server listening on", port));
}

export default app;

