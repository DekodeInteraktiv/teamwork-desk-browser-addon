let copy = false;

function writeToElement(content){
  document.getElementById('content').innerHTML = content;
  if (copy) {
      document.getElementById('content').select();
      document.execCommand("copy");
      copy = false;
  }
}

function fetchContent(tabs){
  // Send message to the current open tab. 
  browser.tabs.sendMessage(tabs[0].id, {
    command: "POPUP_FETCH_CONTENT"
  })
  .catch((error) => {
    console.log(error);
  });
}

function listenForClicks(){

  // Fetch and copy
  document.getElementById('copy_button').addEventListener("click", (event) => {

    // Stop button default
    event.preventDefault(); 

    // Get all active browser tabs.
    browser.tabs.query({active: true, currentWindow: true})
    .then((tabs) => {
      // Send the list of tabs to fetch.
      fetchContent(tabs);
      copy = true;
    })
    .catch((error) => {
      console.log(error);
    });

    
  });

}

// Register listner to recive messages from content script. 
browser.runtime.onMessage.addListener((message) => {

  if (message.command === "SEND_BROWSER_CONTENT") {
    writeToElement(message.data);
  }

});

// Add polyfill.
browser.tabs.executeScript({file: "/popup/polyfill/browser-polyfill.js"})
.catch((error) => {
  console.log(error);
});

// Add browser content script
browser.tabs.executeScript({file: "/popup/content-script/content-script.js"})
.then(listenForClicks())
.catch((error) => {
  console.log(error);
});