module.exports = {
  data: {
    name: "Send JSON To WebAPI",
  },
  category: "WebAPIs",
  UI: [
    {
      element: "input",
      name: "WebAPI URL",
      storeAs: "url",
    },
    "-",
    {
      element: "largeInput",
      storeAs: "JSON",
      name: "JSON",
    },
    "-",
    {
      element: "largeInput",
      name: "Headers",
      placeholder: "User-Agent: MyClient \nContent-Type: application/json",
      storeAs: "headers",
    },
    "-",
    {
      name: "Method",
      element: "dropdown",
      storeAs: "method",
      choices: [
        {name: "Post"},
        {name: "Put"},
        {name: "Patch"},
      ]
    },
    "-",
    {
      element: "store",
      name: "Store Response As",
      storeAs: "responseStore",
    },
  ],
  subtitle: "Send JSON to $[url]$",
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    const jsonToSend = bridge.transf(values.JSON);
    const url = bridge.transf(values.url);
    const headers = bridge.transf(values.headers);

    const fetch = (...args) =>
      import("node-fetch").then(({ default: fetch }) => fetch(...args));

    const setHeaders = {};
    setHeaders["User-Agent"] = "Other"; // Default User-Agent

    if (headers) {
      const lines = String(headers).split("\n");
      for (let i = 0; i < lines.length; i++) {
        const header = lines[i].split(":");
        if (lines[i].includes(":") && header.length > 0) {
          const key = header[0].trim();
          const value = header[1].trim();
          setHeaders[key] = value;
        } else {
          console.error(
            `SendJSON: Error: Custom Header line ${lines[i]} is wrongly formatted. You must split the key from the value with a colon (:)`
          );
        }
      }
    }

    let responseData = await fetch(url, {
      method: values.method.toUpperCase(),
      headers: setHeaders,
      body: jsonToSend,
    }).catch((error) => {
      console.error("SendJSON: Error sending JSON to Web API", error);
    });
    responseData = await responseData.json();
    bridge.store(values.responseStore, responseData);
  },
};
