"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  putFavoritesListOnPage();
  $favoritedStories.show()
}

$("#nav-favorites").on("click", navFavoritesClick)

/**When user clicks submit opens a submit form for a new story */
function navSubmitClick(evt){
  console.debug("navSubmitClick",evt);
  hidePageComponents();
  $('#add-new-story').show()
  putStoriesOnPage();
  
}
$('#submit-new-story').on('click',navSubmitClick)

function myStoriesClick(evt){
  console.debug("myStoriesClick",evt)
  hidePageComponents();
  putMyStoriesOnPage()
  $myStoriesList.show()
}
$('#my-stories').on('click',myStoriesClick)