const path = require("node:path");
const Module = require("node:module");

const appNodeModules = path.resolve(__dirname, "..", "node_modules");
const aliases = {
  react: path.join(appNodeModules, "react", "index.js"),
  "react/jsx-runtime": path.join(appNodeModules, "react", "jsx-runtime.js"),
  "react/jsx-dev-runtime": path.join(appNodeModules, "react", "jsx-dev-runtime.js"),
  "react-dom": path.join(appNodeModules, "react-dom", "index.js"),
  "react-dom/client": path.join(appNodeModules, "react-dom", "client.js"),
  "react-dom/server": path.join(appNodeModules, "react-dom", "server.node.js")
};

const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function patchedResolveFilename(request, parent, isMain, options) {
  if (Object.prototype.hasOwnProperty.call(aliases, request)) {
    return aliases[request];
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};
