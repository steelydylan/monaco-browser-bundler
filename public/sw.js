import { Hono } from "https://esm.sh/hono@3.7.3";
import localforage from "https://esm.sh/localforage@1.10.0";
import { mockJS } from "./mock.js";

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim()); // Become available to all pages
});

const app = new Hono();

app.use("/", async (c) => {
  // pass through
  return c.next();
});

app.use("/mock/:fileName", async (c) => {
  const fileName = c.req.param("fileName");
  const storage = await localforage.getItem("files");
  if (!storage) {
    return c.status(404);
  }
  if (fileName?.endsWith(".html")) {
    const file = storage["./" + fileName];
    if (!file?.value || !file?.language) {
      return c.status(404);
    }
    const { value } = file;
    return c.html(value);
  } else if (
    fileName?.endsWith(".js") ||
    fileName?.endsWith(".jsx") ||
    fileName?.endsWith(".mjs") ||
    fileName?.endsWith(".ts") ||
    fileName?.endsWith(".tsx")
  ) {
    try {
      console.log(fileName);
      const result = await mockJS(storage, fileName);
      return c.text(result, 200, {
        "Content-Type": "text/javascript",
      });
    } catch (e) {
      console.error(e);
      return c.status(500);
    }
  } else if (fileName?.endsWith(".css")) {
    const file = storage["./" + fileName];
    if (!file?.value || !file?.language) {
      return c.status(404);
    }
    const { value } = file;
    return c.text(value, 200, {
      "Content-Type": "text/css",
    });
  }
  return c.text(value);
});

app.notFound(async (c) => {
  const url = c.req.url;
  const result = await fetch(url);
  const text = await result.text();
  if (result.headers.get("Content-Type")?.includes("text/html")) {
    return c.html(text);
  } else if (
    result.headers.get("Content-Type")?.includes("application/javascript")
  ) {
    return c.text(text, 200, {
      "Content-Type": "application/javascript",
    });
  }
  return await c.next();
});

app.fire();
