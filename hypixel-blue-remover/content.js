let settings = { mode: 'remove' };

chrome.storage.sync.get({darkpixel: false}, function(data) {
    settings.mode = data.darkpixel ? 'darkpixel' : 'remove';
    processColors();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updateSettings') {
        settings = request.settings;
        processColors();
    }
});

function processColors() {
    const coloredSpans = document.querySelectorAll('span[style*="color:"]');
    
    coloredSpans.forEach(span => {
        if (span.closest('.message-signature')) {
            return;
        }
        
        const style = span.getAttribute('style');
        let newStyle;
        
        if (settings.mode === 'remove') {
            newStyle = style
                .replace(/color\s*:[^;]+;?/g, '')
                .replace(/;\s*$/, '')
                .trim();
                
            if (newStyle === '') {
                span.removeAttribute('style');
            } else {
                span.setAttribute('style', newStyle);
            }
        } else if (settings.mode === 'darkpixel') {
            newStyle = style.replace(/color\s*:[^;]+;?/g, '').trim();
            newStyle = newStyle ? `${newStyle}; color: #e4e2df !important` : 'color: #e4e2df !important';
            span.setAttribute('style', newStyle);
        }
    });
}

window.addEventListener('load', processColors);

const observer = new MutationObserver(mutations => {
    let needsUpdate = false;
    
    mutations.forEach(mutation => {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            needsUpdate = true;
        }
    });
    
    if (needsUpdate) {
        setTimeout(processColors, 100);
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
