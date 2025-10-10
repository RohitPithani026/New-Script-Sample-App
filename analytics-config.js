// ThriveStack Analytics Configuration
// Replace 'your-api-key-here' with your actual ThriveStack API key

window.ThriveStackConfig = {
    // Your ThriveStack API Key - Get this from your ThriveStack dashboard
    apiKey: 'i1rPJo38lB6hR2qZC5iNNz0xcGRuBYIKRVYfTBdpJyY=',
    
    // Source identifier for this app
    source: 'marketing',
    
    // Tracking settings
    trackClicks: true,
    trackForms: true,
    enableDeveloperLogs: true,
    
    // Optional: User identification (set when user logs in)
    userId: null,
    userEmail: null,
    
    // Optional: Group identification (for multi-tenant apps)
    groupId: null,
    
    // Custom events configuration
    customEvents: {
        // Track when users spend time on pages
        trackTimeOnPage: true,
        timeOnPageInterval: 30000, // 30 seconds
        
        // Track scroll depth
        trackScrollDepth: true,
        scrollDepthThresholds: [25, 50, 75, 90, 100], // percentages
        
        // Track exit intent
        trackExitIntent: true
    }
};

// Helper function to update API key
function updateApiKey(newApiKey) {
    window.ThriveStackConfig.apiKey = newApiKey;
    console.log('API key updated. Please refresh the page for changes to take effect.');
}

// Helper function to identify a user
function identifyUser(userId, userEmail, additionalTraits = {}) {
    if (window.thriveStack && window.thriveStack.setUser) {
        window.thriveStack.setUser(userId, userEmail, additionalTraits);
        window.ThriveStackConfig.userId = userId;
        window.ThriveStackConfig.userEmail = userEmail;
        console.log('User identified:', userId);
    } else {
        console.warn('ThriveStack not initialized yet. User identification will be retried.');
        setTimeout(() => identifyUser(userId, userEmail, additionalTraits), 1000);
    }
}

// Helper function to set group
function setGroup(groupId, groupName, additionalTraits = {}) {
    if (window.thriveStack && window.thriveStack.setGroup) {
        window.thriveStack.setGroup(groupId, groupName, additionalTraits);
        window.ThriveStackConfig.groupId = groupId;
        console.log('Group set:', groupId);
    } else {
        console.warn('ThriveStack not initialized yet. Group setting will be retried.');
        setTimeout(() => setGroup(groupId, groupName, additionalTraits), 1000);
    }
}
