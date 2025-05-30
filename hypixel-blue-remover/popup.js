document.addEventListener('DOMContentLoaded', function() {
    const darkpixelToggle = document.getElementById('darkpixel');
    const status = document.getElementById('status');

    // Load saved settings
    chrome.storage.sync.get({darkpixel: false}, function(data) {
        darkpixelToggle.checked = data.darkpixel;
    });

    // Toggle darkpixel mode
    darkpixelToggle.addEventListener('change', function() {
        const settings = {
            darkpixel: this.checked
        };
        
        // Save to storage
        chrome.storage.sync.set(settings, function() {
            status.textContent = 'Settings saved!';
            // Clear the status after 2 seconds
            setTimeout(() => {
                status.textContent = '';
            }, 2000);
            
            // Send message to content script to update
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0].url.includes('hypixel.net/threads/')) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'updateSettings',
                        settings: {
                            mode: settings.darkpixel ? 'darkpixel' : 'remove'
                        }
                    });
                }
            });
        });
    });
});
