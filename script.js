
document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    let selectedEmoji = null;
    let selectedColor = null;
    let isSoundRecorded = false;
    let userPosts = [];

    // --- DUMMY DATA ---
    const dummyFeedPosts = [
        { emoji: '😴', color: '#596275', sound: true },
        { emoji: '🤔', color: '#778beb', sound: true },
        { emoji: '😊', color: '#f7d794', sound: true },
    ];
    const dummyCalendarData = [
        '#f7d794', '#f7d794', '#778beb', '#e77f67', null, '#596275', '#f7d794',
        '#63cdda', '#778beb', null, null, '#cf6a87', '#e77f67', '#778beb',
        '#f7d794', '#596275', null, '#f7d794', '#e77f67', '#e77f67', null,
        '#778beb', '#cf6a87', '#63cdda', '#63cdda', null, '#f7d794', '#778beb'
    ];


    // --- DOM ELEMENT SELECTION ---
    const landingScreen = document.getElementById('landing-screen');
    const appContainer = document.getElementById('app-container');
    const getStartedBtn = document.getElementById('get-started-btn');
    
    const screens = document.querySelectorAll('.screen');
    const navButtons = document.querySelectorAll('.nav-btn');
    
    const emojiSelector = document.getElementById('emoji-selector');
    const colorSelector = document.getElementById('color-selector');
    const soundRecordBtn = document.getElementById('sound-record-btn');
    const shareBtn = document.getElementById('share-btn');
    const feedbackMessage = document.getElementById('feedback-message');

    const feedContainer = document.getElementById('feed-container');
    const calendarGrid = document.getElementById('calendar-grid');
    const moodAnalysisBtn = document.getElementById('mood-analysis-btn');

    
    // --- FUNCTIONS ---

    // Function to switch between screens
    const showScreen = (screenId) => {
        screens.forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');

        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === screenId);
        });
    };

    // Function to reset the share screen selections
    const resetShareScreen = () => {
        selectedEmoji = null;
        selectedColor = null;
        isSoundRecorded = false;

        document.querySelectorAll('#emoji-selector span.selected').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('#color-selector .color-box.selected').forEach(el => el.classList.remove('selected'));
        
        soundRecordBtn.classList.remove('recorded');
        soundRecordBtn.textContent = 'Tap to Record Sound';
        feedbackMessage.textContent = '';
        feedbackMessage.className = 'feedback';
    };

    // Function to render the anonymous feed
    const renderFeed = () => {
        feedContainer.innerHTML = ''; // Clear existing posts
        const allPosts = [...dummyFeedPosts, ...userPosts].reverse(); // Show newest first

        allPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'feed-post';
            postElement.innerHTML = `
                <div class="post-content" style="background-color: ${post.color}20; border: 1px solid ${post.color}; padding: 10px 20px; border-radius: 20px;">
                    <span>${post.emoji}</span>
                    <span class="play-sound-icon">🔊</span>
                </div>
                <div class="post-interaction">
                    <button class="feel-same-btn">I feel the same</button>
                </div>
            `;
            feedContainer.appendChild(postElement);
        });
    };

    // Function to render the mood calendar
    const renderCalendar = () => {
        calendarGrid.innerHTML = '';
        dummyCalendarData.forEach(color => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            if (color) {
                dayElement.classList.add('filled');
                dayElement.style.backgroundColor = color;
            }
            calendarGrid.appendChild(dayElement);
        });
    };

    // --- EVENT LISTENERS ---

    // Get Started button
    getStartedBtn.addEventListener('click', () => {
        landingScreen.style.display = 'none';
        appContainer.style.display = 'flex';
        showScreen('share-screen');
    });

    // Navigation bar
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            showScreen(button.dataset.target);
        });
    });

    // Emoji selection
    emojiSelector.addEventListener('click', (e) => {
        if (e.target.tagName === 'SPAN') {
            document.querySelectorAll('#emoji-selector span.selected').forEach(el => el.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedEmoji = e.target.textContent;
        }
    });

    // Color selection
    colorSelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-box')) {
            document.querySelectorAll('#color-selector .color-box.selected').forEach(el => el.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedColor = e.target.style.backgroundColor;
        }
    });

    // Sound recording simulation
    soundRecordBtn.addEventListener('click', () => {
        isSoundRecorded = !isSoundRecorded;
        soundRecordBtn.classList.toggle('recorded', isSoundRecorded);
        soundRecordBtn.textContent = isSoundRecorded ? 'Sound Recorded ✓' : 'Tap to Record Sound';
    });

    // Share button (validation logic from flowchart)
    shareBtn.addEventListener('click', () => {
        let errors = [];
        if (!selectedColor) errors.push("a color");
        if (!selectedEmoji) errors.push("an emoji");
        if (!isSoundRecorded) errors.push("a sound");

        if (errors.length > 0) {
            feedbackMessage.className = 'feedback error';
            feedbackMessage.textContent = `Please select ${errors.join(', ')}.`;
            return;
        }

        // --- Success ---
        const newPost = { emoji: selectedEmoji, color: selectedColor, sound: isSoundRecorded };
        userPosts.push(newPost);
        
        feedbackMessage.className = 'feedback success';
        feedbackMessage.textContent = 'Feeling shared! 2 others feel the same today.';

        // After a delay, reset and switch to the feed
        setTimeout(() => {
            resetShareScreen();
            renderFeed();
            showScreen('feed-screen');
        }, 2000);
    });

    // "I feel the same" button (event delegation)
    feedContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('feel-same-btn')) {
            e.target.textContent = 'Notification Sent!';
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            e.target.style.borderColor = '#fff';
            e.target.style.color = '#fff';
            setTimeout(() => {
                e.target.textContent = 'I feel the same';
                 e.target.style.backgroundColor = 'transparent';
                 e.target.style.borderColor = '#a4a4c4';
                 e.target.style.color = '#a4a4c4';
            }, 2000);
        }
        if (e.target.classList.contains('play-sound-icon')) {
             alert("Playing sound... (placeholder)");
        }
    });
    
    // Mood analysis button
    moodAnalysisBtn.addEventListener('click', () => {
        alert("Showing mood analysis... (placeholder for analysis result)");
    });

    // --- INITIALIZATION ---
    renderFeed();
    renderCalendar();
    // Initially, only the landing screen is visible (handled by CSS).
});
