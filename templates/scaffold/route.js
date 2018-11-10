module.exports = ({ model_name }) => {
  return `const express = require("express");
const { ${model_name} } = require("../db/");
const router = express.Router();
const { theme } = require("../config/_server-config");


// CREATE NEW ${model_name} DOCUMENTS 
router.post('/${model_name}', (req, res) => {
  ${model_name}
    .create(req.body)
    .then(data => {
      res.status(200).json(data);
      console.log(
        theme.success("New ${model_name} created:"),
        theme.data(data)
      );
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

// GET All ${model_name} DOCUMENTS
router.get('/${model_name}', (req, res) => {
  ${model_name}
    .find()
    .then(data => res.status(200).json(data))
    .catch(error =>
      res.status(500).json({
        error: error.message
      })
    );
});

// GET SINGLE ${model_name} DOCUMENT (by id)
router.get('/${model_name}/:id', (req, res) => {
  ${model_name}
    .findById(req.params.id)
    .then(data => res.status(200).json(data))
    .catch(error =>
      res.status(500).json({
        error: error.message
      })
    );
});

// UPDATE ${model_name} DOCUMENT
router.put('/${model_name}/:id', (req, res) => {
  ${model_name}
    .findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then(data => {
      res.status(200).json(data);
      console.log(
        theme.updated("${model_name} updated:"),
        theme.data(data)
      );
    })
    .catch(error =>
      res.status(500).json({
        error: error.message
      })
    );
});

// DESTROY ${model_name} DOCUMENT
router.delete('/${model_name}/:id', (req, res) => {
  ${model_name}
    .findByIdAndRemove(req.params.id)
    .then(data => {
      res.status(200).json(data);
      console.log(
        theme.deletion("${model_name} deleted:"),
        theme.data(data)
      );
    })
    .catch(error =>
      res.status(500).json({
        error: error.message
      })
    );
});

console.log(
  theme.connection("/${model_name} crud ${model_name}s created.")
);

module.exports = router;
`;
};

// const express = require("express");
// const {${model_name}} = require("../db/");
// const router = express.Router();
// const { theme } = require("../config/_server-config");

// router.post('/${model_name}', (req, res) => {
//   console.log("Made it to BE CREATE", req.body);

//   ${model_name}
//     .create(req.body)
//     .then(data => {
//       res.status(200).json(data);
//       console.log(
//         theme.success(`New ${${model_name}} created: \n`),
//         theme.data(`${data}`)
//       );
//     })
//     .catch(error => {
//       console.log(error);
//       console.log(error.message);
//       res.status(500).json({ error: error.message });
//     });
// });

// // GET All
// router.get('/${model_name}', (req, res) => {
//   console.log("Made it to BE");
//   ${model_name}
//     .find()
//     .then(data => res.status(200).json(data))
//     .catch(error =>
//       res.status(500).json({
//         error: error.message
//       })
//     );
// });

// // GET (by id)
// router.get('/${model_name}/:id', (req, res) => {
//   ${model_name}
//     .findById(req.params.id)
//     .then(data => res.status(200).json(data))
//     .catch(error =>
//       res.status(500).json({
//         error: error.message
//       })
//     );
// });

// // UPDATE
// router.put('/${model_name}/:i', (req, res) => {
//   ${model_name}
//     .findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
//     .then(data => {
//       res.status(200).json(data);
//       console.log(
//         theme.updated(`\n${${model_name}} updated: \n`),
//         theme.data(`${data}`)
//       );
//     })
//     .catch(error =>
//       res.status(500).json({
//         error: error.message
//       })
//     );
// });

// // DESTROY
// router.delete('/${model_name}/:id', (req, res) => {
//   ${model_name}
//     .findByIdAndRemove(req.params.id)
//     .then(data => {
//       res.status(200).json(data);
//       console.log(
//         theme.deletion(`\n${${model_name}}s deleted: \n`),
//         theme.data(`${data}`)
//       );
//     })
//     .catch(error =>
//       res.status(500).json({
//         error: error.message
//       })
//     );
// });

// console.log(
//   theme.connection('/${model_name} crud ${model_name}s created.')
// );

// module.exports = router;
