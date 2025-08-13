
const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
  const url = "https://udyamregistration.gov.in/UdyamRegistration.aspx";
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  const schema = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll("input, select, textarea, button"));

    const normalizeLabel = (el) => {
      const id = el.id || el.name;
      let label = "";
      if (id) {
        const l = document.querySelector(`label[for="${id}"]`);
        if (l) label = l.innerText.trim();
      }
      if (!label) {
        let p = el.closest("label");
        if (p) label = p.innerText.trim();
      }
      if (!label) {
        const prev = el.previousElementSibling;
        if (prev && prev.tagName.toLowerCase() === "label") label = prev.innerText.trim();
      }
      if (!label) {
        label = el.placeholder || el.name || el.id || el.type;
      }
      return label.replace(/\s+/g, " ").trim();
    };

    return nodes
      .filter((n) => {
        const style = window.getComputedStyle(n);
        if (style && (style.display === "none" || style.visibility === "hidden")) return false;
        if (n.type === "hidden") return false;
        return true;
      })
      .map((el) => {
        const type = el.tagName.toLowerCase() === "button" ? "button" : el.type || el.tagName.toLowerCase();
        const name = el.name || el.id || "";
        const label = normalizeLabel(el);
        const required =
          el.required ||
          el.getAttribute("aria-required") === "true" ||
          !!el.getAttribute("data-val-required");
        const pattern =
          el.getAttribute("pattern") ||
          el.getAttribute("data-val-regex-pattern") ||
          el.getAttribute("data-val-regex");
        const placeholder = el.getAttribute("placeholder") || "";
        let options = null;
        if (el.tagName.toLowerCase() === "select") {
          options = Array.from(el.options || []).map((o) => ({ value: o.value, label: o.text }));
        }
        return { name, label, type, required, pattern, placeholder, options };
      });
  });


  const step1Fields = schema.filter((f) =>
    ["aadhaar", "otp"].some((key) => f.name?.toLowerCase().includes(key))
  );
  const step2Fields = schema.filter((f) =>
    ["pan"].some((key) => f.name?.toLowerCase().includes(key))
  );

  const finalSchema = {
    step1: step1Fields,
    step2: step2Fields,
  };

  fs.writeFileSync("scraped_schema.json", JSON.stringify(finalSchema, null, 2));
  console.log("✅ Saved scraped_schema.json with step1 & step2");
  await browser.close();
})();
