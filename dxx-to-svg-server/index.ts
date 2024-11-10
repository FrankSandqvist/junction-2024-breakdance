import * as dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import basicAuth from "express-basic-auth";
import * as fs from "fs/promises";
import * as proc from "child_process";
import { nanoid } from "nanoid";
import { promisify } from "util";
import { createWriteStream } from "fs";
import * as StreamPromises from "stream/promises";

const exec = promisify(proc.exec);

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(
  basicAuth({
    users: { internal: process.env.PASSWORD! },
  })
);

app.use("/v1/files", express.static("files"));

app.post("/v1/upload/:ext", async (req: Request, res: Response) => {
  const uploadedFile = `${nanoid()}.${req.params.ext}`;

  const stream = createWriteStream(`./files/${uploadedFile}`);
  await StreamPromises.pipeline(req, stream);
  // await file.close();

  res.json({
    uploadedFile,
  });
});

app.post(
  "/v1/dxx-to-joined-polyline",
  express.json(),
  async (req: Request, res: Response) => {
    const extension = req.body.dxxFile.split(".").pop();
    const joinedDxxFile = `${nanoid()}.${extension}`;

    const { stdout, stderr } = await exec(
      `${process.env.QCAD_PATH} -quit -exec ${process.env.QCAD_TO_JOINED_POLYLINE_SCRIPT_PATH} -o ./files/${joinedDxxFile} ./files/${req.body.dxxFile}`
    );

    console.log(stdout, stderr);

    res.json({
      joinedDxxFile,
    });
  }
);

app.post(
  "/v1/dxx-polyline-analysis",
  express.json(),
  async (req: Request, res: Response) => {
    const analysisFile = `${nanoid()}.json`;

    const { stdout, stderr } = await exec(
      `${process.env.QCAD_PATH} -quit -exec ${process.env.QCAD_ANALYSIS_SCRIPT_PATH} -o ./files/${analysisFile} ./files/${req.body.dxxFile}`
    );

    console.log(stdout, stderr);

    res.json({
      analysisFile,
    });
  }
);

app.post(
  "/v1/dxx-to-svg",
  express.json(),
  async (req: Request, res: Response) => {
    const svgFile = `${nanoid()}.svg`;

    const { stdout, stderr } = await exec(
      `${process.env.QCAD_DXX_TO_SVG_PATH} -u=mm -min-lineweight=0.1 -o ./files/${svgFile} ./files/${req.body.dxxFile}`
    );

    console.log(stdout, stderr);

    res.json({
      svgFile,
    });
  }
);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
