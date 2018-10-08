
const express = require("express");
const {[MODEL_NAME]} = require("../db/");
const router = express.Router();
const { theme } = require("../config/_server-config");

router.post('/[MODEL_NAME]', (req, res) => {
  console.log("Made it to BE CREATE", req.body);

  [MODEL_NAME]
    .create(req.body)
    .then(data => {
      res.status(200).json(data);
      console.log(
        theme.success(`New ${[MODEL_NAME]} created: \n`),
        theme.data(`${data}`)
      );
    })
    .catch(error => {
      console.log(error);
      console.log(error.message);
      res.status(500).json({ error: error.message });
    });
});

// GET All
router.get('/[MODEL_NAME]', (req, res) => {
  console.log("Made it to BE");
  [MODEL_NAME]
    .find()
    .then(data => res.status(200).json(data))
    .catch(error =>
      res.status(500).json({
        error: error.message
      })
    );
});

// GET (by id)
router.get('/[MODEL_NAME]/:id', (req, res) => {
  [MODEL_NAME]
    .findById(req.params.id)
    .then(data => res.status(200).json(data))
    .catch(error =>
      res.status(500).json({
        error: error.message
      })
    );
});

// UPDATE
router.put('/[MODEL_NAME]/:i', (req, res) => {
  [MODEL_NAME]
    .findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then(data => {
      res.status(200).json(data);
      console.log(
        theme.updated(`\n${[MODEL_NAME]} updated: \n`),
        theme.data(`${data}`)
      );
    })
    .catch(error =>
      res.status(500).json({
        error: error.message
      })
    );
});

// DESTROY
router.delete('/[MODEL_NAME]/:id', (req, res) => {
  [MODEL_NAME]
    .findByIdAndRemove(req.params.id)
    .then(data => {
      res.status(200).json(data);
      console.log(
        theme.deletion(`\n${[MODEL_NAME]}s deleted: \n`),
        theme.data(`${data}`)
      );
    })
    .catch(error =>
      res.status(500).json({
        error: error.message
      })
    );
});

console.log(
  theme.connection('/[MODEL_NAME] crud [MODEL_NAME]s created.')
);

module.exports = router;
