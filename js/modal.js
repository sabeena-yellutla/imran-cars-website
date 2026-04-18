// ========== MODAL ELEMENTS ==========
const modalOverlay = document.getElementById("carModal");
const modalClose = document.getElementById("modalClose");
const modalSwiperWrapper = document.getElementById("modalSwiperWrapper");
const modalCarName = document.getElementById("modalCarName");
const modalBadge = document.querySelector(".modal-badge");
const modalSpecs = document.getElementById("modalSpecs");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");

let swiperInstance = null;

// ========== OPEN MODAL ==========

function openModal(car) {
    // Inject photos into swiper
    modalSwiperWrapper.innerHTML = "";
    car.images.forEach(imgSrc => {
        modalSwiperWrapper.innerHTML += `
        <div class="swiper-slide">
        <img src="${imgSrc}" alt="${car.name}" loading="lazy">
        </div>`
    });

    // Initialize swiper
    swiperInstance = new Swiper(".modal-swiper", {
        loop: true,
        effect: "fade",
        mousewheel: true,
        direction: "horizontal",
        keyboard: {
            enabled: true,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });

    // Fill the car details dynamically
    modalCarName.textContent = `${car.name} ${car.year}`;

    if (car.status === "sold") {
        modalBadge.textContent = "Sold";
        modalBadge.className = "modal-badge badge-sold";
    } else if (car.badge === "Hot Deal") {
        modalBadge.textContent = "Hot Deal";
        modalBadge.className = "modal-badge badge-hot";
    } else if (car.badge === "New Arrival") {
        modalBadge.textContent = "New Arrival";
        modalBadge.className = "modal-badge badge-new";
    } else {
        modalBadge.textContent = "";
        modalBadge.className = "modal-badge";
    }

    // Specs tabel
    modalSpecs.innerHTML = `
    <span class="spec-label"><i class="fa-solid fa-car"></i> Brand</span>
    <span class="spec-value">${car.brand}</span>
    <span class="spec-label"><i class="fa-solid fa-tag"></i> Model</span>
    <span class="spec-value">${car.model}</span>
    <span class="spec-label"><i class="fa-solid fa-car-side"></i> Body Type</span>
    <span class="spec-value">${car.bodyType}</span>
    <span class="spec-label"><i class="fa-solid fa-calendar"></i> Year</span>
    <span class="spec-value">${car.year}</span>
    <span class="spec-label"><i class="fa-solid fa-gas-pump"></i> Fuel</span>
    <span class="spec-value">${car.fuel}</span>
    <span class="spec-label"><i class="fa-solid fa-road"></i> KM Driven</span>
    <span class="spec-value">${car.kmDriven.toLocaleString('en-IN')} KM</span>
    <span class="spec-label"><i class="fa-solid fa-gears"></i> Transmission</span>
    <span class="spec-value">${car.transmission}</span>
    <span class="spec-label"><i class="fa-solid fa-chair"></i> Seats</span>
    <span class="spec-value">${car.seats}</span>
    <span class="spec-label"><i class="fa-solid fa-user"></i> Owners</span>
    <span class="spec-value">${car.owners}</span>
    <span class="spec-label"><i class="fa-solid fa-shield-halved"></i> Insurance</span>
    <span class="spec-value">${car.insurance}</span>
    <span class="spec-label"><i class="fa-solid fa-id-card"></i> Registration</span>
    <span class="spec-value">${car.registration}</span>
`;

    modalPrice.textContent = `₹ ${car.price.toLocaleString('en-IN')}`;
    modalDescription.textContent = `${car.description}`;

    // show modal
    modalOverlay.classList.add("active");

    // lock body scroll
    document.body.style.overflow = "hidden";

    // hide backToTop button on modal opens
    backToTop.classList.remove("visible");
}

// ========== CLOSE MODAL ==========

function closeModal() {
    // hide modal
    modalOverlay.classList.remove("active");

    // unlock the body scroll
    document.body.style.overflow = "";

    // destroy the swiper 
    if (swiperInstance) {
        swiperInstance.destroy(true, true);
        swiperInstance = null;
    }

    // clear the content
    modalSwiperWrapper.innerHTML = "";
    modalSpecs.innerHTML = "";

    // restore back to top visibility 
    if (window.scrollY > 400) {
        backToTop.classList.add("visible");
    }
}

// Event Listeners to Close the Modal

// Close on X button
modalClose.addEventListener("click", closeModal);

// Close on overlay click
modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
        closeModal();
    }
});

// Close on Escape key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});

// Clicking on Veiw Details button opens Modal
document.getElementById("carsGrid").addEventListener("click", (event) => {

    // Get the btn and then its id
    const btn = event.target.closest(".btn-details");
    if (!btn) return;

    const carId = Number(btn.dataset.id);

    // find the car the with that id, and open the modal with that car details
    const car = allCars.find(c => c.id === carId);
    if (!car) return;


    openModal(car);
});

// ========== LIGHTBOX MODAL ==========
// TO view modal images full screen
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    lightbox.classList.remove("active");
    lightboxImg.src = "";
    lightboxImg.alt = ""
    document.body.overflow = "";
}

// Close Lightbox Modal on X button
lightboxClose.addEventListener("click", closeLightbox);

// Close Lightbox Modal on overlay click
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

// Close Lightbox Modal on Escape Key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeLightbox();
    }
})

// Trigger lightbox on modal image click to view full screen
document.querySelector(".modal-swiper").addEventListener("click", (event) => {
    const img = event.target.closest("img");
    if (!img) return;
    openLightbox(img.src, img.alt);
})
