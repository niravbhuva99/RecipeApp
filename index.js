"use strict";

fetchFavmeals();

/////////////////////////////////////

const randomMealImg = document.querySelector(".randomMeal-img");
const randomMealName = document.querySelector("h4");
const serchTerm = document.querySelector("#search-term");
const serchBtn = document.querySelector("#search");

const favContainer = document.querySelector(".fav-meal");

const box = document.querySelector(".box");
const overlay = document.querySelector(".overlay");
const hideBtn = document.querySelector(".hide-button");
const mealBox = document.querySelector(".meals");
const boxImg = document.querySelector(".box-img");
const favMeal = document.querySelector(".fav-meal");

const randomMealHeading = document.querySelector(".random-meal-heading");

const addMeal = function (mealData, random = false) {
  // Creating a box so that when we refresh the page we can render a random recipe image and name
  console.log(mealData);
  const meal = document.createElement("div");
  meal.classList.add("meal");
  meal.innerHTML = `
      <div class="meal-header">
          ${random ? `<span class="random">random Recipe</span>` : ""}
        
        <button class="img-btn">
          <img
          data-id=${mealData.idMeal}
            class="randomMeal-img"
            src=${mealData.strMealThumb}
            alt=""
          />
        </button>
      </div>
      <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn ">
          <i class="fas fa-heart"></i>
        </button>
      </div>
    </div>`;
  mealBox.appendChild(meal);
  // adding item to favorite meal
  const btn = meal.querySelector(".meal-body .fav-btn");
  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      removeMealToLs(mealData.idMeal);
      btn.classList.remove("active");
    } else {
      addMealToLs(mealData.idMeal);
      btn.classList.add("active");
    }
    favContainer.innerHTML = "";
    fetchFavmeals();
  });
};
// add and remove function for localStrorage
const addMealToLs = function (mealId) {
  const mealsIds = getMealToLs();
  console.log(mealsIds, "#");
  localStorage.setItem("mealsIds", JSON.stringify([...mealsIds, mealId]));
};

const removeMealToLs = function (mealId) {
  const mealsIds = getMealToLs();
  localStorage.setItem(
    "mealsIds",
    JSON.stringify(mealsIds.filter((id) => id !== mealId))
  );
};
function getMealToLs() {
  const mealsIds = JSON.parse(localStorage.getItem("mealsIds"));
  return mealsIds === null ? [] : mealsIds;
}

async function fetchFavmeals() {
  // favContainer.innerHTML = "";
  const mealIds = getMealToLs();
  console.log(mealIds);

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    const meal = await getMealById(mealId);
    addMealToFav(meal);
  }

  // add them to the screen
  // Initialize the slider after the meals are added
  const favImg = document.querySelectorAll(".fav-img");
  renderDataForFavDish(mealIds);
  initSlider(favImg);
}
//rendering Ingredients and Process  for each meal you added to the favoriteMeal container
function renderDataForFavDish(mealIds) {
  const favImgBtn = document.querySelectorAll(".fav-img button img");
  favImgBtn.forEach((ele, i) => {
    ele.dataset.id = mealIds[i];
  });
  console.log(favImgBtn);
  favContainer.addEventListener("click", async function (e) {
    if (e.target.classList.contains("click")) {
      console.log(e.target.dataset.id);
      box.classList.remove("hidden");
      overlay.classList.remove("hidden");
      const mealData = await getMealById(e.target.dataset.id);
      rederIngredientAndProcess(mealData);
    }
  });
}
// add meal to Favorite container
const addMealToFav = function (mealData, random = false) {
  const favMeal = document.createElement("div");
  favMeal.classList.add("fav-img");
  favMeal.innerHTML = `
    <li>
    <button class="fav-btn" >
      <img class="click"
        data-id
        src=${mealData.strMealThumb}
        alt=${mealData.strMeal}
      />
      </button><span>${mealData.strMeal}</span>
      <button class="close"><i class="fa-solid fa-xmark"></i></button>
    </li>
  `;

  const btn = favMeal.querySelector(".fa-solid");

  // Hovering over the image of your favorite meal will show a close button. If you want to remove your favorite food, click the button and it will also be removed from local storage
  btn.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-solid")) {
      e.target.parentElement.parentElement.parentElement.style.display = "none";
      const dataId =
        e.target.parentElement.parentElement.querySelector(".fav-btn img");
      console.log(dataId.dataset.id);
      removeMealToLs(dataId.dataset.id);
    }
  });

  favContainer.append(favMeal);
};

// Favorite container Slider
function initSlider(favImg) {
  const right = document.querySelector(".right");
  const left = document.querySelector(".left");

  const maxSlide = favImg.length * 2;
  favImg.forEach((ele, i) => {
    ele.style.transform = `translateX(${66 * i}%)`;
  });

  let currentSlide = 0;
  const rightBtn = function () {
    if (currentSlide === maxSlide - 1) currentSlide = 0;
    else currentSlide++;
    favImg.forEach((ele, i) => {
      ele.style.transform = `translateX(${33 * 2 * (i - currentSlide)}%)`;
    });
  };
  const leftBtn = function () {
    if (currentSlide === 0) currentSlide = maxSlide - 1;
    else currentSlide--;
    favImg.forEach((ele, i) => {
      ele.style.transform = `translateX(${33 * (i - currentSlide)}%)`;
    });
  };
  right.addEventListener("click", rightBtn);
  left.addEventListener("click", leftBtn);
}
// Ingredients and Process Rendering
const rederIngredientAndProcess = function (mealData) {
  const youTubeLink = document.querySelector(".you-tube");
  youTubeLink.href = mealData.strYoutube;
  boxImg.src = mealData.strMealThumb;
  randomMealHeading.textContent = mealData.strMeal;
  for (let i = 1; i < 50; i++) {
    if (mealData[`strIngredient${i}`] === "") break;
    else {
      const html = `<span class="ingredient">${
        mealData[`strIngredient${i}`]
      }</span>  <br><br><br>`;
      box.insertAdjacentHTML("beforeend", html);
    }
  }
  const steps = mealData.strInstructions;
  console.log(mealData);
  box.insertAdjacentHTML("beforeend", steps);
};

const imageBtn = function () {
  // When we click on a random recipe picture a window will open
  // and you can see the ingredients for that recipe and the steps how to prepare it.
  // Using Event Delegation
  const imgBtn = document.querySelector(".meals");
  imgBtn.addEventListener("click", async (e) => {
    console.log(e.target.parentElement);
    if (e.target.parentElement.classList.contains("img-btn")) {
      console.log(e.target.dataset.id);
      const meal = await getMealById(e.target.dataset.id);
      rederIngredientAndProcess(meal);
      box.classList.remove("hidden");
      overlay.classList.remove("hidden");
    }
  });
};
const randomMeal = async function () {
  const randomMeal = await fetch(
    `https://www.themealdb.com/api/json/v1/1/random.php`
  );

  const resData = await randomMeal.json();
  const mealData = resData.meals[0];

  addMeal(mealData, true);
  imageBtn(mealData);
};
randomMeal();

hideBtn.addEventListener("click", () => {
  box.classList.add("hidden");
  overlay.classList.add("hidden");
});
// render meal by Id
async function getMealById(id) {
  const randomMeal = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );

  const resData = await randomMeal.json();
  const meal = resData.meals[0];
  return meal;
}
// render meal by Search
async function getMealBySearch(term) {
  const resData = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );
  const data = await resData.json();
  const meal = data.meals;

  return meal;
}
getMealBySearch("Feteer Meshaltet");

serchBtn.addEventListener("click", async function (e) {
  // clean the container
  mealBox.innerHTML = "";
  const serchValue = serchTerm.value;
  const meals = await getMealBySearch(serchValue);
  console.log(meals);
  if (meals) {
    meals.forEach((meal) => {
      console.log(meal);
      addMeal(meal);
    });
  }
});
// localStorage.clear();
