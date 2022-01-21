function setupLazyload(imageNodes) {
    function loadImage(image) {
        image.src = image.dataset.src;
        image.classList.remove('lazy');
        imageObserver.unobserve(image);
    }

    function observeHandler(entries, observer) {
        for (const entry of entries)
            if (entry.isIntersecting)
                loadImage(entry.target);
    }

    const imageObserver = new IntersectionObserver(observeHandler);

    for (const image of imageNodes)
        imageObserver.observe(image);
}

function setupLazyloadFallback(imageNodes) {
    const isInView = (image) => image.offsetTop < window.innerHeight + window.pageYOffset;

    function loadImage(image) {
        image.src = image.dataset.src;
        image.classList.remove('lazy');
    }

    function addEventListeners() {
        document.addEventListener('scroll', lazyload);
        window.addEventListener('resize', lazyload);
        window.addEventListener('orientationChange', lazyload);
    }

    function removeEventListeners() {
        document.removeEventListener('scroll', lazyload);
        window.removeEventListener('resize', lazyload);
        window.removeEventListener('orientationChange', lazyload);
    }

    let timeout = undefined;
    function lazyload() {
        timeout ??= setTimeout(function () {
            timeout = undefined;
            for (const image of imageNodes)
                if (isInView(image))
                    imageNodes.delete(image), loadImage(image);

            if (imageNodes.size === 0)
                removeEventListeners();
        }, 100);
    }

    addEventListeners();
}

const imageNodes = new Set(document.querySelectorAll('img.lazy'));
if ('IntersectionObserver' in window) setupLazyload(imageNodes);
else setupLazyloadFallback(imageNodes);
