import { JSDOM } from 'jsdom';

(async () => {
  try {
    const dom = await JSDOM.fromURL('http://localhost:5173', {
      runScripts: "dangerously",
      resources: "usable"
    });
    
    dom.window.addEventListener("error", (event) => {
      console.error("JSDOM Error:", event.error || event.message);
    });

    setTimeout(() => {
      console.log("HTML:", dom.window.document.body.innerHTML);
      process.exit(0);
    }, 3000);
  } catch (e) {
    console.error("Fetch Error:", e);
  }
})();
