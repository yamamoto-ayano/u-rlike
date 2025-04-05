
chrome.history.onVisited.addListener((historyItem) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;


        chrome.tabs.captureVisibleTab(tabs[0].windowId, { format: "jpeg", quality: 50 }, (image) => {
            if (chrome.runtime.lastError) {
                return;
            }

            let sendData = {
                url: historyItem.url,
                title: tabs[0].title || "",
                image: image,
                description: "",
                timestamp: historyItem.lastVisitTime,
            };
            fetch("http://localhost:8787/histories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sendData),
            });
        });
    });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "addBookmark",
        title: "ブックマークに追加",
        contexts: ["page"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "addBookmark") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) return;
            chrome.tabs.captureVisibleTab(tabs[0].windowId, { format: "png" }, (image) => {
                if (chrome.runtime.lastError) {
                    return;
                }
                // chrome.scripting.executeScript({
                //     target: { tabId: tabs[0].id },
                //     func: (tab, image) => {
                //         let userInput = prompt("メモを入力してください:");

                //         let sendData = {
                //             url: tab.url,
                //             title: tab.title || "",
                //             image: image,
                //             description: "",
                //             // timestamp: Date.now(),
                //             memo: userInput,
                //         };
                //         fetch("http://localhost:5000/api/bookmarks/default", {
                //             method: "POST",
                //             headers: { "Content-Type": "application/json" },
                //             body: JSON.stringify(sendData),
                //         });
                //     },
                //     args: [tabs[0], image]
                // });

                let userInput = chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        return prompt("メモを入力してください:");
                    }
                });

                userInput.then((result) => {
                    let sendData = {
                        url: tabs[0].url,
                        title: tabs[0].title || "",
                        image: image,
                        description: "",
                        // timestamp: Date.now(),
                        memo: result[0].result,
                    };
                    fetch("http://localhost:8787/bookmarks/default", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(sendData),
                    });
                }).catch((error) => {
                    console.error("Error executing script: ", error);
                });

            });
        });
    }
});