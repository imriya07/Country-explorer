let allCountries = [];
let favouriteCountries = JSON.parse(localStorage.getItem("favouriteCountries")) || [];
let showAll = false;

async function fetchAllCountries() {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        allCountries = data;
        displayCountries();
        displayFavourites(); // Display saved favorites on load
    } catch (error) {
        console.error("Error fetching countries:", error);
        alert("Failed to load country data.");
    }
}


function displayCountries() {
    const countryList = document.getElementById("countryList");
    countryList.innerHTML = "";

    const countriesToShow = showAll ? allCountries : allCountries.slice(0, 8);

    countriesToShow.forEach(country => {
        const countryCard = `
            <div class="col-md-3 allCard">
                <div class="card p-2 shadow-sm" onclick="showCountryDetails('${country.cca2}')">
                    <img src="${country.flags.svg}" class="card-img-top" alt="Flag">
                    <div class="card-body">
                        <h5 class="card-title">${country.name.common}</h5>
                        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
                        <p><strong>Region:</strong> ${country.region}</p>
                    </div>
                </div>
            </div>
        `;
        countryList.innerHTML += countryCard;
    });

    updateShowMoreButton();
}

function showCountryDetails(countryCode) {
    const country = allCountries.find(c => c.cca2 === countryCode);
    
    if (!country) return;

    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = `
        <img src="${country.flags.svg}" class="img-fluid mb-2 country_flag" alt="Flag">
        <h4 class="countryname text-center">${country.name.common}</h4>
        <p class="text-center countryhaeding"><strong>Official Name:</strong> <span class="country_p">${country.name.official}</span> <br/> 
        <strong>Capital:</strong> <span class="country_p">${country.capital ? country.capital[0] : "N/A"}</span>  <br/> 
        <strong>Region:</strong> <span class="country_p">${country.region}</span>  <br/>
        <strong>Population:</strong> <span class="country_p">${country.population.toLocaleString()} </span> <br/>
        <strong>Languages:</strong> <span class="country_p">${country.languages ? Object.values(country.languages).join(", ") : "N/A"}</span>  <br/>
        <strong>Currency:</strong> <span class="country_p">${country.currencies ? Object.values(country.currencies)[0].name : "N/A"} (${country.currencies ? Object.keys(country.currencies)[0] : ""})</span> 
        </p>
        <div class="text-center">
            <button class="btn btn-outline-danger" onclick="addToFavourite('${country.cca2}')">❤️ Add to Favourite</button>
        </div>
    `;

    const countryModal = new bootstrap.Modal(document.getElementById("countryModal"));
    countryModal.show();
}

function addToFavourite(countryCode) {
    const country = allCountries.find(c => c.cca2 === countryCode);

    if (!country) return;

    if (favouriteCountries.some(fav => fav.cca2 === countryCode)) {
        showToast("Already in favourites!");
        return;
    }

    favouriteCountries.push(country);
    localStorage.setItem("favouriteCountries", JSON.stringify(favouriteCountries));
    displayFavourites();

    // Show success toast message
    showToast(`${country.name.common} added to favourites!`);
}


// Function to Show Toast
function showToast(message) {
    const toastEl = document.getElementById("toastMessage");
    toastEl.querySelector(".toast-body").innerText = message;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}


function displayFavourites() {
    let favouriteSection = document.getElementById("favouritesList");

    if (!favouriteSection) {
        favouriteSection = document.createElement("div");
        favouriteSection.id = "favouritesList";
        favouriteSection.classList.add("container", "mt-4");
        document.querySelector(".overlay .container").appendChild(favouriteSection);
    }

    if (favouriteCountries.length === 0) {
        favouriteSection.innerHTML = "";
        return;
    }

    favouriteSection.innerHTML = "<h2 class='text-center'>⭐ Favourites</h2><div class='row'></div>";

    const favRow = favouriteSection.querySelector(".row");

    favouriteCountries.forEach(country => {
        const favCard = `
            <div class="col-md-3">
                <div class="card p-2 shadow-sm">
                    <img src="${country.flags.svg}" class="card-img-top" alt="Flag">
                    <div class="card-body">
                        <h5 class="card-title">${country.name.common}</h5>
                        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
                        <p><strong>Region:</strong> ${country.region}</p>
                        <button class="btn btn-outline-danger" onclick="removeFromFavourite('${country.cca2}')">❌ Remove</button>
                    </div>
                </div>
            </div>
        `;
        favRow.innerHTML += favCard;
    });
}


function removeFromFavourite(countryCode) {
    favouriteCountries = favouriteCountries.filter(country => country.cca2 !== countryCode);
    localStorage.setItem("favouriteCountries", JSON.stringify(favouriteCountries)); // Update localStorage
    displayFavourites();
}


function filterCountries() {
    const searchText = document.getElementById("countryInput").value.toLowerCase();
    allCountries = allCountries.filter(country =>
        country.name.common.toLowerCase().includes(searchText)
    );
    showAll = false;
    displayCountries();
}

function toggleShowMore() {
    showAll = !showAll;
    displayCountries();
}

function updateShowMoreButton() {
    let buttonContainer = document.getElementById("showMoreContainer");

    if (!buttonContainer) {
        buttonContainer = document.createElement("div");
        buttonContainer.id = "showMoreContainer";
        buttonContainer.classList.add("text-center", "mt-3");
        document.querySelector(".overlay .container").appendChild(buttonContainer);
    }

    buttonContainer.innerHTML = `
        <button class="btn btn-primary mb-3" onclick="toggleShowMore()">
            ${showAll ? "Show Less" : "Show More"}
        </button>
    `;
}


fetchAllCountries();
