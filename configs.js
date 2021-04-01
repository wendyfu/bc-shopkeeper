const dotenv = require("dotenv");

module.exports = async ({ options, resolveConfigurationProperty }) => {
  const envVars = dotenv.config({ path: ".env.local" }).parsed;
  return envVars;
};
