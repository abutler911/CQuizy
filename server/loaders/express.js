// loaders/configureExpress.js
import express from "express";
import bodyParser from "body-parser";
import compression from "compression";

export default (app) => {
  app.set("trust proxy", 1);

  app.use(compression());

  app.use(bodyParser.json());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/favicon.ico", (req, res) => res.status(204).end());

  return app;
};
