
const API_URL = "http://194.5.195.157:7856/api";

const menuContainer = document.getElementById("menu-container");
const categoryFilter = document.getElementById("category-filter");
const vegetarianFilter = document.getElementById("vegetarian-filter");
const searchInput = document.getElementById("search-input");
const sortFilter = document.getElementById("sort-filter");

const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const pageInfo = document.getElementById("page-info");

let currentPage = 1;
let totalPages = 1;
const pageLimit = 6;

// دریافت غذاها از API
function loadMenu() {
    const selectedCategory = categoryFilter.value;
    const onlyVegetarian = vegetarianFilter.checked;
    const searchText = searchInput.value.trim();
    const selectedSort = sortFilter.value;

    const params = new URLSearchParams();

    if (selectedCategory !== "") {
        params.append("category", selectedCategory);
    }

    if (onlyVegetarian) {
        params.append("vegetarian", "true");
    }

    if (searchText !== "") {
        params.append("q", searchText);
    }

    if (selectedSort !== "") {
        params.append("sort", selectedSort);
    }

    params.append("page", currentPage);
    params.append("limit", pageLimit);

    const url = API_URL + "/menu?" + params.toString();

    menuContainer.innerHTML = "در حال دریافت منو...";

    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("خطا در دریافت منو");
            }

            return response.json();
        })
        .then(function (result) {
            menuContainer.innerHTML = "";

            result.data.forEach(function (food) {
                const foodCard = document.createElement("div");

                foodCard.innerHTML = `
                    <h2>${food.name}</h2>
                    <p>${food.description}</p>
                    <p>قیمت: ${food.price} تومان</p>
                    <p>امتیاز: ${food.rating}</p>
                `;

                menuContainer.appendChild(foodCard);
            });

            if (result.data.length === 0) {
                menuContainer.innerHTML = "غذایی برای نمایش وجود ندارد.";
            }

            currentPage = result.meta.page;
            totalPages = result.meta.totalPages;

            pageInfo.textContent =
                "صفحه " + currentPage + " از " + totalPages;

            prevButton.disabled = currentPage <= 1;
            nextButton.disabled = currentPage >= totalPages;
        })
        .catch(function (error) {
            menuContainer.innerHTML = "دریافت منو با مشکل مواجه شد.";
            console.log("خطا:", error);
        });
}

// دریافت دسته‌بندی‌ها
fetch(API_URL + "/categories")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("خطا در دریافت دسته‌بندی‌ها");
        }

        return response.json();
    })
    .then(function (categories) {
        categories.forEach(function (category) {
            const option = document.createElement("option");

            option.value = category.id;
            option.textContent = category.name;

            categoryFilter.appendChild(option);
        });
    })
    .catch(function (error) {
        console.log("خطا در دریافت دسته‌بندی‌ها:", error);
    });

// جست‌وجو با تأخیر ۴۰۰ میلی‌ثانیه
let searchTimer;

searchInput.addEventListener("input", function () {
    clearTimeout(searchTimer);

    searchTimer = setTimeout(function () {
        currentPage = 1;
        loadMenu();
    }, 400);
});

// تغییر فیلترها و مرتب‌سازی
function resetAndLoadMenu() {
    currentPage = 1;
    loadMenu();
}

categoryFilter.addEventListener("change", resetAndLoadMenu);
vegetarianFilter.addEventListener("change", resetAndLoadMenu);
sortFilter.addEventListener("change", resetAndLoadMenu);

// صفحه قبلی
prevButton.addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        loadMenu();
    }
});

// صفحه بعدی
nextButton.addEventListener("click", function () {
    if (currentPage < totalPages) {
        currentPage++;
        loadMenu();
    }
});

// دریافت اولیه منو
loadMenu();
