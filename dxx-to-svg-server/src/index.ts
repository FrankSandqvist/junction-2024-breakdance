import express, { Express, Request, Response } from "express";
import * as proc from "child_process";
import { nanoid } from "nanoid";
import { promisify } from "util";
import { createWriteStream } from "fs";
import * as StreamPromises from "stream/promises";

const exec = promisify(proc.exec);

const app: Express = express();
const port = process.env.PORT;

app.use("/v1/files", express.static("files"));

app.post("/v1/upload/:ext", async (req: Request, res: Response) => {
  const uploadedFile = `${nanoid()}.${req.params.ext}`;

  const stream = createWriteStream(`./files/${uploadedFile}`);
  await StreamPromises.pipeline(req, stream);

  res.json({
    uploadedFile,
  });
});

app.post(
  "/v1/dxx-to-svg",
  express.json(),
  async (req: Request, res: Response) => {
    const svgFile = `${nanoid()}.svg`;

    await exec(
      `${process.env.QCAD_DXX_TO_SVG_PATH} -u=mm -min-lineweight=0.1 -o ./files/${svgFile} ./files/${req.body.dxxFile}`
    );

    res.json({
      svgFile,
    });
  }
);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
