const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Replicate = require("replicate");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const { downloadImage, imageUploader } = require("./controllers/imgHandler");
const { jsonUpdater } = require("./controllers/jsonHandler");
const { HfInference } = require("@huggingface/inference");
const HF_TOKEN = "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";

const inference = new HfInference(HF_TOKEN);

// You can also omit "model" to use the recommended model for the task

const replicate = new Replicate({
  auth: "r8_TDtyrK0rwOmzbqm68k7cA1ZiDISB0TP0u69uZ",
});

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5174/",
      "http://localhost:5173/",
      "https://artorise.vercel.app/",
      "https://artorise-frontend.onrender.com/",
      "http://localhost:3003",
      "http://localhost:3002",
    ],
  })
  // cors()
);

app.use(express.static(path.resolve(__dirname, "dist")));

// Catch-all route to serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist/index.html"));
});
app.get("/getdata", (req, res) => {
  fs.readFile("../backend/server.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Send the JSON data as the response
    res.json(jsonData);
  });
});
// Apply the JWT verification middleware to all rout

app.get("/check", (req, res) => {
  res.send("working");
});
app.post("/apiforimage", async (req, res) => {
  // const output = await replicate.run(
  //   "playgroundai/playground-v2-1024px-aesthetic:42fe626e41cc811eaf02c94b892774839268ce1994ea778eba97103fe1ef51b8",
  //   {
  //     input: {
  //       width: 1024,
  //       height: 704,
  //       prompt:
  //         "generate image for depicting the month" +
  //         req.body.desc +
  //         "cinematic, dramatic",
  //       refine: "expert_ensemble_refiner",
  //       scheduler: "K_EULER",
  //       lora_scale: 0.6,
  //       num_outputs: 1,
  //       guidance_scale: 7.5,
  //       apply_watermark: false,
  //       high_noise_frac: 0.8,
  //       negative_prompt: "",
  //       prompt_strength: 0.8,
  //       num_inference_steps: 25,
  //     },
  //   }
  // );

  let output2 = await inference.textToImage({
    model: "stabilityai/stable-diffusion-2",
    inputs:
      "generate image for depicting the month" +
      req.body.desc +
      "cinematic, dramatic",
    parameters: {
      negative_prompt: "blurry",
    },
  });
  console.log(output2);
  let uuid = crypto.randomUUID();

  await imageUploader(output2, uuid).then(async (imgdata) => {
    await jsonUpdater(uuid, imgdata.url, req.body.desc, req.body.title);
    res.json({ output: imgdata.url });
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
