document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    let selectedEmoji = null;
    let selectedColor = null;
    let isSoundRecorded = false;
    let userPosts = [];
    let mediaRecorder = null;
    let recordedAudio = null;
    let audioChunks = [];
    let progressBar = null;
    let currentStep = 0;

    // Emoji to audio mapping
    const emojiAudioMap = {
        '😊': 'audio-happy',
        '😔': 'audio-sad', 
        '😠': 'audio-angry',
        '😴': 'audio-tired',
        '😍': 'audio-excited',
        '🤔': 'audio-thinking'
    };

    // --- DUMMY DATA ---
    const dummyFeedPosts = [
        { emoji: '😴', color: '#596275', sound: true },
        { emoji: '🤔', color: '#778beb', sound: true },
        { emoji: '😊', color: '#f7d794', sound: true },
        { emoji: '😔', color: '#e77f67', sound: true },
        { emoji: '😠', color: '#cf6a87', sound: true },
        { emoji: '😍', color: '#63cdda', sound: true },
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

    // Language selector
    const languageSelector = document.getElementById('language-selector');

    // --- TRANSLATION DATA ---
    const translations = {
        en: {
            get_started: 'Get Started',
            share_your_feelings: 'Start sharing your feelings! 🎭',
            great_start: 'Great start! {0} more steps... 🌟',
            almost_done: 'Almost done! One more step... ✨',
            perfect_share: 'Perfect! Now you can share! 🚀',
            record_sound: 'Tap to Record Sound',
            recording: '🎤 Recording...',
            recording_seconds: '🎤 Recording... {0}s',
            sound_recorded: '✓ Sound Recorded!',
            select: 'Please select {0}.',
            feeling_shared: 'Feeling shared! 2 others feel the same today.',
            i_feel_the_same: 'I feel the same',
            notification_sent: 'Notification Sent!',
            analyzing: 'Analyzing...',
            request_mood_analysis: 'Request Mood Analysis',
            back_to_calendar: 'Back to Calendar',
            microphone_error: 'Microphone access error:',
            mood_analysis: 'Mood Analysis',
            emotion_stats: 'Emotion Statistics',
            trend_insights: 'Trend Insights',
            personal_insights: 'Personal Insights',
            happy: 'Happy',
            thoughtful: 'Thoughtful',
            tired: 'Tired',
            excited: 'Excited',
            evening_moods: 'Evening moods tend to be more relaxed',
            weekends_positive: 'Weekends show more positive emotions',
            consistently_sharing: 'You\'ve been consistently sharing feelings',
            active_sharing: 'Most active sharing happens in the afternoon',
            emotional_range: 'Your emotional range is well-balanced',
            note_patterns: 'Consider noting patterns with sleep and weather',
            express_authentically: 'Keep expressing yourself authentically',
            emotional_awareness: 'You show great emotional awareness',
            share: 'Share',
            feed: 'Feed',
            calendar: 'Calendar',
            how_are_you_feeling: 'How are you feeling right now?',
            todays_feelings: 'Today\'s Feelings',
            your_mood_calendar: 'Your Mood Calendar',
            mood_analysis_title: '🎭 Your Mood Analysis',
            select_emoji: '1. Select an emoji',
            select_color: '2. Select a color',
            record_short_sound: '3. Record a short sound',
            silent_emotional_sharing: 'Silent Emotional Sharing',
            app_description: 'Share how you feel without words. Use a combination of emoji, color, and sound to express your emotional state anonymously.',
            calendar_description: 'Each square represents a day\'s dominant feeling.',
            share_feeling: 'Share Feeling'
        },
        tr: {
            get_started: 'Başla',
            share_your_feelings: 'Duygularınızı paylaşmaya başlayın! 🎭',
            great_start: 'Harika başlangıç! {0} adım daha... 🌟',
            almost_done: 'Neredeyse tamam! Son bir adım... ✨',
            perfect_share: 'Mükemmel! Şimdi paylaşabilirsiniz! 🚀',
            record_sound: 'Ses Kaydetmek İçin Dokunun',
            recording: '🎤 Kaydediliyor...',
            recording_seconds: '🎤 Kaydediliyor... {0}s',
            sound_recorded: '✓ Ses Kaydedildi!',
            select: '{0} seçin lütfen.',
            feeling_shared: 'Duygu paylaşıldı! Bugün 2 kişi daha aynı şeyi hissediyor.',
            i_feel_the_same: 'Aynı şeyi hissediyorum',
            notification_sent: 'Bildirim Gönderildi!',
            analyzing: 'Analiz ediliyor...',
            request_mood_analysis: 'Ruh Hali Analizi İste',
            back_to_calendar: 'Takvime Geri Dön',
            microphone_error: 'Mikrofon erişim hatası:',
            mood_analysis: 'Ruh Hali Analizi',
            emotion_stats: 'Duygu İstatistikleri',
            trend_insights: 'Eğilim Öngörüleri',
            personal_insights: 'Kişisel Öngörüler',
            happy: 'Mutlu',
            thoughtful: 'Düşünceli',
            tired: 'Yorgun',
            excited: 'Heyecanlı',
            evening_moods: 'Akşam ruh halleri daha rahat olma eğilimindedir',
            weekends_positive: 'Hafta sonları daha olumlu duygular gösteriyor',
            consistently_sharing: 'Sürekli olarak duygularınızı paylaşıyorsunuz',
            active_sharing: 'En aktif paylaşım öğleden sonra gerçekleşir',
            emotional_range: 'Duygusal aralığınız iyi dengelenmiş',
            note_patterns: 'Uyku ve hava durumu ile ilgili kalıpları not almayı düşünün',
            express_authentically: 'Kendinizi otantik bir şekilde ifade etmeye devam edin',
            emotional_awareness: 'Harika bir duygusal farkındalık gösteriyorsunuz',
            share: 'Paylaş',
            feed: 'Akış',
            calendar: 'Takvim',
            how_are_you_feeling: 'Şu anda nasıl hissediyorsun?',
            todays_feelings: 'Bugünün Duyguları',
            your_mood_calendar: 'Ruh Hali Takviminiz',
            mood_analysis_title: '🎭 Ruh Hali Analiziniz',
            select_emoji: '1. Bir emoji seçin',
            select_color: '2. Bir renk seçin',
            record_short_sound: '3. Kısa bir ses kaydedin',
            silent_emotional_sharing: 'Sessiz Duygusal Paylaşım',
            app_description: 'Duygularınızı sözcükler olmadan paylaşın. Duygusal durumunuzu anonim olarak ifade etmek için emoji, renk ve ses kombinasyonunu kullanın.',
            calendar_description: 'Her kare bir günün baskın duygusunu temsil eder.',
            share_feeling: 'Duyguyu Paylaş'
        }
    };

    // --- LANGUAGE MANAGEMENT ---
    let currentLanguage = 'en';

    // Progress tracking function - moved here to be available for setLanguage
    const updateProgress = () => {
        const totalSteps = 3;
        let completedSteps = 0;

        if (selectedEmoji) completedSteps++;
        if (selectedColor) completedSteps++;
        if (isSoundRecorded) completedSteps++;

        const progressPercentage = (completedSteps / totalSteps) * 100;

        if (progressBar) {
            progressBar.style.width = progressPercentage + '%';
        }

        // Update feedback with progress
        if (completedSteps === 0) {
            feedbackMessage.className = 'feedback';
            feedbackMessage.textContent = t('share_your_feelings');
        } else if (completedSteps === 1) {
            feedbackMessage.className = 'feedback warning';
            feedbackMessage.textContent = t('great_start', 2);
        } else if (completedSteps === 2) {
            feedbackMessage.className = 'feedback warning';
            feedbackMessage.textContent = t('almost_done');
        } else if (completedSteps === 3) {
            feedbackMessage.className = 'feedback success';
            feedbackMessage.textContent = t('perfect_share');
        }
    };

    const setLanguage = (language) => {
        currentLanguage = language;
        localStorage.setItem('language', language); // Save language preference

        // Update UI elements
        getStartedBtn.textContent = t('get_started');
        if (moodAnalysisBtn) moodAnalysisBtn.textContent = t('request_mood_analysis');

        const backToCalendarBtn = document.getElementById('back-to-calendar-btn');
        if (backToCalendarBtn) backToCalendarBtn.textContent = t('back_to_calendar');

        // Update navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        if (navButtons.length > 0) {
            navButtons[0].textContent = t('share');
            navButtons[1].textContent = t('feed');
            navButtons[2].textContent = t('calendar');
        }

        // Update screen titles
        const shareTitle = document.querySelector('#share-screen h2');
        if (shareTitle) shareTitle.textContent = t('how_are_you_feeling');

        const feedTitle = document.querySelector('#feed-screen h2');
        if (feedTitle) feedTitle.textContent = t('todays_feelings');

        const calendarTitle = document.querySelector('#calendar-screen h2');
        if (calendarTitle) calendarTitle.textContent = t('your_mood_calendar');

        const analysisTitle = document.querySelector('#analysis-screen h2');
        if (analysisTitle) analysisTitle.textContent = t('mood_analysis_title');

        // Update labels
        const labels = document.querySelectorAll('.label');
        if (labels.length >= 3) {
            labels[0].textContent = t('select_emoji');
            labels[1].textContent = t('select_color');
            labels[2].textContent = t('record_short_sound');
        }

        // Update tagline and description
        const tagline = document.querySelector('.tagline');
        if (tagline) tagline.textContent = t('silent_emotional_sharing');

        const description = document.querySelector('.description');
        if (description) description.textContent = t('app_description');

        const calendarDesc = document.querySelector('#calendar-screen .description');
        if (calendarDesc) calendarDesc.textContent = t('calendar_description');

        // Update sound record button based on current state
        if (soundRecordBtn) {
            if (isSoundRecorded) {
                soundRecordBtn.innerHTML = t('sound_recorded');
            } else if (soundRecordBtn.classList.contains('recording')) {
                soundRecordBtn.innerHTML = '<span class="mic-icon">🎤</span>';
            } else {
                soundRecordBtn.innerHTML = '🎤 ' + t('record_sound');
            }
        }

        // Show/hide instruction text
        const instructionEl = document.getElementById('record-instruction');
        if (instructionEl) {
            if (isSoundRecorded) {
                instructionEl.classList.add('show');
            } else {
                instructionEl.classList.remove('show');
            }
        }

        // Update share button
        if (shareBtn) shareBtn.textContent = t('share_feeling');

        updateProgress(); // Update feedback messages
        renderFeed(); // Update feed with new language
        renderMoodAnalysis(); // Update analysis screen
    };

    // Translation function
    const t = (key, ...params) => {
        let translation = translations[currentLanguage][key] || key;
        if (params.length > 0) {
            params.forEach((param, index) => {
                translation = translation.replace(`{${index}}`, param);
            });
        }
        return translation;
    };

    // Current filter state
    let currentFilter = 'all';

    // Function to animate number counting
    const animateNumber = (element, targetNumber) => {
        const startNumber = parseInt(element.textContent) || 0;
        const duration = 1000;
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentNumber = Math.floor(startNumber + (targetNumber - startNumber) * easeOut);
            
            element.textContent = currentNumber;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
    };

    // Function to animate stats update
    const animateStatsUpdate = () => {
        const totalFeelingsEl = document.getElementById('total-feelings');
        const activeUsersEl = document.getElementById('active-users');
        
        if (totalFeelingsEl && activeUsersEl) {
            // Generate random but realistic numbers
            const totalFeelings = Math.floor(Math.random() * 50) + 100;
            const activeUsers = Math.floor(Math.random() * 20) + 15;
            
            // Animate number changes
            animateNumber(totalFeelingsEl, totalFeelings);
            animateNumber(activeUsersEl, activeUsers);
        }
    };

    // Function to render the anonymous feed
    const renderFeed = (filter = 'all') => {
        feedContainer.innerHTML = ''; // Clear existing posts
        const allPosts = [...dummyFeedPosts, ...userPosts].reverse(); // Show newest first
        
        // Filter posts based on selected filter
        const filteredPosts = filter === 'all' 
            ? allPosts 
            : allPosts.filter(post => post.emoji === filter);

        // Add staggered animation delay
        filteredPosts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.className = 'feed-post';
            postElement.style.animationDelay = `${index * 0.1}s`;
            postElement.style.animation = 'slideInFromBottom 0.6s ease-out forwards';
            
            // Generate random timestamp (last 24 hours)
            const hoursAgo = Math.floor(Math.random() * 24);
            const timestamp = hoursAgo === 0 ? 'Just now' : `${hoursAgo}h ago`;
            
            // Random interaction count
            const interactions = Math.floor(Math.random() * 15) + 1;
            
            postElement.innerHTML = `
                <div class="post-header">
                    <div class="post-time">${timestamp}</div>
                    <div class="post-location">📍 Anonymous</div>
                </div>
                <div class="post-content" style="background: linear-gradient(135deg, ${post.color}15, ${post.color}25); border: 1px solid ${post.color}; padding: 15px 20px; border-radius: 20px;">
                    <span class="post-emoji">${post.emoji}</span>
                    <span class="play-sound-icon" data-emoji="${post.emoji}">🔊</span>
                </div>
                <div class="post-footer">
                    <div class="post-stats">
                        <span class="interaction-count">${interactions} people relate</span>
                    </div>
                    <div class="post-interaction">
                        <button class="feel-same-btn">${t('i_feel_the_same')}</button>
                    </div>
                </div>
            `;
            feedContainer.appendChild(postElement);
        });

        // Update stats with animation
        animateStatsUpdate();
    };

    // Function to render the mood calendar - moved here to fix hoisting
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

    // Function to render mood analysis - moved here to fix hoisting
    const renderMoodAnalysis = () => {
        const emotionStats = document.getElementById('emotion-stats');
        const trendInsights = document.getElementById('trend-insights');
        const personalInsights = document.getElementById('personal-insights');

        // Emotion statistics
        const emotions = [
            { emoji: '😊', name: t('happy'), percentage: '35%' },
            { emoji: '🤔', name: t('thoughtful'), percentage: '28%' },
            { emoji: '😴', name: t('tired'), percentage: '20%' },
            { emoji: '😍', name: t('excited'), percentage: '17%' }
        ];

        emotionStats.innerHTML = `<h3>${t('emotion_stats')}</h3>` + emotions.map(emotion => `
            <div class="emotion-stat">
                <div class="emotion-info">
                    <span class="emotion-emoji">${emotion.emoji}</span>
                    <span>${emotion.name}</span>
                </div>
                <span class="emotion-percentage">${emotion.percentage}</span>
            </div>
        `).join('');

        // Trend insights
        const trends = [
            t('evening_moods'),
            t('weekends_positive'),
            t('consistently_sharing'),
            t('active_sharing')
        ];

        trendInsights.innerHTML = `<h3>${t('trend_insights')}</h3>` + trends.map(trend => `
            <div class="insight-item">${trend}</div>
        `).join('');

        // Personal insights
        const insights = [
            t('emotional_range'),
            t('note_patterns'),
            t('express_authentically'),
            t('emotional_awareness')
        ];

        personalInsights.innerHTML =  `<h3>${t('personal_insights')}</h3>` + insights.map(insight => `
            <div class="insight-item">${insight}</div>
        `).join('');
    };

    // Load saved language preference
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        setLanguage(savedLanguage);
    }

    // --- FUNCTIONS ---

    // Function to generate synthetic audio for emotions
    const generateEmotionTone = (emotion) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Different frequencies for different emotions
        const frequencies = {
            '😊': [440, 550, 660], // Happy - major chord
            '😔': [220, 260, 330], // Sad - minor chord
            '😠': [150, 180, 200], // Angry - low, harsh
            '😴': [200, 250, 300], // Tired - slow, soft
            '😍': [500, 650, 800], // Excited - high, bright
            '🤔': [350, 400, 450]  // Thinking - contemplative
        };

        const freq = frequencies[emotion] || [440];
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(freq[0], audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    };

    // Function to generate atmospheric sounds for feed
    const generateAtmosphericSound = (emotion) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create different atmospheric sounds based on emotion
        const createSound = (freq, type, duration, fadeOut = true) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const filterNode = audioContext.createBiquadFilter();

            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

            if (fadeOut) {
                gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            } else {
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            }

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);

            return { oscillator, gainNode, filterNode };
        };

        switch(emotion) {
            case '😊': // Happy - Wind chimes, birds
                createSound(800, 'sine', 1.5);
                setTimeout(() => createSound(1000, 'sine', 1.0), 200);
                setTimeout(() => createSound(1200, 'triangle', 0.8), 400);
                break;

            case '😔': // Sad - Rain, distant thunder
                createSound(150, 'triangle', 2.0);
                setTimeout(() => createSound(200, 'sawtooth', 1.5), 300);
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => createSound(100 + Math.random() * 50, 'triangle', 0.3), i * 200);
                }
                break;

            case '😠': // Angry - Thunder, storm
                createSound(80, 'sawtooth', 1.0);
                setTimeout(() => createSound(120, 'square', 0.8), 200);
                setTimeout(() => createSound(60, 'sawtooth', 1.2), 400);
                break;

            case '😴': // Tired - Ocean waves, gentle breeze, soft breathing
                // Ocean waves
                for (let i = 0; i < 6; i++) {
                    setTimeout(() => {
                        const wave = createSound(80 + Math.sin(i) * 20, 'sine', 1.2);
                        wave.gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
                        wave.gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.2);
                    }, i * 400);
                }
                // Gentle breathing sound
                setTimeout(() => createSound(200, 'triangle', 2.0), 200);
                setTimeout(() => createSound(180, 'sine', 1.8), 800);
                break;

            case '😍': // Excited - Sparkles, magical sounds
                for (let i = 0; i < 6; i++) {
                    setTimeout(() => createSound(800 + i * 200, 'triangle', 0.4), i * 150);
                }
                setTimeout(() => createSound(1500, 'sine', 1.0), 500);
                break;

            case '🤔': // Thinking - Clock ticking, ambient hum
                for (let i = 0; i < 4; i++) {
                    setTimeout(() => createSound(400, 'square', 0.1), i * 500);
                }
                createSound(200, 'sine', 2.0);
                break;

            default:
                createSound(440, 'sine', 1.0);
        }
    };

    // Function to start real audio recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                recordedAudio = URL.createObjectURL(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            return true;
        } catch (error) {
            console.error(t('microphone_error'), error);
            return false;
        }
    };

    // Function to stop recording
    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
    };

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

        soundRecordBtn.classList.remove('recorded', 'recording', 'counting');
        void soundRecordBtn.offsetWidth; // Force reflow
        soundRecordBtn.innerHTML = '🎤 ' + t('record_sound');

        // Hide instruction text
        const instructionEl = document.getElementById('record-instruction');
        if (instructionEl) {
            instructionEl.classList.remove('show');
        }

        feedbackMessage.textContent = '';
        feedbackMessage.className = 'feedback';
    };



    

    // --- EVENT LISTENERS ---

    // Language selector buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.target.dataset.lang;

            // Update active state
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Set language
            setLanguage(lang);
        });
    });

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

    // Emoji selection with enhanced feedback
    emojiSelector.addEventListener('click', (e) => {
        if (e.target.tagName === 'SPAN') {
            document.querySelectorAll('#emoji-selector span.selected').forEach(el => el.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedEmoji = e.target.textContent;

            // Play sound for selected emoji
            generateEmotionTone(selectedEmoji);

            // Haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }

            // Update progress
            updateProgress();
        }
    });

    // Color selection with enhanced feedback
    colorSelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-box')) {
            document.querySelectorAll('#color-selector .color-box.selected').forEach(el => el.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedColor = e.target.style.backgroundColor;

            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }

            // Update progress
            updateProgress();
        }
    });

    // Enhanced sound recording with visual feedback
    soundRecordBtn.addEventListener('click', async () => {
        if (!isSoundRecorded) {
            // Start recording immediately
            soundRecordBtn.classList.remove('recording', 'recorded', 'counting');
            void soundRecordBtn.offsetWidth; // Force reflow

            soundRecordBtn.classList.add('recording');

            // Haptic feedback for recording start
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }

            startRecording();

            // Countdown during recording (3 seconds)
            let recordingCountdown = 3;
            soundRecordBtn.innerHTML = `<span class="mic-icon">🎤</span> ${recordingCountdown}s`;

            const recordingInterval = setInterval(() => {
                recordingCountdown--;
                if (recordingCountdown > 0) {
                    soundRecordBtn.innerHTML = `<span class="mic-icon">🎤</span> ${recordingCountdown}s`;
                } else {
                    clearInterval(recordingInterval);

                    stopRecording();
                    // Recording complete state
                    isSoundRecorded = true;
                    soundRecordBtn.classList.remove('recording');
                    void soundRecordBtn.offsetWidth; // Force reflow
                    soundRecordBtn.classList.add('recorded');
                    soundRecordBtn.innerHTML = t('sound_recorded');

                    // Success haptic feedback
                    if (navigator.vibrate) {
                        navigator.vibrate([50, 100, 50]);
                    }

                    // Show instruction text
                    const instructionEl = document.getElementById('record-instruction');
                    if (instructionEl) {
                        instructionEl.classList.add('show');
                    }

                    updateProgress();
                }
            }, 1000);
        } else {
            // Reset to initial state
            isSoundRecorded = false;
            soundRecordBtn.classList.remove('recorded', 'recording', 'counting');
            void soundRecordBtn.offsetWidth; // Force reflow
            soundRecordBtn.innerHTML = '🎤 ' + t('record_sound');

            if (recordedAudio) {
                URL.revokeObjectURL(recordedAudio);
                recordedAudio = null;
            }
            updateProgress();
        }
    });

    // Share button (validation logic from flowchart)
    shareBtn.addEventListener('click', () => {
        let errors = [];
        if (!selectedColor) errors.push("a color");
        if (!selectedEmoji) errors.push("an emoji");
        if (!isSoundRecorded) errors.push("a sound");

        if (errors.length > 0) {
            feedbackMessage.className = 'feedback error';
            feedbackMessage.textContent = t('select', errors.join(', '));
            return;
        }

        // --- Success ---
        const newPost = { emoji: selectedEmoji, color: selectedColor, sound: isSoundRecorded };
        userPosts.push(newPost);

        feedbackMessage.className = 'feedback success';
        feedbackMessage.textContent = t('feeling_shared');

        // After a delay, reset and switch to the feed
        setTimeout(() => {
            resetShareScreen();
            renderFeed();
            showScreen('feed-screen');
        }, 2000);
    });

    // Filter buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            // Get filter value
            const filter = e.target.dataset.filter;
            currentFilter = filter;
            
            // Re-render feed with filter
            renderFeed(filter);
        }
    });

    // "I feel the same" button (event delegation)
    feedContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('feel-same-btn')) {
            e.target.textContent = 'Sent! ✓';
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            e.target.style.borderColor = '#fff';
            e.target.style.color = '#fff';
            setTimeout(() => {
                e.target.textContent = t('i_feel_the_same');
                 e.target.style.backgroundColor = 'transparent';
                 e.target.style.borderColor = '#a4a4c4';
                 e.target.style.color = '#a4a4c4';
            }, 2000);
        }
        if (e.target.classList.contains('play-sound-icon')) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'scale(1.2)';

            // Get the emoji from the data attribute
            const emoji = e.target.getAttribute('data-emoji');

            // Play atmospheric sound for the emoji
            generateAtmosphericSound(emoji);

            // Visual feedback with emotion-specific icons
            const soundIcons = {
                '😊': '🎵',
                '😔': '🌧️',
                '😠': '⚡',
                '😴': '🌊',
                '😍': '✨',
                '🤔': '🕰️'
            };

            // Show playing animation
            e.target.textContent = '🌊';

            setTimeout(() => {
                e.target.textContent = soundIcons[emoji] || '🎵';
            }, 200);

            setTimeout(() => {
                e.target.textContent = '🔊';
                e.target.style.transform = 'scale(1)';
                e.target.style.opacity = '0.7';
            }, 2500);
        }
    });

    // Mood analysis button
    moodAnalysisBtn.addEventListener('click', () => {
        moodAnalysisBtn.textContent = t('analyzing');
        moodAnalysisBtn.style.backgroundColor = '#596275';

        setTimeout(() => {
            renderMoodAnalysis();
            showScreen('analysis-screen');
            moodAnalysisBtn.textContent = t('request_mood_analysis');
            moodAnalysisBtn.style.backgroundColor = '';
        }, 2000);
    });

    // Back to calendar button
    const backToCalendarBtn = document.getElementById('back-to-calendar-btn');
    backToCalendarBtn.addEventListener('click', () => {
        showScreen('calendar-screen');
    });

    // --- OPENING ANIMATION MUSIC ---
    const createOpeningMusic = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a magical, uplifting melody
        const playNote = (frequency, startTime, duration, volume = 0.1) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const filterNode = audioContext.createBiquadFilter();
            
            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, startTime);
            
            filterNode.type = 'lowpass';
            filterNode.frequency.setValueAtTime(2000, startTime);
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        };
        
        // Create ambient background pad
        const createAmbientPad = () => {
            const oscillator1 = audioContext.createOscillator();
            const oscillator2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const filterNode = audioContext.createBiquadFilter();
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(filterNode);
            filterNode.connect(audioContext.destination);
            
            oscillator1.type = 'sawtooth';
            oscillator2.type = 'triangle';
            oscillator1.frequency.setValueAtTime(220, audioContext.currentTime);
            oscillator2.frequency.setValueAtTime(330, audioContext.currentTime);
            
            filterNode.type = 'lowpass';
            filterNode.frequency.setValueAtTime(800, audioContext.currentTime);
            filterNode.Q.setValueAtTime(5, audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 1);
            gainNode.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 4);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 5);
            
            oscillator1.start(audioContext.currentTime);
            oscillator2.start(audioContext.currentTime);
            oscillator1.stop(audioContext.currentTime + 5);
            oscillator2.stop(audioContext.currentTime + 5);
        };
        
        // Magical sparkle effects
        const createSparkles = () => {
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    const freq = 800 + Math.random() * 1200;
                    playNote(freq, audioContext.currentTime, 0.3, 0.05);
                }, i * 300 + Math.random() * 200);
            }
        };
        
        // Main melody (inspired by emotional, uplifting themes)
        const playMelody = () => {
            const notes = [
                { freq: 523, time: 0.5, duration: 0.8 },    // C5
                { freq: 659, time: 1.2, duration: 0.8 },    // E5
                { freq: 784, time: 1.9, duration: 1.0 },    // G5
                { freq: 880, time: 2.8, duration: 0.6 },    // A5
                { freq: 1047, time: 3.5, duration: 1.2 },   // C6
                { freq: 880, time: 4.2, duration: 0.8 },    // A5
                { freq: 784, time: 4.8, duration: 1.0 }     // G5
            ];
            
            notes.forEach(note => {
                playNote(note.freq, audioContext.currentTime + note.time, note.duration, 0.08);
            });
        };
        
        // Create whoosh sound effect
        const createWhoosh = () => {
            const noise = audioContext.createBufferSource();
            const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < data.length; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.1;
            }
            
            noise.buffer = buffer;
            
            const filterNode = audioContext.createBiquadFilter();
            const gainNode = audioContext.createGain();
            
            noise.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            filterNode.type = 'highpass';
            filterNode.frequency.setValueAtTime(2000, audioContext.currentTime);
            filterNode.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
            
            noise.start(audioContext.currentTime);
            noise.stop(audioContext.currentTime + 0.5);
        };
        
        // Start the audio experience
        createAmbientPad();
        setTimeout(() => createWhoosh(), 200);
        setTimeout(() => playMelody(), 800);
        setTimeout(() => createSparkles(), 1000);
        
        // Add some gentle echo/reverb effects
        setTimeout(() => {
            const echoNotes = [659, 784, 880];
            echoNotes.forEach((freq, i) => {
                setTimeout(() => {
                    playNote(freq, audioContext.currentTime, 0.6, 0.04);
                }, i * 200);
            });
        }, 3200);
    };

    // --- OPENING ANIMATION ---
    const openingAnimation = document.getElementById('opening-animation');
    
    // Start the opening music when animation begins
    let musicStarted = false;
    
    // Auto-advance to landing screen after animation
    setTimeout(() => {
        openingAnimation.classList.add('fade-out');
        
        setTimeout(() => {
            openingAnimation.style.display = 'none';
            landingScreen.classList.add('active');
            landingScreen.style.display = 'flex';
        }, 1000);
    }, 4500); // Show animation for 4.5 seconds
    
    // Start music when user first interacts (to comply with browser audio policies)
    const startOpeningMusic = () => {
        if (!musicStarted) {
            musicStarted = true;
            try {
                createOpeningMusic();
            } catch (error) {
                console.log('Audio context couldn\'t start:', error);
            }
        }
    };
    
    // Try to start music immediately, fallback to user interaction
    document.addEventListener('click', startOpeningMusic, { once: true });
    document.addEventListener('touchstart', startOpeningMusic, { once: true });
    document.addEventListener('keydown', startOpeningMusic, { once: true });
    
    // Try to start music automatically (may be blocked by browser)
    setTimeout(() => {
        startOpeningMusic();
    }, 100);

    // --- INITIALIZATION ---
    progressBar = document.getElementById('progress-fill');
    renderFeed();
    renderCalendar();
    updateProgress(); // Initialize progress

    // Add some CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        .shake {
            animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    // Initially, only the landing screen is visible (handled by CSS).
});
