// Get the actual tab ID and send a message to the content script with the tab ID
browser.tabs.query({ currentWindow: true, active: true }).then((tab) => {
  browser.tabs.sendMessage(tab[0].id, {}).then(display_message_result, (e) => {
    console.log("End does not exist, passing ...");
  });
});

// Display the received message in some <li> tags
function display_message_result(message) {
  var list_element = document.getElementById("list");

  for (var i = 0; i < message.response.length; i++) {
    // Closure function permitting index conservation
    ((index) => {
      var new_li_element = document.createElement("li");
      var new_li_text = "Anchor " + (index + 1) + " :";

      var element_src = message.response[index][0];
      var element_base_uri = message.response[index][1];
      var element_content = message.response[index][2];

      new_li_text +=
        "\r\nScript source : " + (element_src ? element_src : "plain text");
      new_li_text +=
        "\r\nBase URI : " + (element_base_uri ? element_base_uri : "none");

      new_li_element.textContent = new_li_text;
      new_li_element.setAttribute(
        "style",
        "white-space: pre; font-size: 15px; overflow: scroll;",
      );

      // Open a new tab with the specified URL if element_src contains something,
      // else display element_content directly in the li
      if (element_src) {
        new_li_element.onclick = (e) => {
          window.open(element_src, "popup").focus();
        };
      } else {
        new_li_element.onclick = (e) => {
          var is_content_displayed = false;

          // Add a carriage return to element_content for having space to click and close *
          new_li_element.textContent = "\r\n" + element_content;

          new_li_element.onclick = (e) => {
            new_li_element.textContent = is_content_displayed
              ? new_li_text
              : "\r\n" + element_content; // * Same here
            is_content_displayed = !is_content_displayed;
          };
        };
      }

      list_element.appendChild(new_li_element);
    })(i);
  }
}
