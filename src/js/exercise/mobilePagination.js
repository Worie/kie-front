const mobilePagination = document.querySelector('.mobile-pagination');
const exerciseSection = document.querySelector('.exercise');

mobilePagination.addEventListener('click', (ev) => {
  if (ev.target.matches('span')) {
    mobilePagination.querySelectorAll('li').forEach(li => {
      li.classList.remove('active');
    });
  }
  if (ev.target.matches('.preview-icon')) {
    exerciseSection.classList.add('show-preview-area');
    exerciseSection.classList.remove('show-video-area');
    ev.target.parentNode.classList.add('active');
  } else if (ev.target.matches('.video-icon')) {
    exerciseSection.classList.add('show-video-area');
    exerciseSection.classList.remove('show-preview-area');
    ev.target.parentNode.classList.add('active');
  } else if (ev.target.matches('.read-icon')) {
    exerciseSection.classList.remove('show-preview-area');
    exerciseSection.classList.remove('show-video-area');
    ev.target.parentNode.classList.add('active');
  }
});
