// Music control with button that disappears after click
const audioPlayer = {
    init() {
        const audio = document.querySelector('.background-music');
        const musicControl = document.querySelector('.music-control');
        const musicIcon = document.querySelector('.music-control i');
        const musicText = document.querySelector('.music-text');

        if (audio && musicControl && musicIcon) {
            // Check if music is already playing from localStorage
            const isPlaying = localStorage.getItem('musicPlaying') === 'true';
            const audioTime = parseFloat(localStorage.getItem('audioTime')) || 0;

            if (isPlaying) {
                // Hide button and start music
                musicControl.style.display = 'none';
                audio.currentTime = audioTime;
                audio.muted = false;
                audio.play().catch(error => {
                    console.log('Failed to play:', error);
                });
                localStorage.setItem('musicPlaying', 'true');
            } else {
                // Show button
                musicControl.style.display = 'block';
                this.updateButton(musicIcon, musicText, false);
            }

            // Handle button click
            musicControl.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (audio.paused || audio.muted) {
                    // Start playing
                    audio.currentTime = audioTime;
                    audio.muted = false;
                    audio.play().then(() => {
                        console.log('🎵 Music started');
                        // Fade out button smoothly
                        musicControl.classList.add('fade-out');
                        setTimeout(() => {
                            musicControl.style.display = 'none';
                        }, 300);
                        localStorage.setItem('musicPlaying', 'true');
                    }).catch(error => {
                        console.log('Failed to play:', error);
                        // Show error message
                        musicText.textContent = 'Gagal memutar musik';
                        setTimeout(() => {
                            musicText.textContent = 'Klik untuk memutar musik';
                        }, 2000);
                    });
                } else {
                    // Music already playing, hide button
                    musicControl.classList.add('fade-out');
                    setTimeout(() => {
                        musicControl.style.display = 'none';
                    }, 300);
                    localStorage.setItem('musicPlaying', 'true');
                }
            });

            // Save audio time periodically
            setInterval(() => {
                if (!audio.paused && !audio.muted && !isNaN(audio.currentTime)) {
                    localStorage.setItem('audioTime', audio.currentTime);
                }
            }, 1000);

            // Save audio time and state before page unload
            window.addEventListener('beforeunload', () => {
                if (!isNaN(audio.currentTime)) {
                    localStorage.setItem('audioTime', audio.currentTime);
                }
                localStorage.setItem('musicPlaying', !audio.paused && !audio.muted ? 'true' : 'false');
            });

            // Handle audio end (though it's looped)
            audio.addEventListener('ended', () => {
                localStorage.setItem('audioTime', 0);
            });

            // Handle audio error
            audio.addEventListener('error', (e) => {
                console.log('Audio error:', e);
            });
        }
    },

    updateButton(icon, text, isPlaying) {
        if (isPlaying) {
            icon.className = 'fas fa-volume-up';
            text.textContent = 'Musik sedang diputar';
        } else {
            icon.className = 'fas fa-volume-mute';
            text.textContent = 'Klik untuk memutar musik';
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    audioPlayer.init();
});
