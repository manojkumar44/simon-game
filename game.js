var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var clickedSequence = [];
var gameStarted = false; // Flag variable

function nextSequence() {
  var randNum = Math.floor(Math.random() * 4);
  return randNum;
}

function getRandomColour() {
  var randomChosenColour = buttonColours[nextSequence()];
  gamePattern.push(randomChosenColour);
  animateButton(randomChosenColour);
}

function animateButton(lastBtn) {
  $(".btn").each(function () {
    var buttonID = this.id;
    if (lastBtn === buttonID) {
      // console.log("Match found for button with ID: " + buttonID);
      var $button = $(this);
      $button.addClass("pressed");
      setTimeout(function () {
        $button.removeClass("pressed");
      }, 200);

      playSound(lastBtn);
    }
  });
}

function playSound(buttonID) {
  var audio = new Audio("sounds/" + buttonID + ".mp3");
  audio.play();
}

function trackUserClick(buttonID) {
  clickedSequence.push(buttonID);
  animateButton(buttonID);

  var lastIndex = clickedSequence.length - 1;
  if (clickedSequence[lastIndex] !== gamePattern[lastIndex]) {
    // Game over, arrays don't match
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);
    $("h1").text("Game Over, Press Any Key to Restart");

    // Remove existing keypress listener
    $(document).off("keypress.restart");

    // Add new keypress listener to restart the game
    $(document).on("keypress.restart", function (event) {
      resetGame();
      console.log("Game started!");
      $("h1").text("Level 1");
      getRandomColour();
      gameStarted = true; // Set gameStarted flag to true

      // Remove the restart keypress listener after restarting the game
      $(document).off("keypress.restart");
    });

    return;
  }

  if (clickedSequence.length === gamePattern.length) {
    // Arrays match, continue the game
    setTimeout(function () {
      clickedSequence = []; // Reset clickedSequence for the next round
      $("h1").text("Level " + (gamePattern.length + 1));
      getRandomColour();
    }, 1000);
  }
}

function resetGame() {
  gamePattern = [];
  clickedSequence = [];
  gameStarted = false;
  $("h1").text("Press 'a' to start");
}

$(".btn").on("click", function () {
  if (gameStarted) {
    // Check if game has started
    var buttonID = this.id;
    trackUserClick(buttonID);
  }
});

$(document).on("keypress", function (event) {
  if (event.key === "a" && !gameStarted) {
    // Check if 'a' key is pressed and game has not started
    console.log("Game started!");
    $("h1").text("Level 1");
    getRandomColour();
    gameStarted = true; // Set gameStarted flag to true
  } else if (!gameStarted) {
    // Restart the game if any key is pressed
    resetGame();
    console.log("Game started!");
    $("h1").text("Level 1");
    getRandomColour();
    gameStarted = true; // Set gameStarted flag to true
  }
});
