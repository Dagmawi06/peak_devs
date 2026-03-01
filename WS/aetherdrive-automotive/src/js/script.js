const header = document.querySelector("header");
const menuToggle = document.querySelector(".menu-toggle");
const menuLinks = document.querySelectorAll("nav a");
const scrollToTopButton = document.getElementById("scroll-to-top");
const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

// Smooth scroll behavior for internal links
smoothScrollLinks.forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// Toggle mobile navigation
if (header && menuToggle) {
    const closeMenu = () => {
        header.classList.remove("mobile-open");
        menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.addEventListener("click", () => {
        const open = header.classList.toggle("mobile-open");
        menuToggle.setAttribute("aria-expanded", String(open));
    });

    menuLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

// Scroll to top button functionality
if (scrollToTopButton) {
    scrollToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", () => {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            scrollToTopButton.style.display = "block";
        } else {
            scrollToTopButton.style.display = "none";
        }
    });
}

// Intersection Observer for reveal animations
const revealTargets = document.querySelectorAll(".reveal-group, .card, .project-card");
if ("IntersectionObserver" in window && revealTargets.length) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16 });

    revealTargets.forEach((element) => observer.observe(element));
} else {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
}