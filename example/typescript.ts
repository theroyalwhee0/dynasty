/**
 * Example showing off how to define the dyn param type for a factory function.
 */

/**
 * Imports
 */
import { dynasty } from "@theroyalwhee0/dynasty";
import { DynastyFactoryFn } from "@theroyalwhee0/dynasty"; // Optional depending on how you want to define your factory functions.

// ParamFn type for Application Factory.
type ApplicationDependencies = {
  log: (...args) => void;
};

/**
 * Application factories.
 */

// Define by typing the "dyn" parameter.
function applicationFactory(dyn: () => ApplicationDependencies) {
  const { log } = dyn();
  log("> Application started");
  return {
    name: "This is the application",
  };
}
// OR define the function as a whole using generics.
const anotherApplicationFactory: DynastyFactoryFn<ApplicationDependencies> = function (
  dyn
) {
  const { log } = dyn();
  log("> Application 2 started");
  return {
    name: "This is the application 2",
  };
};

/**
 * Log factory.
 */
function logFactory() {
  return function log(...args) {
    console.log(...args);
  };
}

/**
 * Main. IIFE.
 */
(async function main() {
  console.log("> Start");
  await dynasty(({ add, once, depends, attach, entryPoint }) => {
    add("start", entryPoint(), depends("app2"));
    add("app", once(applicationFactory), attach("log"));
    add("app2", once(anotherApplicationFactory), attach("log"), depends("app"));
    add("log", once(logFactory));
  });
  console.log("> End");
})();
