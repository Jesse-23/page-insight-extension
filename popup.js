// Update page info
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  let tab = tabs[0];
  document.getElementById("title").textContent = "Title: " + tab.title;
  document.getElementById("url").textContent = "URL: " + tab.url;

  // Ask content script for counts
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: getCounts
    },
    (results) => {
      if (results && results[0] && results[0].result) {
        const { images, links } = results[0].result;
        document.getElementById("images").textContent = "Images: " + images;
        document.getElementById("links").textContent = "Links: " + links;
      }
    }
  );
});

// Button to highlight links
document.getElementById("highlight").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: highlightLinks
    });
  });
});

// Button to darken page
document.getElementById("darken").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: darkenPage
    });
  });
});

// Functions injected into content script
function getCounts() {
  return {
    images: document.getElementsByTagName("img").length,
    links: document.getElementsByTagName("a").length
  };
}

function highlightLinks() {
  const links = document.getElementsByTagName("a");
  for (let link of links) {
    link.style.backgroundColor = "#f1c40f";
    link.style.color = "#000";
    link.style.padding = "2px 4px";
    link.style.borderRadius = "2px";
  }
}

function darkenPage() {
  if (document.getElementById("page-overlay")) return; // avoid duplicates
  let overlay = document.createElement("div");
  overlay.id = "page-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0,0,0,0.6)";
  overlay.style.zIndex = "9999";
  document.body.appendChild(overlay);
}
