
chrome.history.onVisited.addListener((historyItem) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;
        

        chrome.tabs.captureVisibleTab(tabs[0].windowId, { format: "png" }, (image) => {
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
            fetch("http://localhost:5000/api/histories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sendData),
            });
        });
    });
});