var YouTubeIframeLoader = require('youtube-iframe');
window.interactiveEbook = window.interactiveEbook || {};

if (window.interactiveEbook.ytUrl) {
  YouTubeIframeLoader.load(function(YT) {
    window.interactiveEbook.ytPlayer = new YT.Player('youtube-video', {
      videoId: window.interactiveEbook.ytUrl
    });
    window.interactiveEbook.ytPlayer.a.classList.add('videoframe');
  });
}
