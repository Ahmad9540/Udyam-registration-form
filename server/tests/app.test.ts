// const request = require("supertest");
// const app = require("../index"); // index.js का export होना जरूरी है

// describe("Udyam Form API Tests", () => {
//   // OTP send
//   test("Should send OTP for valid Aadhaar", async () => {
//     const res = await request(app)
//       .post("/api/send-otp")
//       .send({ aadhaar: "123456789012" });

//     expect(res.statusCode).toBe(200);
//     expect(res.body.success).toBe(true);
//   });

//   test("Should reject invalid Aadhaar", async () => {
//     const res = await request(app)
//       .post("/api/send-otp")
//       .send({ aadhaar: "abcd" });

//     expect(res.statusCode).toBe(400);
//     expect(res.body.success).toBe(false);
//   });

//   // OTP verify
//   test("Should fail OTP verify without sending OTP first", async () => {
//     const res = await request(app)
//       .post("/api/verify-otp")
//       .send({ aadhaar: "999999999999", otp: "123456" });

//     expect(res.statusCode).toBe(400);
//   });

//   // Form submit
//   test("Should reject form submission with missing required fields", async () => {
//     const res = await request(app)
//       .post("/api/submit")
//       .send({ aadhaar: "123456789012" }); // intentionally missing fields

//     expect(res.statusCode).toBe(400);
//     expect(res.body.success).toBe(false);
//   });
// });







const request = require("supertest");
const app = require("../index"); // index.js (या index.ts compiled) से export होना जरूरी है

describe("Udyam Form API Tests", () => {
  // OTP send
  test("Should send OTP for valid Aadhaar", async () => {
    const res = await request(app)
      .post("/api/send-otp")
      .send({ aadhaar: "123456789012" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("Should reject invalid Aadhaar", async () => {
    const res = await request(app)
      .post("/api/send-otp")
      .send({ aadhaar: "abcd" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // OTP verify
  test("Should fail OTP verify without sending OTP first", async () => {
    const res = await request(app)
      .post("/api/verify-otp")
      .send({ aadhaar: "999999999999", otp: "123456" });

    expect(res.statusCode).toBe(400);
  });

  // Form submit
  test("Should reject form submission with missing required fields", async () => {
    const res = await request(app)
      .post("/api/submit")
      .send({ aadhaar: "123456789012" }); // intentionally missing fields

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // Short version test (merged)
  test("Short: should return OTP sent message", async () => {
    const res = await request(app)
      .post("/api/send-otp")
      .send({ aadhaar: "123456789012" });

    expect(res.body.success).toBe(true);
  });
});

