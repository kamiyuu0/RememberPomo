//background.js
let inactiveTab = null;

setInterval(() => {
    inactiveTab = null;
    checkIfTabContainsUrl("https://school.runteq.jp/v3/learning_buddys/pomodoro", function (result) {
        if (result && inactiveTab) {
            // content script を確実に実行
            chrome.scripting.executeScript({
                target: { tabId: inactiveTab.id },
                files: ["content.js"]
            }).then(() => {
                console.log("content.js injected successfully");

                // content script にメッセージを送る
                chrome.tabs.sendMessage(inactiveTab.id, { action: "getDOMElement" }, function (response) {
                    if (chrome.runtime.lastError) {
                        console.error("Message sending failed:", chrome.runtime.lastError.message);
                        return;
                    }
                    console.log(response);
                    if (response && response.data) {
                        console.log("Element text:", response.data);
                        console.log(response.data.toString());
                        if (response.data === '25:00' ){
                            let opt = {
                                type: "image",
                                title: "ポモってる？",
                                message: "ポモドーロスタートし忘れてませんか？",
                                iconUrl: "image.png",
                                imageUrl: "image.png"
                            }
                            chrome.notifications.create(opt);
                        }
                    } else {
                        console.log('log');
                    }
                });
            }).catch(err => {
                console.error("Failed to inject content script:", err);
            });
        } else {
            inactiveTab = null;
            console.log("指定のタブは存在しません");
        }
    });
}, 5000);

function checkIfTabContainsUrl(urlToCheck, callback) {
    chrome.tabs.query({ url: urlToCheck }, function (tabs) {
        if (tabs.length > 0) {
            inactiveTab = tabs[0];
        }
        callback(tabs.length > 0);
    });
}
