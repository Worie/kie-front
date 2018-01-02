window.interactiveEbook = window.interactiveEbook || {};

const links = Array.from(document.querySelectorAll('.youtube-time'));
links.forEach(link => {
  link.addEventListener('click', () => {
    const timeArray = link.getAttribute('data-yt-time').split(":");
    let time = 0;
    // Minutes to seconds
    time += parseInt(timeArray[0] * 60)
    // Just seconds
    time += parseInt(timeArray[1]);
    window.interactiveEbook.ytPlayer.seekTo(time);
  })
});
