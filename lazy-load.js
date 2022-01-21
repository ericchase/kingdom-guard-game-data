function setupObserver(nodes, callback) {
    function loadNode(node) {
        callback(node);
        observer.unobserve(node);
    }

    function observeHandler(entries, observer) {
        for (const entry of entries)
            if (entry.isIntersecting)
                loadNode(entry.target);
    }

    const observer = new IntersectionObserver(observeHandler);

    for (const node of nodes) {
        observer.observe(node);
    }
}

function setupTimer(nodes, callback) {
    const isInView = (node) => {
        const top = node.getBoundingClientRect().top
        return 0 < top && top < window.innerHeight
    };

    const loadNode = (node) => callback(node);

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
            for (const node of nodes) {
                if (isInView(node))
                    nodes.delete(node), loadNode(node);
            }
            if (nodes.size === 0)
                removeEventListeners();
        }, 100);
    }

    addEventListeners();
    lazyload();
}

function setupLazyLoading(selector, callback) {
    const nodes = new Set(document.querySelectorAll(selector));
    if ('IntersectionObserver' in window)
        setupObserver(nodes, callback);
    else
        setupTimer(nodes, callback);
}
