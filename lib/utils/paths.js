const pathSteps = steps => {
  let pathSteps = "";
  for (let i = 0; i <= steps; i++) {
    pathSteps += "../";
  }
  if (!steps) {
    return "./";
  }
  return pathSteps;
};

const nailsPaths = path => {
  switch (path.name) {
    case "migrations":
      return `${path.root}/server/database/migrations/${
        path.file ? path.file : ""
      }`;

    case "models":
      return `${path.root}/server/database/models/${
        path.file ? path.file : ""
      }`;

    case "model_template":
      return `${pathSteps(path.steps)}templates/scaffold/model.js`;
  }
};

module.exports = nailsPaths;
