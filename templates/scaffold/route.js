const express = require("express");
// let [[MODEL_NAME]];
require("../database").then(res => {
  [[MODEL_NAME]] = res.[[MODEL_NAME]];
});
const router = express.Router();
const logger = require("../utils/logger");

// CREATE NEW [[MODEL_NAME]] DOCUMENTS
router.post("/[[MODEL_NAME]]", (req, res) => {
  [[MODEL_NAME]].create(req.body)
    .then(data => {
      res.status(200).json(data);

      logger.success({ msg: "New [[MODEL_NAME]] created: ", data: data });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

// GET All [[MODEL_NAME]] DOCUMENTS
router.get("/[[MODEL_NAME]]", (req, res) => {
  [[MODEL_NAME]].get()
    .then(data => {
      console.log("just testing", data);
      res.status(200).json(data);
    })
    .catch(error =>
      res.status(500).json({
        error: error
      })
    );
});

// GET SINGLE [[MODEL_NAME]] DOCUMENT (by id)
router.get("/[[MODEL_NAME]]/:id", (req, res) => {
  [[MODEL_NAME]].get({ id: req.params.id })
    .then(data => res.status(200).json(data))
    .catch(error =>
      res.status(500).json({
        error: error
      })
    );
});

// UPDATE [[MODEL_NAME]] DOCUMENT
router.put("/[[MODEL_NAME]]/:id", (req, res) => {
  req.body.updated_at = Date.now();
  [[MODEL_NAME]].update(req.params.id, req.body)
    .then(data => {
      res.status(200).json(data);
      logger.success({ msg: "Post updated: ", data: data });
    })
    .catch(error =>
      res.status(500).json({
        error: error
      })
    );
});

// DESTROY [[MODEL_NAME]] DOCUMENT
router.delete("/[[MODEL_NAME]]/:id", (req, res) => {
  [[MODEL_NAME]].destroy(req.params.id)
    .then(data => {
      res.status(200).json(data);
      logger.success({ msg: "Post deleted: ", data: data });
    })
    .catch(error =>
      res.status(500).json({
        error: error
      })
    );
});

logger.info({ msg: "/[[MODEL_NAME]] route connected: " });

module.exports = router;
