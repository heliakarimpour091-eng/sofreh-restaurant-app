
const menuContainer = document.getElementById("menu-container");
const categoryFilter = document.getElementById("category-filter");
const vegetarianFilter = document.getElementById("vegetarian-filter");

let allFoods = [];

// دریافت غذاها از API
fetch("http://194.5.195.157:7856/api/menu")
    .then(function (response) {
        return response.json();
    })
    .then(function (result) {

        allFoods = result.data;

        renderMenu();

    })
    .catch(function (error) {
        console.log("خطا:", error);
    });


// دریافت دسته‌بندی‌ها از API
fetch("http://194.5.195.157:7856/api/categories")
    .then(function (response) {
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


// نمایش و فیلتر کردن غذاها
function renderMenu() {

    const selectedCategory = categoryFilter.value;
    const onlyVegetarian = vegetarianFilter.checked;

    menuContainer.innerHTML = "";

    const filteredFoods = allFoods.filter(function (food) {

        const matchesCategory =
            selectedCategory === "" || food.category === selectedCategory;

        const matchesVegetarian =
            !onlyVegetarian || food.vegetarian === true;

        return matchesCategory && matchesVegetarian;

    });

    filteredFoods.forEach(function (food) {

        const foodCard = document.createElement("div");

        foodCard.innerHTML = `
            <h2>${food.name}</h2>
            <p>${food.description}</p>
            <p>قیمت: ${food.price} تومان</p>
            <p>امتیاز: ${food.rating}</p>
        `;

        menuContainer.appendChild(foodCard);

    });

}


// گوش دادن به تغییر فیلترها
categoryFilter.addEventListener("change", renderMenu);

vegetarianFilter.addEventListener("change", renderMenu);
