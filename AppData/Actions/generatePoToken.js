module.exports = {
  data: {
    name: "Generate PO Token",
  },
  category: "Music",
  UI: [
    {
      element: "store",
      storeAs: "store",
    }
  ],
  subtitle: (values, constants) => {
    return `Store As ${constants.variable(values.store)}`
  },
  compatibility: ["Any"],
  async run(values, message, botClient, bridge) {
    return new Promise(async (res) => {
      const puppeteer = require('puppeteer');

      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: "./puppets/chrome-win64/chrome.exe"
      });

      const page = await browser.newPage();

      // Set viewport size to ensure proper rendering
      await page.setViewport({ width: 1280, height: 800 });

      const client = await page.createCDPSession();
      await client.send('Debugger.enable');
      await client.send('Debugger.setAsyncCallStackDepth', { maxDepth: 32 });
      await client.send('Network.enable');

      let isRequestCaptured = false;

      client.on("Network.requestWillBeSent", (e) => {
        if (e.request.url.includes("/youtubei/v1/player") && !isRequestCaptured) {
          const jsonData = JSON.parse(e.request.postData);

          bridge.store(values.store, {
            po: jsonData["serviceIntegrityDimensions"]["poToken"],
            vd: jsonData["context"]["client"]["visitorData"]
          });
          res({
            po: jsonData["serviceIntegrityDimensions"]["poToken"],
            vd: jsonData["context"]["client"]["visitorData"]
          })

          isRequestCaptured = true; // Mark request as captured to avoid duplicates

          // Close browser after capturing the request
          browser.close();
        }
      });

      await page.goto("https://www.youtube.com/embed/jNQXAC9IVRw", {
        waitUntil: "networkidle2"
      });

      // Ensure the play button is available
      await page.waitForSelector("#movie_player");

      const playButton = await page.$("#movie_player");
      await playButton.click();

      // Wait for a reasonable time for the network request to be captured
      await new Promise(resolve => setTimeout(resolve, 10000));

      // Close the browser if the request wasn't captured
      if (!isRequestCaptured) {
        console.error('Failed to capture the required network request');
        await browser.close();
      }
    })
  },
};
