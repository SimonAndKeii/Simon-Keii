const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
const sparkleContainer = document.getElementById('sparkle-container');
const photoHolders = document.querySelectorAll('.photo-holder');
const quoteCarousel = document.querySelector('.quote-carousel');
const quotes = document.querySelectorAll('.quote');
const wishInput = document.getElementById('wish-input');
const wishButton = document.getElementById('wish-button');
const wishContainer = document.getElementById('wish-container');
const loveVideo = document.getElementById('love-video');
let videoPlaying = false;

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Number of stars
const numStars = 450; // Increased the number of stars significantly
const stars = [];

// Array of realistic star colors
const starColors = ['#f7f0e1', '#fddaff', '#deebff', '#c0d6ff', '#aab8ff', '#fce588', '#ffc0cb'];

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function createStar() {
    const color = starColors[Math.floor(Math.random() * starColors.length)];
    return {
        x: randomRange(0, canvas.width),
        y: randomRange(0, canvas.height),
        radius: randomRange(0.5, 1.5), // Smaller radius
        opacity: randomRange(0.4, 0.8), // Slightly less bright
        fadeSpeed: randomRange(0.003, 0.01), // Slower fading
        isFadingIn: Math.random() < 0.5,
        color: color,
        glowRadius: randomRange(1, 3), // Smaller glow radius
    };
}

for (let i = 0; i < numStars; i++) {
    stars.push(createStar());
}

// --- Moon Drawing ---
const moonRadius = 30; // Adjusted radius for a full moon
const moonX = canvas.width - moonRadius - 30; // Adjusted X position
const moonY = moonRadius + 30; // Adjusted Y position
const moonColor = '#f0f0d4';
const dotColor = '#d8d8c2';
const numDots = 7; // Adjusted number of dots for a full moon
let moonGlowPhase = 0; // To control the glow intensity over time
const moonGlowSpeed = 0.005; // Even slower inner glow speed
const maxGlowIntensity = 0.1; // Slightly reduced max inner glow

// Generate static dot positions and sizes once
const moonDots = [];
for (let i = 0; i < numDots; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * moonRadius * 0.7;
    moonDots.push({
        xOffset: Math.cos(angle) * distance,
        yOffset: Math.sin(angle) * distance,
        size: randomRange(1.5, 3),
    });
}

function drawMoon() {
    // Intense Outer Glow
    const intenseOuterGlowRadius = moonRadius + 15;
    const intenseOuterGlow = ctx.createRadialGradient(
        moonX, moonY, moonRadius * 0.8,
        moonX, moonY, intenseOuterGlowRadius
    );
    intenseOuterGlow.addColorStop(0, 'rgba(255, 255, 240, 0.7)'); // Bright, almost white core
    intenseOuterGlow.addColorStop(0.9, 'rgba(255, 255, 240, 0.2)'); // Fading out glow
    intenseOuterGlow.addColorStop(1, 'rgba(255, 255, 240, 0.1)');

    ctx.beginPath();
    ctx.arc(moonX, moonY, intenseOuterGlowRadius, 0, Math.PI * 3);
    ctx.fillStyle = intenseOuterGlow;
    ctx.fill();

    // Main Moon
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 3);
    ctx.fillStyle = moonColor;
    ctx.fill();

    // Subtle Inner Glow (optional, can be reduced or removed if the outer glow is enough)
    const innerGlowIntensity = Math.sin(moonGlowPhase) * maxGlowIntensity * 0.7; // Reduced intensity
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius * 0.9, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 240, ' + Math.abs(innerGlowIntensity) + ')';
    ctx.fill();

    moonGlowPhase += moonGlowSpeed * 0.8; // Slightly slower inner glow
    if (moonGlowPhase > Math.PI * 2) {
        moonGlowPhase -= Math.PI * 2;
    }

    // Reflected Light (Shine) - making it more of a specular highlight
    const shineGradient = ctx.createRadialGradient(
        moonX - moonRadius * 0.4,
        moonY - moonRadius * 0.4,
        0,
        moonX - moonRadius * 0.1,
        moonY - moonRadius * 0.1,
        moonRadius * 0.4 // Even smaller, more focused shine
    );
    shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)'); // Very bright highlight
    shineGradient.addColorStop(0.9, 'rgba(255, 255, 255, 0.1)'); // Quick fade
    shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fillStyle = shineGradient;
    ctx.globalCompositeOperation = 'lighter'; // Try 'lighter' for an additive effect
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Dots
    moonDots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(moonX + dot.xOffset, moonY + dot.yOffset, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
    });
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMoon(); // Draw the moon first so stars don't overlap it

    stars.forEach(star => {
        // Draw the glow effect
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius + star.glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity * 0.2; // Even subtler glow opacity
        ctx.fill();

        // Draw the main star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity;
        ctx.fill();
        ctx.globalAlpha = 1; // Reset global alpha

        if (star.isFadingIn) {
            star.opacity += star.fadeSpeed;
            if (star.opacity >= 0.8) star.isFadingIn = false;
        } else {
            star.opacity -= star.fadeSpeed;
            if (star.opacity <= 0.4) star.isFadingIn = true;
        }
    });
    requestAnimationFrame(drawStars);
}

drawStars();

// --- Sparkle Effect ---
let sparkles = [];
let mouseX = 0;
let mouseY = 0;

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    const color = ['#f472b6', '#8b5cf6', '#14b8a6'][Math.floor(Math.random() * 3)];
    sparkle.style.backgroundColor = color;
    const size = randomRange(0.5, 1.2);
    sparkle.style.width = `${size}rem`;
    sparkle.style.height = `${size}rem`;
    sparkle.style.opacity = 0;
    sparkleContainer.appendChild(sparkle);

    sparkle.lifespan = randomRange(800, 1500);
    sparkle.fadeSpeed = randomRange(0.008, 0.015);
    sparkle.expandSpeed = randomRange(0.01, 0.03);
    sparkle.currentScale = 0;
    sparkle.element = sparkle;

    sparkles.push(sparkle);
    return sparkle;
}

function animateSparkles() {
    for (let i = sparkles.length - 1; i >= 0; i--) {
        const sparkle = sparkles[i];
        if (!sparkle.element) continue;

        sparkle.lifespan -= 16;

        if (sparkle.lifespan <= 0) {
            if (sparkle.element.parentNode) {
                sparkle.element.parentNode.removeChild(sparkle.element);
            }
            sparkles.splice(i, 1);
            continue;
        }

        sparkle.style.opacity = Math.max(0, Math.min(1, parseFloat(sparkle.style.opacity) - sparkle.fadeSpeed));
        sparkle.currentScale += sparkle.expandSpeed;
        sparkle.style.transform = `scale(${sparkle.currentScale})`;
    }
    requestAnimationFrame(animateSparkles);
}

animateSparkles();

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    createSparkle(mouseX, mouseY);
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawStars();
});

// --- Photo Holder Interactions ---
photoHolders.forEach(holder => {
    if (holder.classList.contains('polaroid') && holder.dataset.caption) {
        holder.addEventListener('mouseenter', () => {
            const captionDiv = document.createElement('div');
            captionDiv.classList.add('caption-overlay');
            captionDiv.innerText = holder.dataset.caption;
            holder.appendChild(captionDiv);
        });
        holder.addEventListener('mouseleave', () => {
            const captionOverlay = holder.querySelector('.caption-overlay');
            if (captionOverlay) {
                holder.removeChild(captionOverlay);
            }
        });
    }

    if (holder.classList.contains('love-note') && holder.dataset.note) {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.innerText = holder.dataset.note;
        holder.appendChild(noteDiv);
        noteDiv.style.bottom = '-3rem'; // Initially hidden
        noteDiv.style.opacity = '0';
        holder.addEventListener('mouseenter', () => {
            noteDiv.style.bottom = '0';
            noteDiv.style.opacity = '1';
        });
        holder.addEventListener('mouseleave', () => {
            noteDiv.style.bottom = '-3rem';
            noteDiv.style.opacity = '0';
        });
    }

    if (holder.classList.contains('heartbeat')) {
        holder.addEventListener('mouseenter', () => {
            holder.querySelector('img').style.transform = 'scale(1.08)';
            holder.querySelector('img').style.boxShadow = '0 0.8rem 1.5rem rgba(0, 0, 0, 0.6)';
        });
        holder.addEventListener('mouseleave', () => {
            holder.querySelector('img').style.transform = 'scale(1)';
            holder.querySelector('img').style.boxShadow = '0 0.3rem 0.7rem rgba(0, 0, 0, 0.4)';
        });
    }

    if (holder.classList.contains('falling-stars')) {
        const overlay = holder.querySelector('.star-overlay');
        holder.addEventListener('mouseenter', () => {
            overlay.style.opacity = '0';
            overlay.style.transform = 'translateY(-10px)';
        });
        holder.addEventListener('mouseleave', () => {
            overlay.style.opacity = '0.8';
            overlay.style.transform = 'translateY(0)';
        });
    }

    if (holder.classList.contains('blooming-flower')) {
        // CSS handles the bloom on hover
    }

    if (holder.classList.contains('floating-bubble')) {
        // CSS handles the floating animation
    }

    if (holder.classList.contains('sparkling-frame')) {
        // CSS handles the sparkling border
    }

    if (holder.classList.contains('intertwined-vines')) {
        // CSS handles the vine animation
    }

    if (holder.classList.contains('constellation-connect')) {
        // CSS handles the pulse effect
    }

    if (holder.classList.contains('fabric-pocket')) {
        // No specific JS interaction for this yet
    }
});

// --- Quote Carousel ---
let currentQuoteIndex = 0;
const quoteChangeInterval = 5000; // 5 seconds

function showNextQuote() {
    quotes.forEach(quote => quote.classList.remove('active'));
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    quotes[currentQuoteIndex].classList.add('active');
}

setInterval(showNextQuote, quoteChangeInterval);

// --- Wish Star ---
wishButton.addEventListener('click', () => {
    const wishText = wishInput.value.trim();
    if (wishText) {
        const wishElement = document.createElement('div');
        wishElement.classList.add('wish');
        wishElement.innerText = wishText;
        wishContainer.appendChild(wishElement);
        wishInput.value = ''; // Clear the input

        // Basic animation for the wish floating away
        setTimeout(() => {
            wishElement.style.opacity = '0';
            wishElement.style.transform = 'translateY(-50px)';
            setTimeout(() => {
                wishContainer.removeChild(wishElement);
            }, 1000); // Remove after fade out
        }, 3000); // Keep for a few seconds
    }
});

// --- Video Play/Pause ---
function playPauseVideo() {
    if (loveVideo.paused || loveVideo.ended) {
        loveVideo.play();
        videoPlaying = true;
        const playButton = document.querySelector('.play-button');
        if (playButton) {
            playButton.classList.remove('star-icon');
            playButton.innerText = 'Pause';
        }
    } else {
        loveVideo.pause();
        videoPlaying = false;
        const playButton = document.querySelector('.play-button');
        if (playButton) {
            playButton.classList.add('star-icon');
            playButton.innerText = '';
        }
    }
}