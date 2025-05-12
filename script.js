const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
const sparkleContainer = document.getElementById('sparkle-container');
const photoHolders = document.querySelectorAll('.photo-holder');
const quoteCarousel = document.querySelector('.quote-carousel');
const quotes = document.querySelectorAll('.quote');
const wishInput = document.getElementById('wish-input');
const wishButton = document.getElementById('wish-button');
const wishContainer = document.getElementById('wish-container');
const backgroundMusic = document.getElementById('background-music');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Number of static stars
const numStars = 450;
const stars = [];
const starColors = ['#f7f0e1', '#fddaff', '#deebff', '#c0d6ff', '#aab8ff', '#fce588', '#ffc0cb'];

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function createStar() {
    const color = starColors[Math.floor(Math.random() * starColors.length)];
    return {
        x: randomRange(0, canvas.width),
        y: randomRange(0, canvas.height),
        radius: randomRange(0.5, 1.5),
        opacity: randomRange(0.4, 0.8),
        fadeSpeed: randomRange(0.003, 0.01),
        isFadingIn: Math.random() < 0.5,
        color: color,
        glowRadius: randomRange(1, 3),
    };
}

for (let i = 0; i < numStars; i++) {
    stars.push(createStar());
}

// --- Moon Drawing ---
const moonRadius = 30;
const moonX = canvas.width - moonRadius - 30;
const moonY = moonRadius + 30;
const moonColor = '#f0f0d4';
const dotColor = '#d8d8c2';
const numDots = 7;
let moonGlowPhase = 0;
const moonGlowSpeed = 0.005;
const maxGlowIntensity = 0.1;

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
    const intenseOuterGlowRadius = moonRadius + 15;
    const intenseOuterGlow = ctx.createRadialGradient(
        moonX, moonY, moonRadius * 0.8,
        moonX, moonY, intenseOuterGlowRadius
    );
    intenseOuterGlow.addColorStop(0, 'rgba(255, 255, 240, 0.7)');
    intenseOuterGlow.addColorStop(0.9, 'rgba(255, 255, 240, 0.2)');
    intenseOuterGlow.addColorStop(1, 'rgba(255, 255, 240, 0.1)');

    ctx.beginPath();
    ctx.arc(moonX, moonY, intenseOuterGlowRadius, 0, Math.PI * 3);
    ctx.fillStyle = intenseOuterGlow;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 3);
    ctx.fillStyle = moonColor;
    ctx.fill();

    const innerGlowIntensity = Math.sin(moonGlowPhase) * maxGlowIntensity * 0.7;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius * 0.9, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 240, ' + Math.abs(innerGlowIntensity) + ')';
    ctx.fill();

    moonGlowPhase += moonGlowSpeed * 0.8;
    if (moonGlowPhase > Math.PI * 2) moonGlowPhase -= Math.PI * 2;

    const shineGradient = ctx.createRadialGradient(
        moonX - moonRadius * 0.4,
        moonY - moonRadius * 0.4,
        0,
        moonX - moonRadius * 0.1,
        moonY - moonRadius * 0.1,
        moonRadius * 0.4
    );
    shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    shineGradient.addColorStop(0.9, 'rgba(255, 255, 255, 0.1)');
    shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fillStyle = shineGradient;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    moonDots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(moonX + dot.xOffset, moonY + dot.yOffset, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
    });
}

function drawStars() {
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius + star.glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity * 0.2;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;

        if (star.isFadingIn) {
            star.opacity += star.fadeSpeed;
            if (star.opacity >= 0.8) star.isFadingIn = false;
        } else {
            star.opacity -= star.fadeSpeed;
            if (star.opacity <= 0.4) star.isFadingIn = true;
        }
    });
}

// --- Falling Stars Background ---
const maxFallingStars = 10;
const fallingStars = [];

function createFallingStar() {
    return {
        x: randomRange(0, canvas.width),
        y: -10,
        speed: randomRange(1, 3),
        angle: randomRange(-0.5, 0.5),
        length: randomRange(10, 20),
        opacity: randomRange(0.5, 0.9),
        trailColor: `rgba(255, 182, 193, ${randomRange(0.5, 0.9)})`,
        active: true,
    };
}

function spawnFallingStar() {
    if (fallingStars.length < maxFallingStars && Math.random() < 0.02) {
        fallingStars.push(createFallingStar());
    }
}

function updateFallingStars() {
    for (let i = fallingStars.length - 1; i >= 0; i--) {
        const star = fallingStars[i];
        if (star.active) {
            star.y += star.speed;
            star.x += star.speed * star.angle;
            if (star.y > canvas.height || star.x < 0 || star.x > canvas.width) {
                star.active = false;
            }
        }
        if (!star.active) {
            fallingStars.splice(i, 1);
        }
    }
    spawnFallingStar();
}

function drawFallingStars() {
    ctx.beginPath();
    fallingStars.forEach(star => {
        if (star.active) {
            const gradient = ctx.createLinearGradient(star.x, star.y, star.x, star.y + star.length);
            gradient.addColorStop(0, star.trailColor);
            gradient.addColorStop(1, 'rgba(255, 182, 193, 0)');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star.x, star.y + star.length * Math.cos(star.angle));
            ctx.stroke();
        }
    });
}

// --- Cursor Glowing Trail (Falling Star Effect) ---
let cursorSparkles = [];
let mouseX = 0;
let mouseY = 0;

function createCursorSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    const glow = document.createElement('div');
    glow.className = 'sparkle-glow';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    glow.style.left = `${x - 0.6}rem`;
    glow.style.top = `${y - 0.6}rem`;
    const color = ['#f472b6', '#8b5cf6', '#14b8a6'][Math.floor(Math.random() * 3)];
    sparkle.style.backgroundColor = color;
    glow.style.background = `radial-gradient(circle, ${color} 0%, rgba(255, 255, 255, 0) 70%)`;
    const size = randomRange(0.5, 1.2);
    sparkle.style.width = `${size}rem`;
    sparkle.style.height = `${size}rem`;
    sparkle.style.opacity = 0;
    glow.style.opacity = 0;
    sparkleContainer.appendChild(sparkle);
    sparkleContainer.appendChild(glow);

    sparkle.lifespan = randomRange(800, 1500);
    glow.lifespan = sparkle.lifespan;
    sparkle.fadeSpeed = randomRange(0.008, 0.015);
    glow.fadeSpeed = sparkle.fadeSpeed;
    sparkle.expandSpeed = randomRange(0.01, 0.03);
    glow.expandSpeed = sparkle.expandSpeed;
    sparkle.currentScale = 0;
    glow.currentScale = 0;
    sparkle.element = sparkle;
    glow.element = glow;

    cursorSparkles.push({ sparkle, glow });
    return { sparkle, glow };
}

function animateCursorSparkles() {
    for (let i = cursorSparkles.length - 1; i >= 0; i--) {
        const { sparkle, glow } = cursorSparkles[i];
        if (!sparkle.element || !glow.element) continue;

        sparkle.lifespan -= 16;
        glow.lifespan -= 16;

        if (sparkle.lifespan <= 0) {
            if (sparkle.element.parentNode) sparkle.element.parentNode.removeChild(sparkle.element);
            if (glow.element.parentNode) glow.element.parentNode.removeChild(glow.element);
            cursorSparkles.splice(i, 1);
            continue;
        }

        sparkle.style.opacity = Math.max(0, Math.min(1, parseFloat(sparkle.style.opacity) - sparkle.fadeSpeed));
        glow.style.opacity = Math.max(0, Math.min(0.8, parseFloat(glow.style.opacity) - glow.fadeSpeed));
        sparkle.currentScale += sparkle.expandSpeed;
        glow.currentScale += glow.expandSpeed;
        sparkle.style.transform = `scale(${sparkle.currentScale})`;
        glow.style.transform = `scale(${glow.currentScale * 1.5})`;
    }
    requestAnimationFrame(animateCursorSparkles);
}

animateCursorSparkles();

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    createCursorSparkle(mouseX, mouseY);
});

// --- Background Music Autoplay Handling ---
document.addEventListener('DOMContentLoaded', () => {
    const playPromise = backgroundMusic.play();

    if (playPromise !== undefined) {
        playPromise.catch(error => {
            // Autoplay was blocked, prompt user to allow music
            const userConsent = confirm("Would you like to play background music ('PUTRI.mp3') for a more immersive experience?");
            if (userConsent) {
                backgroundMusic.play();
            }
        });
    }
});

// --- Main Animation Loop ---
function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMoon();
    drawStars();
    updateFallingStars();
    drawFallingStars();
    requestAnimationFrame(drawScene);
}

drawScene();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawScene();
});

// --- Photo Holder Interactions ---
photoHolders.forEach(holder => {
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
});

// --- Quote Carousel ---
let currentQuoteIndex = 0;
const quoteChangeInterval = 5000;

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
        wishInput.value = '';

        setTimeout(() => {
            wishElement.style.opacity = '0';
            wishElement.style.transform = 'translateY(-50px)';
            setTimeout(() => {
                wishContainer.removeChild(wishElement);
            }, 1000);
        }, 3000);
    }
});
