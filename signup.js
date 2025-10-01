// Signup form handling with ThriveStack analytics integration

// Track signup page view
document.addEventListener('DOMContentLoaded', function() {
    trackEvent('signup_page_viewed', {
        page: 'signup',
        timestamp: new Date().toISOString()
    });

    // Track form field interactions
    const formFields = document.querySelectorAll('#signupForm input');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            trackEvent('signup_field_focus', {
                field_name: this.name,
                field_id: this.id,
                field_type: this.type
            });
        });

        field.addEventListener('blur', function() {
            if (this.value) {
                trackEvent('signup_field_completed', {
                    field_name: this.name,
                    field_id: this.id,
                    has_value: true
                });
            }
        });
    });

    // Initialize form submission handler
    initializeSignupForm();
});

function initializeSignupForm() {
    const form = document.getElementById('signupForm');
    const messageDiv = document.getElementById('formMessage');

    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Track form submission attempt
        trackEvent('signup_form_submitted', {
            page: 'signup',
            timestamp: new Date().toISOString()
        });

        // Get form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Validate form
        if (!validateForm(data)) {
            showMessage('Please fill in all required fields correctly', 'error');
            trackEvent('signup_form_validation_failed', {
                page: 'signup'
            });
            return;
        }

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Creating Account...';
        submitButton.disabled = true;

        try {
            // Generate unique user ID from name (in production, use your backend)
            const userId = generateUserId(data.fullName);
            
            // Generate email from name for demo purposes
            const userEmail = generateEmailFromName(data.fullName);

            // Track signup attempt
            trackEvent('signup_processing', {
                user_id: userId,
                user_name: data.fullName
            });

            // Check for email abuse before proceeding
            const abuseCheck = await checkEmailAbuse(userEmail);
            
            if (abuseCheck.isAbuse) {
                showMessage('This account cannot be created. Please contact support.', 'error');
                trackEvent('signup_blocked_abuse', {
                    user_id: userId,
                    reason: 'email_abuse_detected'
                });
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                return;
            }

            // Call ThriveStack identify API
            await sendIdentifyCall(userId, data, userEmail);

            // Call ThriveStack group API (using name as company for demo)
            const groupId = generateGroupId(data.fullName);
            await sendGroupCall(groupId, userId, data);

            // Track successful signup
            trackEvent('signup_successful', {
                user_id: userId,
                user_name: data.fullName
            });

            // Show success message
            showMessage('Account created successfully! Redirecting to dashboard...', 'success');

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);

        } catch (error) {
            console.error('Signup error:', error);
            
            // Track signup failure
            trackEvent('signup_failed', {
                error_message: error.message,
                page: 'signup'
            });

            showMessage('An error occurred. Please try again.', 'error');
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });
}

function validateForm(data) {
    // Check required fields
    if (!data.fullName || data.fullName.trim() === '') {
        return false;
    }

    if (!data.password || data.password.length < 6) {
        return false;
    }

    return true;
}

async function checkEmailAbuse(email) {
    console.log('Checking email abuse for:', email);
    
    try {
        // Use ThriveStack's reportEmailAbuse method
        if (window.thriveStack && window.thriveStack.reportEmailAbuse) {
            const result = await window.thriveStack.reportEmailAbuse(email);
            console.log('Email abuse check result:', result);
            
            // Check if the email is flagged as abuse
            const isAbuse = result.data && result.data.isAbuse === 1;
            
            return {
                isAbuse: isAbuse,
                reasons: result.data?.reasonForAbuse || {},
                message: result.message
            };
        } else {
            console.warn('ThriveStack reportEmailAbuse not available');
            return { isAbuse: false };
        }
    } catch (error) {
        console.error('Email abuse check failed:', error);
        // Don't block signup if the check fails
        return { isAbuse: false };
    }
}

async function sendIdentifyCall(userId, data, userEmail) {
    console.log('Sending identify call to ThriveStack...');
    
    // Prepare user traits
    const userTraits = {
        name: data.fullName,
        email: userEmail,
        signup_date: new Date().toISOString(),
        has_password: true
    };

    try {
        // Use ThriveStack's identify method
        if (window.thriveStack && window.thriveStack.setUser) {
            const result = await window.thriveStack.setUser(userId, userEmail, userTraits);
            console.log('Identify call successful:', result);
            return result;
        } else {
            throw new Error('ThriveStack not initialized');
        }
    } catch (error) {
        console.error('Identify call failed:', error);
        throw error;
    }
}

async function sendGroupCall(groupId, userId, data) {
    console.log('Sending group call to ThriveStack...');
    
    // Prepare group traits (using name as organization for demo)
    const groupTraits = {
        group_type: 'Account',
        account_name: data.fullName + "'s Organization",
        created_at: new Date().toISOString(),
        primary_contact: data.fullName
    };

    try {
        // Use ThriveStack's group method
        if (window.thriveStack && window.thriveStack.setGroup) {
            const companyDomain = data.fullName.toLowerCase().replace(/\s+/g, '') + '.com';
            const companyName = data.fullName + "'s Organization";
            
            const result = await window.thriveStack.setGroup(
                groupId, 
                companyDomain,
                companyName, 
                groupTraits
            );
            console.log('Group call successful:', result);
            return result;
        } else {
            throw new Error('ThriveStack not initialized');
        }
    } catch (error) {
        console.error('Group call failed:', error);
        throw error;
    }
}

function generateUserId(fullName) {
    // Generate a simple user ID from name
    const timestamp = Date.now();
    const nameHash = fullName.toLowerCase().replace(/\s+/g, '_');
    return `user_${nameHash}_${timestamp}`;
}

function generateGroupId(fullName) {
    // Generate a simple group ID from name
    const nameHash = fullName.toLowerCase().replace(/\s+/g, '_');
    return `group_${nameHash}`;
}

function generateEmailFromName(fullName) {
    // Generate a demo email from name (in production, collect actual email)
    const nameParts = fullName.toLowerCase().trim().split(/\s+/);
    if (nameParts.length >= 2) {
        return `${nameParts[0]}.${nameParts[nameParts.length - 1]}@example.com`;
    } else {
        return `${nameParts[0]}@example.com`;
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.textContent = message;
    messageDiv.className = 'form-message ' + type;
    messageDiv.style.display = 'block';

    // Track message display
    trackEvent('signup_message_displayed', {
        message_type: type,
        page: 'signup'
    });
}

// Track form abandonment
let formStarted = false;
let formInteractionCount = 0;

document.addEventListener('DOMContentLoaded', function() {
    const formFields = document.querySelectorAll('#signupForm input');
    
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            if (!formStarted) {
                formStarted = true;
                trackEvent('signup_form_started', {
                    page: 'signup',
                    timestamp: new Date().toISOString()
                });
            }
            formInteractionCount++;
        });
    });

    // Track abandonment on page leave
    window.addEventListener('beforeunload', function() {
        if (formStarted && formInteractionCount > 0) {
            const form = document.getElementById('signupForm');
            const formData = new FormData(form);
            const filledFields = Array.from(formData.entries()).filter(([_, value]) => value).length;
            const totalFields = form.querySelectorAll('input[required]').length;
            
            trackEvent('signup_form_abandoned', {
                page: 'signup',
                filled_fields: filledFields,
                total_required_fields: totalFields,
                completion_percentage: Math.round((filledFields / totalFields) * 100),
                interaction_count: formInteractionCount
            });
        }
    });
});

// Utility function to manually report email abuse (can be called from console or other parts of the app)
async function reportEmailAbuse(email) {
    console.log('Reporting email abuse for:', email);
    
    try {
        if (window.thriveStack && window.thriveStack.reportEmailAbuse) {
            const result = await window.thriveStack.reportEmailAbuse(email);
            console.log('Email abuse report result:', result);
            return result;
        } else {
            throw new Error('ThriveStack not initialized');
        }
    } catch (error) {
        console.error('Email abuse reporting failed:', error);
        throw error;
    }
}

// Make reportEmailAbuse available globally
window.reportEmailAbuse = reportEmailAbuse;