// ========== SCROLL REVEAL ==========
const revealElements = document.querySelectorAll(".reveal, .reveal-left, reveal-right");

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // stagger delay based on position
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add("revealed");
            }, delay);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(el => revealObserver.observe(el));


// ========== NAVBAR: THEME TOGGLE  ==========
const themeToggle = document.querySelector(".theme-toggle");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
    document.body.classList.add("light");
}
else {
    document.body.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const theme = document.body.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("theme", theme);
})


// ========== NAVBAR: HAMBURGER MENU ==========
const hamburger = document.querySelector(".hamburger")
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');
});

// close menu when a nav link is clicked
document.querySelectorAll('.nav-links .list li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    });
});


// ========== REVIEW SWIPER ==========
document.addEventListener("DOMContentLoaded", () => {
    const reviewsSwiper = new Swiper(".reviews-swiper", {
        loop: true,
        passiveListeners: true,
        slidesPerView: 3,
        spaceBetween: 24,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        breakpoints: {
            0: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
        },
    });
});


// ========== BACK TO TOP BUTTON ==========
const backToTop = document.getElementById("backToTop");

function handleScroll() {
    const scrolled = window.scrollY || document.documentElement.scrollTop;
    if (scrolled > 400) {
        backToTop.classList.add("visible");
    } else {
        backToTop.classList.remove("visible");
    }
}

window.addEventListener("scroll", handleScroll);
window.addEventListener("touchmove", handleScroll);

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


// ========== FAQ ACCORDION ==========
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        faqItems.forEach(i => {
            i.classList.remove("active")
        });

        if (!isActive) {
            item.classList.add("active");
        }
    });
    // open first item by default
    faqItems[0].classList.add("active");
});





