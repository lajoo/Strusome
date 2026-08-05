import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API to list permanent background images
  app.get("/api/backgrounds", (req, res) => {
    const publicBgDir = path.join(process.cwd(), "public", "backgrounds");
    const jsonPath = path.join(publicBgDir, "list.json");
    if (fs.existsSync(jsonPath)) {
      try {
        const list = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        return res.json(list);
      } catch (err) {
        console.error("Error reading backgrounds list:", err);
      }
    }
    return res.json([]);
  });

  // API to list permanent library images
  app.get("/api/images", (req, res) => {
    const publicImgDir = path.join(process.cwd(), "public", "images");
    const jsonPath = path.join(publicImgDir, "list.json");
    if (fs.existsSync(jsonPath)) {
      try {
        const list = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        return res.json(list);
      } catch (err) {
        console.error("Error reading images list:", err);
      }
    }
    return res.json([]);
  });

  // API to upload exact original background image files
  app.post("/api/upload-background", (req, res) => {
    try {
      const { fileName, dataUrl } = req.body || {};
      if (!fileName || !dataUrl) {
        return res.status(400).json({ error: "fileName and dataUrl are required" });
      }

      const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const publicBgDir = path.join(process.cwd(), "public", "backgrounds");
      const distBgDir = path.join(process.cwd(), "dist", "backgrounds");

      if (!fs.existsSync(publicBgDir)) fs.mkdirSync(publicBgDir, { recursive: true });
      if (!fs.existsSync(distBgDir)) fs.mkdirSync(distBgDir, { recursive: true });

      const safeName = fileName.replace(/[^a-zA-Z0-9_.-]/g, "_");
      const publicFilePath = path.join(publicBgDir, safeName);
      const distFilePath = path.join(distBgDir, safeName);

      fs.writeFileSync(publicFilePath, buffer);
      fs.writeFileSync(distFilePath, buffer);

      const jsonPath = path.join(publicBgDir, "list.json");
      const distJsonPath = path.join(distBgDir, "list.json");

      let currentList = [];
      if (fs.existsSync(jsonPath)) {
        try { currentList = JSON.parse(fs.readFileSync(jsonPath, "utf-8")); } catch (e) {}
      }

      const fileUrl = `/backgrounds/${safeName}`;
      const cleanTitle = fileName.replace(/\.[^/.]+$/, "");

      const newItem = {
        id: `bg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: cleanTitle,
        category: "Uploaded Background",
        tags: ["uploaded", "custom", cleanTitle.toLowerCase()],
        url: fileUrl
      };

      const existingIdx = currentList.findIndex((item: any) => item.url === fileUrl);
      if (existingIdx >= 0) {
        currentList[existingIdx] = newItem;
      } else {
        currentList.push(newItem);
      }

      fs.writeFileSync(jsonPath, JSON.stringify(currentList, null, 2));
      fs.writeFileSync(distJsonPath, JSON.stringify(currentList, null, 2));

      return res.json({ success: true, item: newItem, list: currentList });
    } catch (err: any) {
      console.error("Failed to save uploaded background:", err);
      return res.status(500).json({ error: err.message || "Failed to save image" });
    }
  });

  // API to upload exact original feature library image files
  app.post("/api/upload-image", (req, res) => {
    try {
      const { fileName, dataUrl } = req.body || {};
      if (!fileName || !dataUrl) {
        return res.status(400).json({ error: "fileName and dataUrl are required" });
      }

      const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const publicImgDir = path.join(process.cwd(), "public", "images");
      const distImgDir = path.join(process.cwd(), "dist", "images");

      if (!fs.existsSync(publicImgDir)) fs.mkdirSync(publicImgDir, { recursive: true });
      if (!fs.existsSync(distImgDir)) fs.mkdirSync(distImgDir, { recursive: true });

      const safeName = fileName.replace(/[^a-zA-Z0-9_.-]/g, "_");
      const publicFilePath = path.join(publicImgDir, safeName);
      const distFilePath = path.join(distImgDir, safeName);

      fs.writeFileSync(publicFilePath, buffer);
      fs.writeFileSync(distFilePath, buffer);

      const jsonPath = path.join(publicImgDir, "list.json");
      const distJsonPath = path.join(distImgDir, "list.json");

      let currentList = [];
      if (fs.existsSync(jsonPath)) {
        try { currentList = JSON.parse(fs.readFileSync(jsonPath, "utf-8")); } catch (e) {}
      }

      const fileUrl = `/images/${safeName}`;
      const cleanTitle = fileName.replace(/\.[^/.]+$/, "");

      const newItem = {
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: cleanTitle,
        category: "Uploaded",
        url: fileUrl,
        tagline: cleanTitle
      };

      const existingIdx = currentList.findIndex((item: any) => item.url === fileUrl);
      if (existingIdx >= 0) {
        currentList[existingIdx] = newItem;
      } else {
        currentList.push(newItem);
      }

      fs.writeFileSync(jsonPath, JSON.stringify(currentList, null, 2));
      fs.writeFileSync(distJsonPath, JSON.stringify(currentList, null, 2));

      return res.json({ success: true, item: newItem, list: currentList });
    } catch (err: any) {
      console.error("Failed to save uploaded image:", err);
      return res.status(500).json({ error: err.message || "Failed to save image" });
    }
  });

  // API endpoint for password verification
  app.post("/api/verify-password", (req, res) => {
    const { password } = req.body || {};
    const validPassword = process.env.TEAM_PASSWORD || "linkedin2026";
    if (password === validPassword) {
      return res.json({ success: true, token: "authenticated_team_session_2026" });
    }
    return res.status(401).json({ success: false, error: "Incorrect team access password." });
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "LinkedIn Post Creator" });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
