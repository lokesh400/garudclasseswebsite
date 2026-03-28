const express = require("express");
const router = express.Router();
const recUrl = "https://garudclasseserp.onrender.com";

router.get("/", async (req, res) => {
  const recruitments = await fetch(`${recUrl}/recruitments`).then((r) => r.json()).catch(() => []);
  res.render("recruitments/public-list", {
    recruitments,
    layout: false,
  });
});

router.get("/:id", async (req, res) => {
  const recruitment = await fetch(`${recUrl}/recruitments/${req.params.id}`).then((r) => r.json()).catch(() => null);
  if (!recruitment) {
    return res.status(404).send("Recruitment not found");
  }
  res.render("recruitments/public-view", {
    recruitment,
    layout: false,
  });
});

router.get("/:id/apply", async (req, res) => {
  const recruitment = await fetch(`${recUrl}/recruitments/${req.params.id}`).then((r) => r.json()).catch(() => null);
  if (!recruitment || recruitment.status !== "Open") {
    return res.status(404).send("Recruitment not available for applications");
  }

  res.render("recruitments/apply", {
    recruitment,
    layout: false,
  });
});

router.post("/:id/apply", async (req, res) => {
  try {
    const targetUrl = `${recUrl}/recruitments/${req.params.id}/apply`;
    const headers = { ...req.headers };
    delete headers.host;

    // Forward the incoming request stream as-is so multipart form data/files stay intact.
    const response = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: req,
      duplex: "half",
    });

    if (response.ok) {
      return res.redirect(`/recruitments/${req.params.id}/success`);
    }

    const errorText = await response.text();
    return res.status(response.status).send(errorText || "Failed to submit application");
  } catch (error) {
    return res.status(502).send(error.message || "Failed to connect to recruitment service");
  }
});

router.get("/:id/success", async (req, res) => {
  const recruitment = await fetch(`${recUrl}/recruitments/${req.params.id}`).then((r) => r.json()).catch(() => null);
  if (!recruitment) {
    return res.status(404).send("Recruitment not found");
  }

  res.render("recruitments/success", {
    recruitment,
    layout: false,
  });
});

module.exports = router;
