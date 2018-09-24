const express = require("express");
const schema = require("../db/");
const router = express.Router();
const { theme, endpoints } = require("../config/_server-config");

// Setting up CRUD routes for Products

// CREATE a Product
endpoints.map(endpoint => {
  router.post(`/${endpoint}/`, (req, res) => {
    schema[endpoint].create(req.body)
      .then(data => {
        res.status(200).json(data);
        console.log(
          theme.success(`New ${endpoint} created: \n`),
          theme.data(`${data}`)
        );
      })
      .catch(error => res.status(500).json({ error: error.message }));
  });
  

  router.get(`/${endpoint}/`, (req, res) => {
    schema[endpoint].find()
      .then(data => res.status(200).json(data))
      .catch(error =>
        res.status(500).json({
          error: error.message
        })
      );
  });
  

  router.get(`/${endpoint}/:id`, (req, res) => {
    schema[endpoint].findById(req.params.id)
      .then(data => res.status(200).json(data))
      .catch(error =>
        res.status(500).json({
          error: error.message
        })
      );
  });
  

  router.put(`/${endpoint}/:id`, (req, res) => {
    schema[endpoint].findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
      .then(data => {
      
        res.status(200).json(data);
        console.log(
          theme.updated(`\n${endpoint} updated: \n`),
          theme.data(`${data}`)
        );
      })
      .catch(error =>
        res.status(500).json({
          error: error.message
        })
      );
  });
  

  router.delete(`/${endpoint}/:id`, (req, res) => {
    schema[endpoint].findByIdAndRemove(req.params.id)
      .then(data => {
        res.status(200).json(data);
        console.log(
          theme.deletion(`\${endpoint}s deleted: \n`),
          theme.data(`${data}`)
        );
        
      })
      .catch(error =>
        res.status(500).json({
          error: error.message
        })
      );
  });

  console.log(theme.connection(`${endpoint} crud endpoints created.`))
})
    

module.exports = router;
