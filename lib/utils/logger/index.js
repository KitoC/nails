const colors = require("./colors");
const util = require("util");

const errorCodes = require("./logs.error");
const infoCodes = require("./logs.info");
const successCodes = require("./logs.success");

const successTemplate = colors.success("Nailed it!        | ");
const errorTemplate = colors.error("Nailed failure:   | ");
const informationTemplate = colors.info("Nailed info:      | ");
const warningTemplate = colors.warn("Nailed warning:   | ");

const logPrettyData = data => {
  if (data) {
    console.log(
      util.inspect(data, {
        compact: false,
        depth: null,
        colors: true
      })
    );
  }
  return;
};

const error = (error, isVerbose) => {
  const { msg, code, err, after = "", data, id } = error;
  if (Object.keys(error).length === 0) {
    console.log(error);
    return;
  }
  if (err && err.id) {
    code = err.id;
  }
  if (code || (err && errorCodes[err.code])) {
    console.log(
      errorTemplate + errorCodes[code || err.code] + colors.warn(after)
    );
    logPrettyData(data);
    return;
  }
  if (err && (err.message || err.stack)) {
    console.log(errorTemplate + err.message || err.stack);
    logPrettyData(data);
    return;
  }

  console.log(errorTemplate + msg);
  logPrettyData(data);
  return;
};

const success = ({ msg, data, code, info }) => {
  let infotext = info ? info : "";

  if (code) {
    console.log(successTemplate + successCodes[code] + infotext);
    logPrettyData(data);
    return;
  }
  console.log(successTemplate + msg);
  logPrettyData(data);
  return;
};

const info = ({ msg, code, data, info }, isVerbose) => {
  let infotext = info ? info : "";

  if (code) {
    console.log(informationTemplate + infoCodes[code] + infotext);
    logPrettyData(data);
    return;
  }
  console.log(informationTemplate + msg);
  logPrettyData(data);
  return;
};

const warn = ({ msg, data, id }, isVerbose) => {
  console.log(warningTemplate + msg);
  logPrettyData(data);
  return;
};

const custom = ({ msg, template, color, data }, isVerbose) => {
  console.log(colors[color](template) + msg);
  logPrettyData(data);
  return;
};

module.exports = {
  error,
  success,
  info,
  warn,
  custom
};
