const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

document.getElementById("mealForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const ingredientsInput = document.getElementById("ingredients").value;
  const ingredients = ingredientsInput
    ? ingredientsInput.split(",").map((item) => item.trim().toLowerCase())
    : [];

  if (ingredients.length === 0) {
    alert("Please enter at least one ingredient.");
    return;
  }

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `<p class="text-center col-span-full">🔍 Searching for recipes...</p>`;

  try {
    const allRecipes = [];
    for (const ingredient of ingredients) {
      const response = await fetch(`${BASE_URL}/filter.php?i=${ingredient}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch recipes for ${ingredient}.`);
      }
      const data = await response.json();
      if (data.meals) {
        allRecipes.push(...data.meals);
      }
    }

    const uniqueRecipes = Array.from(new Set(allRecipes.map((a) => a.idMeal)))
      .map((id) => allRecipes.find((a) => a.idMeal === id));

    resultsDiv.innerHTML = "";
    if (uniqueRecipes.length > 0) {
      uniqueRecipes.forEach((recipe) => {
        const recipeCard = document.createElement("div");
        recipeCard.className =
          "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg transform transition hover:scale-105";
        recipeCard.innerHTML = `
          <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="rounded-md mb-4">
          <h3 class="text-xl font-bold mb-2">${recipe.strMeal}</h3>
          <a href="https://www.themealdb.com/meal/${recipe.idMeal}" target="_blank" 
             class="text-blue-500 underline">
            View Recipe
          </a>
        `;
        resultsDiv.appendChild(recipeCard);
      });
    } else {
      resultsDiv.innerHTML = `<p class="text-center text-red-500 col-span-full">No recipes found. Try different ingredients.</p>`;
    }
  } catch (error) {
    resultsDiv.innerHTML = `<p class="text-center text-red-500 col-span-full">Error: ${error.message}</p>`;
  }
});

document.getElementById("toggleTheme").addEventListener("click", () => {
  const html = document.documentElement;
  html.classList.toggle("light");
  html.classList.toggle("dark");
});