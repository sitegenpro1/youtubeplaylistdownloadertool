/**
 * YouTube Playlist Downloader - Main JavaScript
 * A complete front-end solution for downloading YouTube playlists
 * 
 * Features:
 * - URL validation and playlist ID extraction
 * - Mock playlist data generation
 * - Download simulation with progress tracking
 * - Browser download attempt with error handling
 * - Smooth animations and user feedback
 */

// Global variables
let currentPlaylist = null;
let downloadQueue = [];
let isDownloading = false;
let downloadProgress = 0;
let currentVideoIndex = 0;

// Mock video titles for realistic data
const mockVideoTitles = [
    "Introduction to Programming - Complete Tutorial",
    "JavaScript Basics for Beginners",
    "HTML & CSS Fundamentals",
    "React.js Crash Course 2025",
    "Node.js Backend Development",
    "Database Design and SQL",
    "API Development with Express",
    "Frontend Frameworks Comparison",
    "Mobile App Development Basics",
    "Git and Version Control",
    "Deployment and DevOps",
    "Project Showcase and Next Steps"
];

const mockMusicTitles = [
    "Summer Vibes - Tropical House Mix",
    "Chill Lo-Fi Beats to Study/Relax",
    "Classic Rock Greatest Hits",
    "Electronic Dance Music Playlist",
    "Jazz & Blues Collection",
    "Indie Folk Favorites",
    "Hip Hop & R&B Classics",
    "Country Music Essentials",
    "Pop Music Top 40",
    "Reggae & Ska Mix",
    "Classical Music for Focus",
    "Meditation & Yoga Music"
];

const mockEducationalTitles = [
    "World History: Ancient Civilizations",
    "Biology 101: Cell Structure",
    "Chemistry Fundamentals",
    "Physics: Motion and Forces",
    "Mathematics: Algebra Basics",
    "Literature: Shakespeare Analysis",
    "Geography: Climate and Weather",
    "Economics: Supply and Demand",
    "Psychology: Human Behavior",
    "Art History: Renaissance Period",
    "Computer Science: Algorithms",
    "Language Learning: Spanish Basics"
];

// Utility functions
function extractPlaylistId(url) {
    const patterns = [
        /list=([a-zA-Z0-9_-]+)/,
        /playlist\?list=([a-zA-Z0-9_-]+)/,
        /youtube\.com\/v\/[^&]+&list=([a-zA-Z0-9_-]+)/,
        /youtube\.com\/embed\/[^?]+\?list=([a-zA-Z0-9_-]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }
    return null;
}

function validateYouTubeUrl(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
}

function generateMockPlaylist(playlistId) {
    const playlistTypes = ['educational', 'music', 'programming'];
    const type = playlistTypes[Math.floor(Math.random() * playlistTypes.length)];
    
    let titles, playlistTitle;
    
    switch (type) {
        case 'music':
            titles = mockMusicTitles;
            playlistTitle = 'Best Music Playlist 2025';
            break;
        case 'programming':
            titles = mockVideoTitles;
            playlistTitle = 'Complete Web Development Course';
            break;
        default:
            titles = mockEducationalTitles;
            playlistTitle = 'Educational Video Series';
    }
    
    // Shuffle and select random number of videos (6-12)
    const shuffled = [...titles].sort(() => 0.5 - Math.random());
    const videoCount = Math.floor(Math.random() * 7) + 6; // 6-12 videos
    const selectedTitles = shuffled.slice(0, videoCount);
    
    const videos = selectedTitles.map((title, index) => ({
        id: `video_${index + 1}`,
        title: title,
        duration: generateRandomDuration(),
        status: 'pending',
        thumbnail: `https://img.youtube.com/vi/${generateRandomVideoId()}/mqdefault.jpg`
    }));
    
    return {
        id: playlistId,
        title: playlistTitle,
        videoCount: videos.length,
        videos: videos
    };
}

function generateRandomDuration() {
    const minutes = Math.floor(Math.random() * 45) + 5; // 5-50 minutes
    const seconds = Math.floor(Math.random() * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function generateRandomVideoId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
    let result = '';
    for (let i = 0; i < 11; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// DOM manipulation functions
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorElement.classList.add('hidden');
    }, 5000);
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.classList.add('hidden');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function updateProgress(current, total) {
    const percentage = Math.round((current / total) * 100);
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const progressPercentage = document.getElementById('progress-percentage');
    
    progressBar.style.width = `${percentage}%`;
    progressPercentage.textContent = `${percentage}%`;
    progressText.textContent = `Downloading video ${current} of ${total}`;
    
    // Animate the progress bar
    anime({
        targets: progressBar,
        width: `${percentage}%`,
        duration: 500,
        easing: 'easeOutCubic'
    });
}

// Animation functions
function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 2px and 8px
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 6}s`;
        
        container.appendChild(particle);
    }
}

function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.faq-item, .video-item, .feature-card');
    animateElements.forEach(el => observer.observe(el));
}

// Main functionality functions
async function analyzePlaylist() {
    const urlInput = document.getElementById('playlist-url');
    const url = urlInput.value.trim();
    
    if (!url) {
        showError('url-error', 'Please enter a YouTube playlist URL');
        return;
    }
    
    if (!validateYouTubeUrl(url)) {
        showError('url-error', 'Please enter a valid YouTube URL');
        return;
    }
    
    const playlistId = extractPlaylistId(url);
    if (!playlistId) {
        showError('url-error', 'Could not extract playlist ID from URL');
        return;
    }
    
    hideError('url-error');
    
    // Show loading state
    const analyzeBtn = document.getElementById('analyze-btn');
    const originalText = analyzeBtn.textContent;
    analyzeBtn.textContent = 'Analyzing...';
    analyzeBtn.disabled = true;
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate mock playlist data
        currentPlaylist = generateMockPlaylist(playlistId);
        
        // Display results
        displayPlaylistResults();
        
        // Smooth scroll to results
        document.getElementById('playlist-results').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        showNotification('Playlist analyzed successfully!', 'success');
        
    } catch (error) {
        showError('url-error', 'Failed to analyze playlist. Please check the URL and try again.');
        showNotification('Failed to analyze playlist', 'error');
    } finally {
        analyzeBtn.textContent = originalText;
        analyzeBtn.disabled = false;
    }
}

function displayPlaylistResults() {
    if (!currentPlaylist) return;
    
    const resultsSection = document.getElementById('playlist-results');
    const playlistTitle = document.getElementById('playlist-title');
    const playlistInfo = document.getElementById('playlist-info');
    const videoList = document.getElementById('video-list');
    
    // Update playlist info
    playlistTitle.textContent = currentPlaylist.title;
    playlistInfo.textContent = `${currentPlaylist.videoCount} videos found`;
    
    // Clear and populate video list
    videoList.innerHTML = '';
    currentPlaylist.videos.forEach((video, index) => {
        const videoElement = createVideoElement(video, index);
        videoList.appendChild(videoElement);
    });
    
    // Show results section
    resultsSection.classList.remove('hidden');
    
    // Animate results appearance
    anime({
        targets: resultsSection,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutCubic'
    });
}

function createVideoElement(video, index) {
    const videoItem = document.createElement('div');
    videoItem.className = 'video-item fade-in';
    videoItem.style.animationDelay = `${index * 0.1}s`;
    
    videoItem.innerHTML = `
        <div class="video-thumbnail">
            <span>Video ${index + 1}</span>
        </div>
        <div class="video-info">
            <div class="video-title">${video.title}</div>
            <div class="video-duration">${video.duration}</div>
        </div>
        <div class="video-status status-${video.status}">
            ${video.status.charAt(0).toUpperCase() + video.status.slice(1)}
        </div>
    `;
    
    return videoItem;
}

async function startDownload() {
    if (!currentPlaylist || isDownloading) return;
    
    isDownloading = true;
    downloadProgress = 0;
    currentVideoIndex = 0;
    
    // Show progress section
    const progressSection = document.getElementById('download-progress');
    progressSection.classList.remove('hidden');
    
    // Smooth scroll to progress
    progressSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    // Initialize progress
    updateProgress(0, currentPlaylist.videoCount);
    
    // Show current video status
    const currentVideoDiv = document.getElementById('current-video');
    const currentVideoText = document.getElementById('current-video-text');
    currentVideoDiv.classList.remove('hidden');
    
    // Process each video
    for (let i = 0; i < currentPlaylist.videos.length; i++) {
        if (!isDownloading) break;
        
        const video = currentPlaylist.videos[i];
        currentVideoIndex = i + 1;
        
        // Update status to downloading
        video.status = 'downloading';
        updateVideoStatus(i, 'downloading');
        
        // Update current video display
        currentVideoText.textContent = `Downloading: ${video.title}`;
        
        // Update progress
        updateProgress(currentVideoIndex, currentPlaylist.videoCount);
        
        // Simulate download with realistic timing
        const downloadTime = Math.random() * 3000 + 2000; // 2-5 seconds
        await new Promise(resolve => setTimeout(resolve, downloadTime));
        
        // Try to download the file
        try {
            await attemptFileDownload(video, i);
            video.status = 'completed';
            updateVideoStatus(i, 'completed');
        } catch (error) {
            video.status = 'error';
            updateVideoStatus(i, 'error');
            
            if (error.message === 'Browser blocked download') {
                showBrowserBlockModal();
                break;
            }
        }
    }
    
    // Download complete
    isDownloading = false;
    
    if (currentVideoIndex >= currentPlaylist.videoCount) {
        // All downloads completed successfully
        showSuccessModal();
        showNotification('Playlist download completed!', 'success');
    }
}

async function attemptFileDownload(video, index) {
    // Create a mock file for download attempt
    const mockContent = `This is a mock download for: ${video.title}\n\n` +
        `In a real implementation, this would contain the actual video content.\n` +
        `Video duration: ${video.duration}\n` +
        `Downloaded at: ${new Date().toLocaleString()}`;
    
    const blob = new Blob([mockContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    return new Promise((resolve, reject) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = `${video.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
        
        // Check if download was blocked
        let downloadStarted = false;
        
        a.addEventListener('click', () => {
            downloadStarted = true;
        });
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Check after a short delay if download was blocked
        setTimeout(() => {
            URL.revokeObjectURL(url);
            
            // In a real scenario, you would check if the download actually started
            // For this demo, we'll simulate browser blocking randomly
            if (Math.random() < 0.1) { // 10% chance of browser blocking
                reject(new Error('Browser blocked download'));
            } else {
                resolve();
            }
        }, 100);
    });
}

function updateVideoStatus(index, status) {
    const videoItems = document.querySelectorAll('.video-item');
    if (videoItems[index]) {
        const statusElement = videoItems[index].querySelector('.video-status');
        statusElement.className = `video-status status-${status}`;
        statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    }
}

function cancelDownload() {
    isDownloading = false;
    
    // Hide progress section
    const progressSection = document.getElementById('download-progress');
    progressSection.classList.add('hidden');
    
    // Reset all video statuses
    if (currentPlaylist) {
        currentPlaylist.videos.forEach((video, index) => {
            if (video.status === 'downloading') {
                video.status = 'pending';
                updateVideoStatus(index, 'pending');
            }
        });
    }
    
    showNotification('Download cancelled', 'warning');
}

function resetApp() {
    // Reset all states
    currentPlaylist = null;
    downloadQueue = [];
    isDownloading = false;
    downloadProgress = 0;
    currentVideoIndex = 0;
    
    // Clear URL input
    document.getElementById('playlist-url').value = '';
    
    // Hide sections
    document.getElementById('playlist-results').classList.add('hidden');
    document.getElementById('download-progress').classList.add('hidden');
    
    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Modal functions
function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.remove('hidden');
    
    // Animate modal appearance
    anime({
        targets: modal.querySelector('.modal-content'),
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutCubic'
    });
}

function showBrowserBlockModal() {
    const modal = document.getElementById('block-modal');
    modal.classList.remove('hidden');
    
    // Animate modal appearance
    anime({
        targets: modal.querySelector('.modal-content'),
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutCubic'
    });
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    
    anime({
        targets: modal.querySelector('.modal-content'),
        scale: [1, 0.8],
        opacity: [1, 0],
        duration: 200,
        easing: 'easeInCubic',
        complete: () => {
            modal.classList.add('hidden');
        }
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    createParticles();
    animateOnScroll();
    
    // Initialize typewriter effect
    if (document.getElementById('typed-heading')) {
        new Typed('#typed-heading', {
            strings: [
                'Free YouTube Playlist Downloader',
                'Download Complete Playlists',
                'MP4 & MP3 Format Support',
                'Fast & Easy to Use'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
    
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Analyze button
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzePlaylist);
    }
    
    // URL input enter key
    const urlInput = document.getElementById('playlist-url');
    if (urlInput) {
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                analyzePlaylist();
            }
        });
        
        // Clear error on input
        urlInput.addEventListener('input', () => {
            hideError('url-error');
        });
    }
    
    // Download all button
    const downloadAllBtn = document.getElementById('download-all-btn');
    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', startDownload);
    }
    
    // Cancel download button
    const cancelBtn = document.getElementById('cancel-download-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelDownload);
    }
    
    // Modal close buttons
    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            closeModal('success-modal');
            resetApp();
        });
    }
    
    const closeBlockModalBtn = document.getElementById('close-block-modal-btn');
    if (closeBlockModalBtn) {
        closeBlockModalBtn.addEventListener('click', () => {
            closeModal('block-modal');
            cancelDownload();
        });
    }
    
    // FAQ accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = !answer.classList.contains('hidden');
            
            // Close all other FAQs
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.classList.remove('active');
                    q.nextElementSibling.classList.add('hidden');
                }
            });
            
            // Toggle current FAQ
            if (isOpen) {
                question.classList.remove('active');
                answer.classList.add('hidden');
            } else {
                question.classList.add('active');
                answer.classList.remove('hidden');
            }
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
    
    // Add scroll-based animations
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-section');
        
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });
});

// Export functions for potential external use
window.YouTubeDownloader = {
    analyzePlaylist,
    startDownload,
    cancelDownload,
    resetApp,
    showNotification
};