function removeColorStyles() {
    const coloredSpans = document.querySelectorAll('span[style*="color:"]');
    
    coloredSpans.forEach(span => {
        const style = span.getAttribute('style');
        let newStyle = style
            .replace(/color\s*:[^;]+;?/g, '')
            .replace(/;\s*$/, '')
            .trim();
        
        if (newStyle === '') {
            span.removeAttribute('style');
        } else {
            span.setAttribute('style', newStyle);
        }
    });
}

window.addEventListener('load', removeColorStyles);

const observer = new MutationObserver(mutations => {
    let needsUpdate = false;
    
    mutations.forEach(mutation => {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            needsUpdate = true;
        }
    });
    
    if (needsUpdate) {
        setTimeout(removeColorStyles, 100);
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
