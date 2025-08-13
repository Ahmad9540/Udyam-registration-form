import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OTP_STORE: Record<string, { otp: string; expiresAt: number }> = {};
const SUBMISSIONS_FILE = path.join(__dirname, "data", "submissions.json");

if (!fs.existsSync(path.dirname(SUBMISSIONS_FILE))) {
  fs.mkdirSync(path.dirname(SUBMISSIONS_FILE), { recursive: true });
}
if (!fs.existsSync(SUBMISSIONS_FILE)) {
  fs.writeFileSync(SUBMISSIONS_FILE, "[]");
}

const scrapedSchemaPath = path.join(__dirname, "scraped_schema.json");
let scrapedSchema: any = null;
if (fs.existsSync(scrapedSchemaPath)) {
  scrapedSchema = JSON.parse(fs.readFileSync(scrapedSchemaPath, "utf8"));
} else {
  console.warn("⚠ scraped_schema.json not found. Validation will be skipped.");
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function validateSubmission(data: any) {
  if (!scrapedSchema) return { valid: true };

  const allFields = [...(scrapedSchema.step1 || []), ...(scrapedSchema.step2 || [])];

  for (const field of allFields) {
    const value = data[field.name];

    if (field.required && (value === undefined || value === "")) {
      return { valid: false, message: `${field.label} is required` };
    }

    if (field.pattern && value) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        return { valid: false, message: `${field.label} is invalid` };
      }
    }
  }

  return { valid: true };
}

app.post("/api/send-otp", (req: Request, res: Response) => {
  const { aadhaar } = req.body;

  if (!/^\d{12}$/.test(aadhaar || "")) {
    return res.status(400).json({ success: false, message: "Invalid Aadhaar" });
  }

  const otp = generateOtp();
  OTP_STORE[aadhaar] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  console.log(`[DEV] OTP for ${aadhaar}: ${otp}`); 
  return res.json({ success: true, message: "OTP sent (simulated)" });
});

app.post("/api/verify-otp", (req: Request, res: Response) => {
  const { aadhaar, otp } = req.body;
  const entry = OTP_STORE[aadhaar];

  if (!entry) return res.status(400).json({ success: false, message: "No OTP requested" });
  if (Date.now() > entry.expiresAt) return res.status(400).json({ success: false, message: "OTP expired" });
  if (entry.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });

  delete OTP_STORE[aadhaar];
  return res.json({ success: true });
});

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

