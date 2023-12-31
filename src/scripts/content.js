
// References for setting MutationDiscovery
const targetNodeHtml = document.querySelector('html');
const configHtml = { attributes: true, childList: true, subtree: true };

// Handles updating Org IDs and Names once the instance list is loaded
var portalObserver = new MutationObserver(function (mutations) {
    if (document.querySelector("[data-testid='organization-box']")) {

        // Get Organization boxes
        const organizations = document.querySelectorAll("[data-testid='organization-box']");

        // Array to build storage object. This also clears the storage if new IDs/Names are found.
        var organizationInfo = [];

        organizations.forEach(organization => {
            const organizationName = organization.querySelector("[data-testid='organization-name']").textContent;

            const organizationIdString = organization.querySelector("[data-testid='organization-id']").textContent;
            const organizationIdMatch = organizationIdString.match(/ID: (.*)/)
            const organizationId = organizationIdMatch[1];

            // If ID and Name are found, add to array.
            if (organizationId && organizationName) {
                organizationInfo.push({
                    "organizationId": organizationId,
                    "organizationName": organizationName
                });
            }
        })

        chrome.runtime.sendMessage(organizationInfo)

        // Stop listening
        portalObserver.disconnect(); // to stop observing the dom after one update
    }
})

function listenForMessages() {
    chrome.runtime.onMessage.addListener(function (msg, sender, response) {
        document.title = msg;
    });
}

// Handle different Cribl Cloud urls
if (location.hostname === "manage.cribl.cloud" && location.pathname==="/organizations") {
    portalObserver.observe(targetNodeHtml, configHtml);
} else if (/^(?:main-(\S+?))|(?:manage)|(?:[^\.]+\-[^\.]+)\.cribl\.cloud/.test(location.hostname)) {
    listenForMessages()
} else if (/\.cribl\.cloud/.test(location.hostname) && ["/", "/logout"].indexOf(location.pathname) == -1) {
    listenForMessages()
}