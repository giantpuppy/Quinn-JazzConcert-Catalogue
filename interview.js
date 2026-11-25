const cover = document.querySelector('.film-cover');
cover.addEventListener('click', () => {
  const video = document.createElement('video');
  video.controls = true;
  video.playsInline = true;
  video.setAttribute('controlslist', 'nodownload');
  video.setAttribute('aria-label', 'Quinn x RJ talking');
  video.poster = cover.querySelector('img').src;
  video.src = cover.dataset.src;
  video.addEventListener('contextmenu', event => event.preventDefault());
  cover.replaceWith(video);
  video.focus();
  video.play().catch(() => { /* Native controls remain available for retry. */ });
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting && !document.fullscreenElement && !document.pictureInPictureElement) {
      video.pause();
      observer.disconnect();
      video.replaceWith(cover);
      video.removeAttribute('src');
      video.load();
    }
  });
  observer.observe(video);
});
