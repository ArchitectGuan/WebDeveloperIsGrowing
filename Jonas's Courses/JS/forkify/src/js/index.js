import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Like from './models/Likes';



/** Global state of the app
 * -Search object
 * -Current recipe object
 * -Shopping list object
 * -Linked recipes
 */
const state = {};


/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1) Get the query from the view
    const query = searchView.getInput();

    // 2) New search object add to the state
    state.search = new Search(query);

    // 3) Prepare UI for result
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {
        // 4) Search for recipes
        await state.search.getResults();

        // 5) Render result on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    } catch (err) {
        alert('Error when processing Search :(');
        console.error(err);
        clearLoader();
    }


};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    // Get the ID from URL
    const id = window.location.hash.replace('#', '');
    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight the selected recipe
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);
        try {
            // Get recipe data and parse ingredient
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate serving and time
            state.recipe.calcServings();
            state.recipe.calcTime();
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLike(id)
            );
        } catch (err) {
            console.error(err);
            alert('Error when processing recipe :(');
        }

    }
};

['load', 'hashchange'].forEach(event => window.addEventListener(event, controlRecipe));


/**
 * LIST CONTROLLER
 */
const controlList = () => {
    // Create a new list if there is none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};


// Handle delete and update list items events
elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        if (val > 0)
            state.list.updateCount(id, val);
    }
});

/**
 * LIKE CONTROLLER
 */

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has not like the recipe yet
    if (!state.likes.isLike(currentID)) {

        // Add to likes
        const like = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )
        // Toggle the class
        likesView.toggleLikeBtn(true);

        // Update the UI
        likesView.renderLike(like);
    } else {
        // User has like the recipe
        state.likes.deleteLike(currentID);

        // Toggle the class
        likesView.toggleLikeBtn(false);

        // Update the UI
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore like recipe on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore like recipe
    state.likes.readStorage();

    // Toggle the like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render like
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease,.btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase,.btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add,.recipe__btn--add *')) {
        // Add ingredients to the shopping list
        controlList();
    } else if (e.target.matches('.recipe__love,.recipe__love *')) {
        // Like controller
        controlLike();
    }
});
