// content.js

if (!window.hasContentScriptListener) {

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === "getDOMElement") {
            const element = document.getElementsByClassName("pomodoro-timer-count");
            if (element[0] != undefined) {
              console.log(element[0]);
              sendResponse({ data: element[0].textContent });
            } else {
              console.log('test');
              sendResponse({ data: "Element not found" });
            }
        }
        return true; // 非同期処理での応答を許可
    }
  );

  console.log("Message listener registered");
} else {
    console.log("Message listener already registered");
}