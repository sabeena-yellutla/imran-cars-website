// ========== SEARCH / FILTER ==========

// ========== SEARCH PLACEHOLDER ==========
const input = document.querySelector('.search-row input');
const placeholders = [
    'Try "Honda Jazz"...',
    'Try "Maruti Suzuki"...',
    'Search by brand...',
    'Try "SUV"...',
    'Try "Automatic"...',
    'Search by fuel type...',
    'Try "Diesel"...',
    'Search by car name...',
    'Try "Toyota"...',
    'Try "Hyundai Creta"...',
];

let i = 0;
setInterval(() => {
    input.placeholder = placeholders[i];
    i = (i + 1) % placeholders.length;
}, 2000);


// ========== SEARCH SECTION ELEMENTS ==========
const allDropdowns = document.querySelectorAll(".filter-select");
const availableBtn = document.querySelector(".available-btn");
const soldBtn = document.querySelector(".sold-btn");
const clearBtn = document.querySelector(".clear-btn")
const searchInput = document.querySelector(".search-row input");
const budgetFilter = document.getElementById("budgetFilter");
const brandFilter = document.getElementById("brandFilter");
const bodyTypeFilter = document.getElementById("bodyTypeFilter");
const fuelFilter = document.getElementById("fuelFilter");
const kmFilter = document.getElementById("kmFilter");
const transmissionFilter = document.getElementById("transmissionFilter");
const yearFilter = document.getElementById("yearFilter");
const seatingFilter = document.getElementById("seatingFilter");
const resultMsg = document.getElementById("noResults");

const viewAvailableWrapper = document.getElementById("viewAvailableWrapper");
const viewAvailableBtn = document.getElementById("viewAvailableBtn");


let allCars = [];
let currentStatus = "available";

// ========== EVENT LISTENERS ==========
availableBtn.addEventListener("click", () => {
    currentStatus = "available";
    update();
    setActiveButton(availableBtn);
    document.getElementById("cars").scrollIntoView({ behavior: "smooth" });
});

soldBtn.addEventListener("click", () => {
    currentStatus = "sold";
    update();
    setActiveButton(soldBtn);
    document.getElementById("cars").scrollIntoView({ behavior: "smooth" });
});

viewAvailableBtn.addEventListener("click", () => {
    currentStatus = "available";
    update();
    setActiveButton(availableBtn);
    document.getElementById("cars").scrollIntoView({ behavior: "smooth" });
})

searchInput.addEventListener("input", update);

budgetFilter.addEventListener("change", update);
brandFilter.addEventListener("change", update);
bodyTypeFilter.addEventListener("change", update);
fuelFilter.addEventListener("change", update);
kmFilter.addEventListener("change", update);
transmissionFilter.addEventListener("change", update);
yearFilter.addEventListener("change", update);
seatingFilter.addEventListener("change", update);

// Clear Filters
clearBtn.addEventListener("click", clearFilters);

//  Active button for Filter buttons
function setActiveButton(activeBtn) {
    availableBtn.classList.remove("btn-active");
    soldBtn.classList.remove("btn-active");
    activeBtn.classList.add("btn-active");
}

// Add 'active-filter' class when a filter dropdown is selected to show active (gold) state
allDropdowns.forEach(select => {
    select.addEventListener("change", () => {
        if (select.value !== "") {
            select.classList.add("active-filter");
        } else {
            select.classList.remove("active-filter");
        }
    });
});

// ========== LOAD CAR DATA FROM JSON FILE ==========

fetch("data/cars.json")
    .then(response => response.json())
    .then(cars => {
        allCars = cars;
        update();
        setActiveButton(availableBtn);
    });

function renderCars(filteredCars) {
    const carsGrid = document.getElementById("carsGrid");
    carsGrid.innerHTML = "";

    // show view available button only on sold view
    viewAvailableWrapper.style.display = currentStatus === "sold" ? "flex" : "none";

    // show no results msg when no filters match
    if (filteredCars.length === 0) {
        resultMsg.style.display = "flex";
    }
    else {
        resultMsg.style.display = "none";

        filteredCars.forEach(car => {
            // Creating Car Cards dynamically by JS using json file data
            const card = document.createElement("div");
            card.className = `car-card ${car.status === "sold" ? "sold-card" : ""}`;
            card.innerHTML = `
        <div class="card-image">
        <img src="${car.images[0]}" alt="${car.name}" loading="lazy">
       
        ${car.status === 'sold'
                    ? `<span class='card-badge badge-sold'>Sold</span>`
                    : car.badge
                        ? `<span class='card-badge badge-${car.badge === 'Hot Deal' ? 'hot' : 'new'}'>${car.badge}</span>`
                        : ''
                }
        <button class="card-share-btn" data-id="${car.id}" aria-label="Share">
        <i class="fa-solid fa-share-nodes"></i>
        </button>
        </div>

        <div class="card-content">
        <h3 class="card-name">${car.name}</h3>

        <div class="card-specs">

        <div class="specs-row">
        <span><i class="fa-solid fa-gas-pump"></i> ${car.fuel}</span>
        <span><i class="fa-solid fa-road"></i> ${car.kmDriven.toLocaleString('en-IN')} KM</span>
        </div>

        <div class="specs-row">
        <span><i class="fa-solid fa-calendar"></i> ${car.year}</span>
        <span><i class="fa-solid fa-gears"></i> ${car.transmission}</span>
        </div>
        </div>

        <div class="card-price">
        <strong class="highlight">₹ ${car.price.toLocaleString('en-IN')}</strong>
        ${car.negotiable ? `<small class="negotiable-tag">Price Negotiable</small>` : ""}
        </div>
       
        <div class="card-buttons">
        <a href="https://wa.me/918106111489?text=${encodeURIComponent(`Hi, I am interested in ${car.name} ${car.year} priced at ₹${car.price.toLocaleString('en-IN')}. Is it still available?`)}" target="_blank" rel="noopener" aria-label="Whatsapp" class="btn-whatsapp-card">
        <i class="fa-brands fa-whatsapp"></i></a>

        <button class="btn-details" data-id="${car.id}">View Details
        <i class="fa-solid fa-arrow-right"></i></button>
        </div>

        </div>
        </div>
        `
            carsGrid.appendChild(card);
        });
    }
}

function filterAndSearch() {
    // Read all filter values
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedBudget = budgetFilter.value;
    const selectedBrand = brandFilter.value;
    const selectedBodyType = bodyTypeFilter.value;
    const selectedFuel = fuelFilter.value;
    const selectedKm = kmFilter.value;
    const selectedTransmission = transmissionFilter.value;
    const selectedYear = yearFilter.value;
    const selectedSeating = seatingFilter.value;

    // ===== FILTER CARS =====
    const filteredCars = allCars.filter(car => {
        // status must always match
        const matchStatus = car.status === currentStatus;

        // search text
        const matchSearch = searchText === "" ||
            car.name.toLowerCase().includes(searchText) ||
            car.brand.toLowerCase().includes(searchText) ||
            car.model.toLowerCase().includes(searchText) ||
            car.bodyType.toLowerCase().includes(searchText) ||
            car.fuel.toLowerCase().includes(searchText) ||
            car.transmission.toLowerCase().includes(searchText) ||
            String(car.year).includes(searchText);

        // simple filters
        const matchBrand = selectedBrand === "" || car.brand === selectedBrand;
        const matchBodyType = selectedBodyType === "" || car.bodyType === selectedBodyType;
        const matchFuel = selectedFuel === "" || car.fuel === selectedFuel;
        const matchTransmission = selectedTransmission === "" || car.transmission === selectedTransmission;
        const matchYear = selectedYear === "" || car.year === Number(selectedYear);
        const matchSeating = selectedSeating === "" || car.seats === Number(selectedSeating);

        // budget range filter
        let matchBudget = true;
        if (selectedBudget === "under3") matchBudget = car.price < 300000;
        else if (selectedBudget === "3to5") matchBudget = car.price >= 300000 && car.price <= 500000;
        else if (selectedBudget === "5to8") matchBudget = car.price >= 500000 && car.price <= 800000;
        else if (selectedBudget === "8to12") matchBudget = car.price >= 800000 && car.price <= 1200000;
        else if (selectedBudget === "above12") matchBudget = car.price > 1200000;

        // km range filter
        let matchKm = true;
        if (selectedKm === "under20") matchKm = car.kmDriven < 20000;
        else if (selectedKm === "20to50") matchKm = car.kmDriven >= 20000 && car.kmDriven <= 50000;
        else if (selectedKm === "50to80") matchKm = car.kmDriven >= 50000 && car.kmDriven <= 80000;
        else if (selectedKm === "above80") matchKm = car.kmDriven > 80000;

        // all conditions must pass
        return matchStatus && matchSearch && matchBrand && matchBodyType && matchFuel && matchTransmission && matchYear && matchSeating && matchBrand && matchBudget && matchKm;
    });

    return filteredCars;
}

function update() {
    const filteredCars = filterAndSearch();
    renderCars(filteredCars);
}

function clearFilters() {
    // reset search
    searchInput.value = "";

    // reset all dropdowns
    allDropdowns.forEach(select => {
        // reset value
        select.value = "";
        // remove active gold style
        select.classList.remove("active-filter");
    });

    // reset status to available
    currentStatus = "available";
    setActiveButton(availableBtn);

    // re-render
    update();
};

// Share Button on Car Card using Web Share API
document.getElementById("carsGrid").addEventListener("click", async (e) => {
    const shareBtn = e.target.closest(".card-share-btn");
    if (!shareBtn) return;

    e.stopPropagation();

    const carId = Number(shareBtn.dataset.id);
    const car = allCars.find(c => c.id === carId);
    if (!car) return;

    const shareData = {
        title: `${car.name} ${car.year} - Imran Cars Tadipatri`,
        text: `Check out this ${car.name} ${car.year} at ₹${car.price.toLocaleString('en-IN')} - Imran Cars Tadipatri`,
        url: window.location.href
    };

    if (navigator.share) {
        try { await navigator.share(shareData); }
        catch (err) { console.log("Share cancelled"); }
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    }
});