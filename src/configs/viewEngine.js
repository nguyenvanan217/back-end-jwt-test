import express from "express";
import path from "path";
const configViewEngine = (app) => {
  app.use(express.static("./src/public"));
  app.set("view engine", "ejs");
  app.set("view", ".src/views");
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
};
export default configViewEngine;
