/* eslint-disable no-undef */
/**
 * Service workers are not tied to any specific page and do not get garbage
 * collected when a tab is closed, so service workers can have 0 or more
 * associated tabs
 *
 * Service workers are useful to do cache management of a website or SPA
 */

// register a serviceworker with the browser
navigator.serviceWorker.register("/sw.ts", {
  scope: "/", // scope determines origin wherein any HTML pages that have their requests passed thru service workers
});

navigator.serviceWorker.oncontrollerchange = () => {
  console.log("controller change");
};

async function makeRequest() {
  const result = await fetch("/data.json");
  const payload = await result.json();
  console.log(payload);
}
