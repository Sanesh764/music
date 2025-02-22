const songs = [
    { title: "Song 1", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Song 2", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Song 3", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

const audioPlayer = document.getElementById("audio-player");
const playPauseBtn = document.getElementById("play-pause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const playlist = document.getElementById("playlist");
const songTitle = document.getElementById("song-title");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

let currentSongIndex = 0;
let isPlaying = false;

// Load the playlist
function loadPlaylist() {
    songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.textContent = song.title;
        li.setAttribute("data-index", index);
        playlist.appendChild(li);

        li.addEventListener("click", () => {
            currentSongIndex = index;
            loadSong();
            playSong();
        });
    });
}

// Load the current song
function loadSong() {
    audioPlayer.src = songs[currentSongIndex].src;
    songTitle.textContent = songs[currentSongIndex].title;
    updateActiveSong();
    audioPlayer.addEventListener("loadedmetadata", updateDuration);
}

// Play the song
function playSong() {
    audioPlayer.play();
    playPauseBtn.textContent = "⏸";
    isPlaying = true;
}

// Pause the song
function pauseSong() {
    audioPlayer.pause();
    playPauseBtn.textContent = "▶️";
    isPlaying = false;
}

// Toggle play/pause
playPauseBtn.addEventListener("click", () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

// Previous song
prevBtn.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong();
    playSong();
});

// Next song
nextBtn.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong();
    playSong();
});

// Update active song in playlist
function updateActiveSong() {
    const items = playlist.getElementsByTagName("li");
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove("active");
        if (i === currentSongIndex) {
            items[i].classList.add("active");
        }
    }
}

// Update progress bar and time
audioPlayer.addEventListener("timeupdate", () => {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    progressBar.value = (currentTime / duration) * 100 || 0;
    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
});

// Seek song with progress bar
progressBar.addEventListener("input", () => {
    const seekTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
});

// Update duration display
function updateDuration() {
    durationEl.textContent = formatTime(audioPlayer.duration);
}

// Format time in mm:ss
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Auto-play next song
audioPlayer.addEventListener("ended", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong();
    playSong();
});

// Initialize
loadPlaylist();
loadSong();