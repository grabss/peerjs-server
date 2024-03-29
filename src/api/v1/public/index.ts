import express from "express";
import { IConfig } from "../../../config";
import { IRealm } from "../../../models/realm";

export default ({ config, realm }: {
  config: IConfig, realm: IRealm
}): express.Router => {
  const app = express.Router();

  app.get("/id", (_, res: express.Response) => {
    res.contentType("html");
    res.send(realm.generateClientId(config.generateClientId));
  });

  return app;
};
