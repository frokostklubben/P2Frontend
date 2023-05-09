import "https://unpkg.com/navigo"; //Will create the global Navigo object used below
import "https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.0/purify.min.js";

import {
  setActiveLink,
  adjustForMissingHash,
  renderTemplate,
  loadTemplate,
} from "./utils.js";

import { initSleepingBagResult } from "./pages/sleeping-bag-result/sleeping-bag-result.js";
import { initSleepingBagForm } from "./pages/sleeping-bag-form/sleeping-bag-form.js";
import { initSleepingBagForm2 } from "./pages/sleeping-bag-form2/sleeping-bag-form2.js";

window.addEventListener("load", async () => {
  const templateSleepingBagResult = await loadTemplate(
    "./pages/sleeping-bag-result/sleeping-bag-result.html"
  );
  const templateSleepingBagForm = await loadTemplate(
    "./pages/sleeping-bag-form/sleeping-bag-form.html"
  );
  const templateSleepingBagForm2 = await loadTemplate(
    "./pages/sleeping-bag-form2/sleeping-bag-form2_udvikles.html"
  );
  const templateNotFound = await loadTemplate("./pages/notFound/notFound.html");

  adjustForMissingHash();

  const router = new Navigo("/", { hash: true });

  window.router = router;

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url);
        done();
      },
    })
    .on({
      //For very simple "templates", you can just insert your HTML directly like below
      "/": () =>
        (document.getElementById("content").innerHTML = `
      <p style='margin-top:2em'>
      
      </p>
     `),
      "/sleeping-bag-result": () => {
        renderTemplate(templateSleepingBagResult, "content");
        initSleepingBagResult();
      },

      "/sleeping-bag-form": () => {
        renderTemplate(templateSleepingBagForm, "content");
        initSleepingBagForm();
      },

      "/sleeping-bag-form2": () => {
        renderTemplate(templateSleepingBagForm2, "content");
        initSleepingBagForm2();
      },
    })
    .notFound(() => {
      renderTemplate(templateNotFound, "content");
    })
    .resolve();
});

window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert(
    "Error: " +
      errorMsg +
      " Script: " +
      url +
      " Line: " +
      lineNumber +
      " Column: " +
      column +
      " StackTrace: " +
      errorObj
  );
};
