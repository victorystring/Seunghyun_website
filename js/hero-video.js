(function () {
  'use strict';

  var video = document.getElementById('hero-background-video');
  var toggle = document.querySelector('.hero-video-toggle');
  if (!video || !toggle) return;

  var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  var requestedPlayback = !motionPreference.matches;
  var inView = true;
  var label = toggle.querySelector('.hero-video-toggle-label');
  var icon = toggle.querySelector('[aria-hidden="true"]');

  video.muted = true;

  function updateButton() {
    label.textContent = video.paused ? 'Play video' : 'Pause video';
    toggle.setAttribute('aria-label', video.paused ? 'Play background video' : 'Pause background video');
    icon.className = video.paused ? 'icon-play' : 'icon-pause';
  }

  function syncPlayback() {
    if (requestedPlayback && inView && !document.hidden) {
      if (video.paused) {
        var playback = video.play();
        if (playback && playback.catch) {
          playback.catch(function (error) {
            // A blocked autoplay leaves the poster and manual play control available.
            if (error.name === 'NotAllowedError') requestedPlayback = false;
            updateButton();
          });
        }
      }
    } else {
      video.pause();
    }
    updateButton();
  }

  toggle.hidden = false;
  toggle.addEventListener('click', function () {
    requestedPlayback = video.paused;
    syncPlayback();
  });

  video.addEventListener('playing', updateButton);
  video.addEventListener('pause', updateButton);
  video.addEventListener('error', function () {
    toggle.hidden = true;
  });

  document.addEventListener('visibilitychange', syncPlayback);

  function updateMotionPreference(event) {
    requestedPlayback = !event.matches;
    syncPlayback();
  }

  if (motionPreference.addEventListener) {
    motionPreference.addEventListener('change', updateMotionPreference);
  } else {
    motionPreference.addListener(updateMotionPreference);
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      syncPlayback();
    });
    observer.observe(document.getElementById('home-section'));
  }

  syncPlayback();
}());
