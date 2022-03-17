"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
//----------------------------------
 function generateStoryMarkup(story, showDeleteBtn = false) {

  const hostName = story.getHostName();

  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? getDeleteBtnHTML() : ""}
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}



function getDeleteBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}


function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}
//---------------------
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
 
}
async function deleteStory(evt){
  let $storyLi = $(evt.target).closest('li')
  let $liID = $storyLi.attr('id')

  await storyList.removeStory(currentUser, $liID);

  await putMyStoriesOnPage();
}
$myStoriesList.on("click", ".trash-can", deleteStory);

function putMyStoriesOnPage(){
  $myStoriesList.empty()
  $favoritedStories.hide();
  for (let story of currentUser.ownStories) {
    let $story = generateStoryMarkup(story, true);
    $myStoriesList.append($story);
  }
  $myStoriesList.show()
}

async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  //Create data to send to addStory function
  const title = $('#title').val()
  const url = $('#url').val()
  const author = $('#author-name').val()
  const username = currentUser.username
  const storyInfo = {title, url, author, username };
  //create a new story
  const newStory = await storyList.addStory(currentUser,storyInfo);
  //put the story in the correct format and add it to the top of the stories
  const $story = generateStoryMarkup(newStory);
  $allStoriesList.prepend($story);
  //hide the new story form
  $('#add-new-story').slideUp("slow");
  $('#add-new-story').trigger("reset");
}
$('#add-new-story').on('submit',submitNewStory)

function putFavoritesListOnPage() {
  console.debug("putFavoritesListOnPage");

  $favoritedStories.empty();
  $myStoriesList.hide()
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  
  $favoritedStories.show();
}

async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  if ($tgt.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite);

