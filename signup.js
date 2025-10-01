// Signup form handling with ThriveStack analytics integration

// Track signup page view
document.addEventListener('DOMContentLoaded', function() {
    trackEvent('signup_page_viewed', {
        page: 'signup',
        timestamp: new Date().toISOString()
    });

    // Track form field interactions
    const formFields = document.querySelectorAll('#signupForm input, #signupForm select');
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
            // Generate unique user ID (in production, this would come from your backend)
            const userId = generateUserId(data.email);
            const groupId = generateGroupId(data.companyDomain);

            // Track signup attempt
            trackEvent('signup_processing', {
                user_id: userId,
                group_id: groupId,
                plan: data.plan || 'free'
            });

            // Call ThriveStack identify API
            await sendIdentifyCall(userId, data);

            // Call ThriveStack group API
            await sendGroupCall(groupId, userId, data);

            // Track successful signup
            trackEvent('signup_successful', {
                user_id: userId,
                group_id: groupId,
                plan: data.plan || 'free',
                company_size: data.companySize || 'unknown',
                industry: data.industry || 'unknown'
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
    const requiredFields = ['fullName', 'email', 'companyName', 'companyDomain'];
    
    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            return false;
        }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }

    // Check terms acceptance
    if (!data.terms) {
        return false;
    }

    return true;
}

async function sendIdentifyCall(userId, data) {
    console.log('Sending identify call to ThriveStack...');
    
    // Prepare user traits
    const userTraits = {
        name: data.fullName,
        email: data.email,
        phone: data.phone || null,
        role: data.role || null,
        plan: data.plan || 'free',
        newsletter_subscribed: data.newsletter === 'on',
        signup_date: new Date().toISOString(),
        company_name: data.companyName
    };

    try {
        // Use ThriveStack's identify method
        if (window.thriveStack && window.thriveStack.setUser) {
            const result = await window.thriveStack.setUser(userId, data.email, userTraits);
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
    
    // Prepare group traits
    const groupTraits = {
        group_type: 'Account',
        account_name: data.companyName,
        account_domain: data.companyDomain,
        company_size: data.companySize || null,
        industry: data.industry || null,
        plan: data.plan || 'free',
        created_at: new Date().toISOString(),
        primary_contact: data.fullName,
        primary_email: data.email
    };

    try {
        // Use ThriveStack's group method
        if (window.thriveStack && window.thriveStack.setGroup) {
            const result = await window.thriveStack.setGroup(
                groupId, 
                data.companyDomain,
                data.companyName, 
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

function generateUserId(email) {
    // In production, use your backend to generate proper user IDs
    // This is a simple example using email-based ID
    return 'user_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
}

function generateGroupId(domain) {
    // In production, use your backend to generate proper group IDs
    // This is a simple example using domain-based ID
    return 'group_' + btoa(domain).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
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
    const formFields = document.querySelectorAll('#signupForm input, #signupForm select');
    
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
            const totalFields = form.querySelectorAll('input[required], select[required]').length;
            
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

// Track plan selection changes
document.addEventListener('DOMContentLoaded', function() {
    const planSelect = document.getElementById('plan');
    if (planSelect) {
        planSelect.addEventListener('change', function() {
            trackEvent('signup_plan_selected', {
                plan: this.value,
                page: 'signup'
            });
        });
    }

    // Track company size selection
    const companySizeSelect = document.getElementById('companySize');
    if (companySizeSelect) {
        companySizeSelect.addEventListener('change', function() {
            trackEvent('signup_company_size_selected', {
                company_size: this.value,
                page: 'signup'
            });
        });
    }

    // Track industry selection
    const industrySelect = document.getElementById('industry');
    if (industrySelect) {
        industrySelect.addEventListener('change', function() {
            trackEvent('signup_industry_selected', {
                industry: this.value,
                page: 'signup'
            });
        });
    }
});
