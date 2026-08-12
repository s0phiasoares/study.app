// ==========================================
// STUDY PATH TO THE FUTURE
// Main JavaScript
// ==========================================


// ================================
// ELEMENTS
// ================================

const modal = document.getElementById("modal");

const startButton = document.getElementById("startButton");
const headerStart = document.getElementById("headerStart");
const ctaButton = document.getElementById("ctaButton");

const learnButton = document.getElementById("learnButton");

const closeModal = document.getElementById("closeModal");
const modalStart = document.getElementById("modalStart");


// ================================
// OPEN MODAL
// ================================

function openModal() {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}


// ================================
// CLOSE MODAL
// ================================

function closeModalWindow() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
}


// ================================
// START BUTTONS
// ================================

startButton.addEventListener("click", openModal);

headerStart.addEventListener("click", openModal);

ctaButton.addEventListener("click", openModal);


// ================================
// LEARN MORE
// ================================

learnButton.addEventListener("click", () => {

    document.getElementById("features").scrollIntoView({
        behavior: "smooth"
    });

});


// ================================
// CLOSE MODAL
// ================================

closeModal.addEventListener("click", closeModalWindow);


// ================================
// CLICK OUTSIDE MODAL
// ================================

modal.addEventListener("click", (event) => {

    if (event.target === modal) {
        closeModalWindow();
    }

});


// ================================
// ESC KEY
// ================================

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        closeModalWindow();
    }

});


// ================================
// MODAL START
// ================================

modalStart.addEventListener("click", () => {

    window.location.href = "profile.html";

});


// ================================
// HEADER SCROLL EFFECT
// ================================

window.addEventListener("scroll", () => {

    const header = document.querySelector(".header");

    if (window.scrollY > 30) {

        header.style.background =
            "rgba(8, 11, 24, 0.75)";

        header.style.backdropFilter =
            "blur(15px)";

    } else {

        header.style.background = "transparent";

        header.style.backdropFilter = "none";

    }

});


// ================================
// FEATURE CARD ANIMATION
// ================================

const cards = document.querySelectorAll(".feature-card");

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform =
                    "translateY(0)";

            }

        });

    },
    {
        threshold: 0.15
    }
);


cards.forEach((card) => {

    card.style.opacity = "0";
    card.style.transform = "translateY(25px)";
    card.style.transition = "0.6s ease";

    observer.observe(card);

});


// ================================
// CONSOLE
// ================================

console.log(
    "%c🚀 Study Path to the Future",
    "font-size: 20px; font-weight: bold;"
);

console.log(
    "%cPlan your goals. Build your future.",
    "font-size: 13px;"
);