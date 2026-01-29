import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import appStyles from "./App.css?inline"; // Vite magic for string loading

let root = null;
let container = null;

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "toggleSearch") {
    root ? cleanup() : setup(request.tabs);
  }
});

function setup(tabs) {
  container = document.createElement("div");
  container.id = "texttabber-extension-root";

  // High z-index and pointer-events ensure we are "on top"
  container.style.cssText = "position:fixed; z-index:2147483647;";

  const shadow = container.attachShadow({ mode: "open" });
  // Inject CSS into the shadow root
  const styleSheet = document.createElement("style");
  styleSheet.textContent = appStyles;
  shadow.appendChild(styleSheet);

  const reactRoot = document.createElement("div");
  // Adding tabIndex allows the div to hold focus
  reactRoot.tabIndex = -1;
  shadow.appendChild(reactRoot);

  document.body.appendChild(container);
  root = ReactDOM.createRoot(reactRoot);
  root.render(<App initialTabs={tabs} close={cleanup} />);
}

function cleanup() {
  if (root) {
    root.unmount();
    container.remove();
    root = null;
    container = null;
  }
}
