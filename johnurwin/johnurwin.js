// Initialize Particles.js with the particles background
particlesJS('particles-js', {
    particles: {
        number: { value: 100, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" }, // Default color
        shape: {
            type: "circle",
            stroke: { width: 0, color: "#000000" },
            polygon: { nb_sides: 5 }
        },
        opacity: { value: 0.7, random: false },
        size: { value: 4, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff", // Default line color
            opacity: 0.6,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            attract: { enable: false }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: false }, // Disable hover interactions
            onclick: { enable: true, mode: "none" }, // No default action for click
            resize: true
        },
        modes: {
            grab: { distance: 200, line_linked: { opacity: 1, width: 3 } },
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
});

// Handle Click Event
document.querySelector('#particles-js').addEventListener('click', function(event) {
    const canvas = document.querySelector('#particles-js canvas');
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left; // X position relative to the canvas
    const y = event.clientY - rect.top;  // Y position relative to the canvas

    // Change particle color and make them push outward
    changeParticleEffect(x, y);
});

// Function to change particle color and create a burst effect
function changeParticleEffect(x, y) {
    // Get particles.js instance to access particles
    particlesJS('particles-js', {
        particles: {
            color: { value: "#00e676" }, // Change color to neon green
            size: { value: 8 }, // Increase particle size for more impact
            line_linked: {
                enable: true,
                color: "#00e676", // Change lines to neon green
                width: 2 // Thicker lines for more impact
            },
            move: {
                enable: true,
                speed: 15, // Speed up the particle movement for burst
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                attract: { enable: false }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onclick: {
                    enable: true,
                    mode: "none"
                },
                resize: true
            },
            modes: {
                push: { particles_nb: 50 } // Push a burst of 50 particles
            }
        }
    });

    // Reset back to default after 1 second
    setTimeout(() => {
        particlesJS('particles-js', {
            particles: {
                color: { value: "#ffffff" }, // Reset to original color
                size: { value: 4 }, // Reset size
                line_linked: {
                    enable: true,
                    color: "#ffffff", // Reset lines to white
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 6, // Default speed
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    attract: { enable: false }
                }
            }
        });
    }, 1000); // Reset after 1 second
}






function scrollToProject(projectId) {
    const projectElement = document.getElementById(projectId);
    projectElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
