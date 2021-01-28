export default () => {
  const images = document.querySelectorAll('.lz-img');
  // eslint-disable-next-line no-use-before-define
  const observer = new IntersectionObserver(onIntersection, {
    rootMargin: '200px',
  });

  function onIntersection(imageEntities) {
    imageEntities.forEach((image) => {
      if (image.isIntersecting) {
        if (image.target.getAttribute('data-srcset')) {
          // eslint-disable-next-line no-param-reassign
          image.target.srcset = image.target.dataset.srcset;
        }
        if (image.target.getAttribute('data-src')) {
          // eslint-disable-next-line no-param-reassign
          image.target.src = image.target.dataset.src;
        }
        observer.unobserve(image.target);
      }
    });
  }

  images.forEach(image => observer.observe(image));
};
