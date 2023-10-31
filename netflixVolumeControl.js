(function () {
  let isListenerAdded = false;

  function isWatchPage() {
    return window.location.pathname.includes("/watch/");
  }

  function getVideoPlayer() {
    if (!window.netflix) return null;
    return window.netflix.appContext?.state?.playerApp?.getAPI()?.videoPlayer;
  }

  function adjustVolume(event) {
    const videoPlayer = getVideoPlayer();
    if (!videoPlayer) return;

    const playerSessionIds = videoPlayer.getAllPlayerSessionIds();
    if (!playerSessionIds.length) return;

    const player = playerSessionIds[0];
    let volume =
      videoPlayer.getVideoPlayerBySessionId(player).getVolume() * 100;

    volume += event.deltaY < 0 ? 10 : -10;
    volume = Math.min(100, Math.max(0, volume));

    videoPlayer.getVideoPlayerBySessionId(player).setVolume(volume / 100);
  }

  function addVolumeControl() {
    if (isListenerAdded) return; // Si ya está activo, no hacer nada
    document.addEventListener("wheel", adjustVolume);
    isListenerAdded = true;
  }

  function removeVolumeControl() {
    if (!isListenerAdded) return; // Si no está activo, no hacer nada
    document.removeEventListener("wheel", adjustVolume);
    isListenerAdded = false;
  }

  function checkAndExecute() {
    if (isWatchPage()) {
      addVolumeControl();
    } else {
      removeVolumeControl();
    }
  }

  checkAndExecute();

  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        checkAndExecute();
        break;
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
