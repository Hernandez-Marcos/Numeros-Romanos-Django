// ============================================
// ANIMATION AND FEEDBACK EFFECTS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const mensaje = document.getElementById("mensaje");
    const contenedor = document.querySelector(".contenedor");
    const gatitos = document.querySelectorAll(".gatito");
    const romano = document.querySelector(".romano");
    const button = document.querySelector("button");

    // Check if there's a feedback message and trigger animations
    if (mensaje && mensaje.textContent.trim()) {
        const isCorrect = mensaje.textContent.includes("Correcto");
        
        if (isCorrect) {
            // Correct answer animations
            mensaje.classList.add("correct-feedback");
            contenedor.classList.add("correct-answer");
            button.classList.add("btn-success");
            
            // Make kittens bounce
            gatitos.forEach((gatito, index) => {
                setTimeout(() => {
                    gatito.classList.add("bounce");
                }, index * 100);
            });
            
            // Create confetti effect
            createConfetti();
            
            // Play success sound
            playSound("success");
            
        } else if (mensaje.textContent.includes("Incorrecto")) {
            // Incorrect answer animations
            mensaje.classList.add("incorrect-feedback");
            contenedor.classList.add("incorrect-answer");
            button.classList.add("btn-error");
            romano.classList.add("pulse-animation");
            
            // Play error sound
            playSound("error");
        }
        
        // Remove animation classes after animation completes
        setTimeout(() => {
            contenedor.classList.remove("correct-answer", "incorrect-answer");
            mensaje.classList.remove("correct-feedback", "incorrect-feedback");
            button.classList.remove("btn-success", "btn-error");
            romano.classList.remove("pulse-animation");
            gatitos.forEach(gatito => gatito.classList.remove("bounce"));
        }, 1000);
    }
});

// Confetti effect for correct answers
function createConfetti() {
    const colors = ["#4CAF50", "#FFD700", "#FF69B4", "#00CED1", "#FF6347", "#9370DB"];
    const confettiCount = 30;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement("div");
            confetti.className = "confetti fall";
            confetti.style.left = Math.random() * 100 + "vw";
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 1 + 1.5) + "s";
            confetti.style.animationDelay = (Math.random() * 0.3) + "s";
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 30);
    }
}

// Sound effects (using Web Audio API)
function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === "success") {
            // Happy ascending notes
            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } else if (type === "error") {
            // Descending error sound
            oscillator.type = "sawtooth";
            oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    } catch (e) {
        // Silently fail if audio not supported
        console.log("Audio not supported");
    }
}
