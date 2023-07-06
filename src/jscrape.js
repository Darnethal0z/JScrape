// Bind the message handler
browser.runtime.onMessage.addListener(handle_message);

// Get the document script tags and send them
function handle_message(message, sender, sendResponse) {
  var script_anchors_list = [];

  for (var i=0; i<document.scripts.length; i++) {
    script_anchors_list.push([
      document.scripts[i].src,
      document.scripts[i].baseURI,
      document.scripts[i].textContent,
    ]);
  }

  sendResponse({ response: script_anchors_list });
}
