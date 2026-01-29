chrome.commands.onCommand.addListener(async (command) => {
  if (command === "open-search") {
    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    // Safety check for restricted pages
    if (
      !activeTab ||
      activeTab.url.startsWith("chrome://") ||
      activeTab.url.startsWith("https://chrome.google.com")
    ) {
      return;
    }

    const allTabs = await chrome.tabs.query({ currentWindow: true });
    const tabData = allTabs.map((t) => ({
      id: t.id,
      title: t.title,
      url: t.url,
      favIcon: t.favIconUrl,
    }));

    // We use a try-catch to handle tabs that aren't refreshed yet
    try {
      await chrome.tabs.sendMessage(activeTab.id, {
        action: "toggleSearch",
        tabs: tabData,
      });
    } catch (err) {
      console.warn(
        "texttabber: Content script not ready. Please refresh the page.",
      );
      // We removed the manual 'executeScript' here because CRXJS handles
      // the injection via the manifest automatically upon page load.
    }
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "switchToTab") {
    chrome.tabs.update(request.tabId, { active: true });
  }
});
