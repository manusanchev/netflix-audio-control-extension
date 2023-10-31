const scriptElement = document.createElement('script');
scriptElement.src = chrome.runtime.getURL('netflixVolumeControl.js');
(document.head || document.documentElement).appendChild(scriptElement);
scriptElement.onload = function() {
    scriptElement.remove();
};
