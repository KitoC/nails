const pathSteps = steps => {
  let pathSteps = "";
  for (let i = 1; i <= steps; i++) {
    pathSteps += "../";
  }
  if (!steps) {
    return "./";
  }
  return pathSteps;
};

const models = ({ root, file }) => {
  return `${root}/server/database/models/${file ? file : ""}`;
};

// EXAMPLE
// paths.models({ root, file: `${migration.model}` });

const migrations = ({ root, file }) => {
  return `${root}/server/database/migrations/${file ? file : ""}`;
};

const routes = ({ root, file }) => {
  return `${root}/server/routes/${file ? file : ""}`;
};

const model_template = ({ root, file, steps }) => {
  return `${__dirname}/${pathSteps(steps)}templates/scaffold/model.js`;
};

const route_template = ({ root, file, steps }) => {
  return `${__dirname}/${pathSteps(steps)}templates/scaffold/route.js`;
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

    case "routes":
      return `${path.root}/server/routes/${path.file ? path.file : ""}`;

    case "model_template":
      return `${pathSteps(path.steps)}templates/scaffold/model.js`;
  }
};

const paths = {
  models,
  migrations,
  routes,
  model_template,
  route_template
};

module.exports = { nailsPaths, paths };
