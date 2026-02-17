// ===========================
// FUNDGENIUS - MAIN SCRIPT
// ===========================

// ===========================
// NAVIGATION & SECTION MANAGEMENT
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeChatbot();
    initializeGoalCalculator();
    initializeEventListeners();
    loadDashboardData();
});

function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));
            // Show target section
            const target = document.getElementById(targetSection);
            if (target) {
                target.classList.add('active');
            }
        });
    });
}

// ===========================
// CHATBOT FUNCTIONALITY
// ===========================

function initializeChatbot() {
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');
    const quickBtns = document.querySelectorAll('.quick-btn');

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const query = this.getAttribute('data-query');
            chatInput.value = query;
            sendMessage();
        });
    });
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = chatInput.value.trim();

    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';

    // Simulate API call and add bot response
    setTimeout(() => {
        const response = generateBotResponse(message);
        addMessage(response, 'bot');
    }, 500);
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const avatar = sender === 'user' ? '👤' : '🤖';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <p>${escapeHtml(text)}</p>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateBotResponse(userMessage) {
    const responses = {
        'best funds for beginners': 'For beginners, I recommend starting with Large Cap or Balanced funds. These offer lower volatility and steady returns. Consider Axis Growth Fund (15.2% 1Y return) or SBI Bluechip Fund (13.5% 1Y return). Both are ideal for building a foundation with rupee cost averaging through SIP.',
        
        'how much sip should i invest': 'Your SIP amount depends on your financial goal and timeline. For example, if you want to accumulate ₹50 lakhs in 10 years with 12% expected returns, you\'d need ₹3,000/month. Use our Goal Planner section to calculate the exact SIP needed for your specific goals.',
        
        'explain low risk funds': 'Low-risk funds include Large Cap and Debt funds. They focus on established companies and fixed income securities. Expected returns are 8-12% annually with lower volatility (8-15%). Perfect for conservative investors or those nearing retirement.',
        
        'analyze my portfolio risk': 'Your current portfolio has Medium Risk with 12.5% volatility. This is suitable for a 10+ year horizon. It includes 50% Equity, 25% Debt, and 25% Hybrid funds. In a market crash scenario (-35%), potential loss would be ₹85,750. You\'re well-positioned for long-term wealth building.',
        
        'default': 'Great question! Based on your profile, I can help with fund recommendations, risk analysis, SIP calculations, and portfolio optimization. What specific aspect interests you most?'
    };

    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return value;
        }
    }

    return responses['default'];
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ===========================
// GOAL CALCULATOR
// ===========================

function initializeGoalCalculator() {
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', calculateSIP);
}

function calculateSIP() {
    const targetAmount = parseFloat(document.getElementById('targetAmount').value);
    const timeframe = parseFloat(document.getElementById('timeframe').value);
    const expectedReturn = parseFloat(document.getElementById('expectedReturn').value) / 100 / 12;
    
    if (!targetAmount || !timeframe || !expectedReturn) {
        alert('Please fill in all fields');
        return;
    }

    const months = timeframe * 12;
    
    // FV = P * [((1 + r)^n - 1) / r]
    const monthlyRate = expectedReturn;
    const fv = targetAmount;
    const sip = fv / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));
    
    const totalInvestment = sip * months;
    const gains = targetAmount - totalInvestment;

    // Display results
    document.getElementById('monthlyValue').textContent = '₹' + formatCurrency(Math.round(sip));
    document.getElementById('totalInvest').textContent = '₹' + formatCurrency(Math.round(totalInvestment));
    document.getElementById('expectedGains').textContent = '₹' + formatCurrency(Math.round(gains));
    document.getElementById('finalAmount').textContent = '₹' + formatCurrency(Math.round(targetAmount));
    
    document.getElementById('sipResult').style.display = 'block';
}

function formatCurrency(num) {
    return Math.abs(num) >= 1000000 ? 
        (Math.abs(num) / 1000000).toFixed(2) + 'L' : 
        Math.abs(num) >= 1000 ? 
        (Math.abs(num) / 1000).toFixed(0) + 'K' : 
        num.toString();
}

// ===========================
// EVENT LISTENERS & INTERACTIONS
// ===========================

function initializeEventListeners() {
    // View Details buttons
    const viewDetailsButtons = document.querySelectorAll('.fund-card .btn-primary');
    viewDetailsButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const fundCard = this.closest('.fund-card');
            const fundName = fundCard.querySelector('.fund-name').textContent;
            alert(`Opening detailed view for ${fundName}`);
        });
    });

    // Hover effects on fund dots
    const fundDots = document.querySelectorAll('.fund-dot');
    fundDots.forEach(dot => {
        dot.addEventListener('mouseover', function() {
            const fund = this.getAttribute('data-fund');
            // Could show tooltip or highlight
        });
    });

    // Add click handler for fund cards
    const fundCards = document.querySelectorAll('.fund-card');
    fundCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ===========================
// DASHBOARD DATA LOADING
// ===========================

function loadDashboardData() {
    // Simulate loading animation
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ===========================
// UTILITIES
// ===========================

function formatIndianCurrency(value) {
    return '₹' + value.toLocaleString('en-IN');
}

function formatPercentage(value) {
    return value.toFixed(2) + '%';
}

function getRandomColor() {
    const colors = [
        '#2196F3',
        '#4CAF50',
        '#FF9800',
        '#E91E63',
        '#9C27B0'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ===========================
// SMOOTH SCROLL & ANIMATIONS
// ===========================

// Add smooth scroll behavior for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// ===========================
// API INTEGRATION READY (Mock)
// ===========================

class FundGeniusAPI {
    constructor(baseURL = 'http://localhost:5000/api') {
        this.baseURL = baseURL;
    }

    async getFunds() {
        try {
            const response = await fetch(`${this.baseURL}/funds`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching funds:', error);
            return [];
        }
    }

    async getPortfolio(userId) {
        try {
            const response = await fetch(`${this.baseURL}/portfolio/${userId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching portfolio:', error);
            return null;
        }
    }

    async getRecommendations(userProfile) {
        try {
            const response = await fetch(`${this.baseURL}/recommendations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userProfile)
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            return [];
        }
    }

    async getFundMetrics(fundId) {
        try {
            const response = await fetch(`${this.baseURL}/funds/${fundId}/metrics`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching fund metrics:', error);
            return null;
        }
    }

    async sendChatMessage(message) {
        try {
            const response = await fetch(`${this.baseURL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            return await response.json();
        } catch (error) {
            console.error('Error sending chat message:', error);
            return { response: 'Sorry, I encountered an error. Please try again.' };
        }
    }

    async analyzeRisk(portfolio) {
        try {
            const response = await fetch(`${this.baseURL}/risk-analysis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(portfolio)
            });
            return await response.json();
        } catch (error) {
            console.error('Error analyzing risk:', error);
            return null;
        }
    }

    async simulateMarketStress(portfolio, scenarios) {
        try {
            const response = await fetch(`${this.baseURL}/stress-test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ portfolio, scenarios })
            });
            return await response.json();
        } catch (error) {
            console.error('Error running stress test:', error);
            return null;
        }
    }

    async explainRecommendation(fundId) {
        try {
            const response = await fetch(`${this.baseURL}/explain/${fundId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching explanation:', error);
            return null;
        }
    }
}

// Initialize API client
const api = new FundGeniusAPI();

// ===========================
// ADVANCED INTERACTIONS
// ===========================

// Fund card interaction tracking
document.querySelectorAll('.fund-card').forEach(card => {
    card.addEventListener('click', function() {
        const fundName = this.querySelector('.fund-name').textContent;
        trackEvent('fund_card_clicked', { fund: fundName });
    });
});

// Goal form interaction
document.getElementById('calculateBtn')?.addEventListener('click', function() {
    trackEvent('sip_calculated', {
        targetAmount: document.getElementById('targetAmount').value,
        timeframe: document.getElementById('timeframe').value
    });
});

// Navigation tracking
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        const section = this.getAttribute('data-section');
        trackEvent('section_viewed', { section });
    });
});

function trackEvent(eventName, eventData = {}) {
    // Send to analytics or logging service
    console.log(`Event: ${eventName}`, eventData);
}

// ===========================
// RESPONSIVE INTERACTIONS
// ===========================

// Mobile menu toggle (if needed)
let isMobileMenuOpen = false;

function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    const sidebar = document.querySelector('.sidebar');
    if (isMobileMenuOpen) {
        sidebar.style.display = 'flex';
    } else {
        sidebar.style.display = '';
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && isMobileMenuOpen) {
        toggleMobileMenu();
    }
});

// ===========================
// THEME MANAGEMENT (Optional)
// ===========================

function setTheme(theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
        root.style.setProperty('--bg-light', '#1a1a1a');
        root.style.setProperty('--bg-white', '#2a2a2a');
        root.style.setProperty('--text-dark', '#ffffff');
        localStorage.setItem('theme', 'dark');
    } else {
        root.style.setProperty('--bg-light', '#F5F7FA');
        root.style.setProperty('--bg-white', '#FFFFFF');
        root.style.setProperty('--text-dark', '#1A1A1A');
        localStorage.setItem('theme', 'light');
    }
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// ===========================
// EXPORT FOR TESTING
// ===========================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FundGeniusAPI,
        calculateSIP,
        generateBotResponse,
        formatCurrency,
        setTheme
    };
}