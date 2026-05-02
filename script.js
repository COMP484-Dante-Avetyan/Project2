
// Dante Avetyan
// CS484
// Project 2

$(function () {

  // Pet data object
  var pet_info = {
    name: "Ye",
    weight: 20,
    happiness: 50,
    energy: 60
  };

  // Dog speech lines
  var treatLines    = ["Yum! That was delicious!", "More treats please!", "You're my favorite human!", "10/10 would eat again."];
  var playLines     = ["This is SO fun!", "Throw it again!", "Wheeeee!", "Best. Day. Ever!"];
  var exerciseLines = ["Ugh... fine.", "I hate burpees.", "Are we done yet?", "My paws hurt..."];
  var napLines      = ["Zzz... zzz...", "Finally, some peace.", "*snoring intensifies*", "Do not disturb."];

  // Clamps a number between a min and max so stats never go out of range
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  // Returns a random item from any array
  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Mood logic
  function getMood() {
    if (pet_info.weight    >= 80) return "fat";
    if (pet_info.weight    <= 10) return "underweight";
    if (pet_info.energy    < 15)  return "tired";
    if (pet_info.happiness >= 75) return "happy";
    if (pet_info.happiness <= 25) return "sad";
    return "normal";
  }

  // Speech bubble
  var bubbleTimer = null; // tracks the pending hide-timeout so we can cancel it

  function showBubble(msg) {
    var $b = $("#bubble");
    $b.text(msg);

    // Cancel any pending auto-hide from a previous call
    if (bubbleTimer) {
      clearTimeout(bubbleTimer);
      bubbleTimer = null;
    }

    $b.css("display", "block");


    // .queue() adds a function to jQuery's internal queue
    // The first line adds this function to the pet's speech to do list.
    // The next parameter is a ready callback meaning the task is done.
    // Inside the function setTimeout() fires after 1800ms and hides the bubble with display as none.
    // next() is called to mark as complete.
    // The queue doesn't run automatically (it normally waits for animations),
    // so dequeue() is called immediately to trigger it manually.
    $b.queue(function (next) {
      bubbleTimer = setTimeout(function () {
        $b.css("display", "none");
        bubbleTimer = null;
        next();
      }, 1800);
    });

    $b.dequeue();
  }


  // .hover() is a jQuery shorthand that binds two functions to an element.
  // The first function runs on mouseenter, the second runs on mouseleave.
  // Here it adds a glow class when the cursor enters the button.
  // When the cursor leaves, the glow class is removed.
  // This creates the colored glow effect on each button hover.
  $(".treat-button").hover(
      function () { $(this).addClass("glow-green");  },
      function () { $(this).removeClass("glow-green"); }
  );
  $(".play-button").hover(
      function () { $(this).addClass("glow-blue");   },
      function () { $(this).removeClass("glow-blue"); }
  );
  $(".exercise-button").hover(
      function () { $(this).addClass("glow-orange"); },
      function () { $(this).removeClass("glow-orange"); }
  );
  $(".nap-button").hover(
      function () { $(this).addClass("glow-purple"); },
      function () { $(this).removeClass("glow-purple"); }
  );

  // Update HTML
  function updatePetInfoInHtml() {
    $(".name").text(pet_info.name);
    $(".happiness").text(pet_info.happiness);
    $(".weight").text(pet_info.weight);
    $(".energy").text(pet_info.energy);

    // Update progress bars
    $("#happinessBar").css("width", pet_info.happiness + "%");
    $("#weightBar").css("width",    pet_info.weight    + "%");
    $("#energyBar").css("width",    pet_info.energy    + "%");

    // Update mood emoji
    var emojiMap = {
      happy:       "😄🐶",
      sad:         "😔🐶",
      tired:       "😴🐶",
      fat:         "🐷",
      underweight: "💔🐶",
      normal:      "🐶"
    };
    $("#petEmoji").text(emojiMap[getMood()] || "🐶");

    // Update mood hint
    var moodMessages = {
      happy:       "Ye is thriving! ",
      sad:         "Ye looks down. Try playing.",
      tired:       "Ye is exhausted. Let him nap.",
      fat:         "Ye might need some exercise.",
      underweight: "Ye might need some food.",
      normal:      "Ye is doing okay."
    };
    $("#moodText").text(moodMessages[getMood()] || "");
  }

  // Stop stats from going below 0 or above 100
  function checkWeightAndHappinessBeforeUpdating() {
    pet_info.happiness = clamp(pet_info.happiness, 0, 100);
    pet_info.weight    = clamp(pet_info.weight,    0, 100);
    pet_info.energy    = clamp(pet_info.energy,    0, 100);
  }

  function checkAndUpdatePetInfoInHtml() {
    checkWeightAndHappinessBeforeUpdating();
    updatePetInfoInHtml();
  }

  // Treat: increases happiness and weight
  function clickedTreatButton() {
    if (pet_info.weight >= 80) {
      showBubble("I'm too bloated to eat!");
      return;
    }
    pet_info.happiness += 15;
    pet_info.weight    += 5;
    pet_info.energy    += 5;
    showBubble(randomFrom(treatLines));
    checkAndUpdatePetInfoInHtml();
  }

  // Play: increases happiness, decreases weight, decreases energy
  function clickedPlayButton() {
    if (pet_info.energy < 10) {
      showBubble("I'm too tired to play...");
      return;
    }
    else if (pet_info.weight <= 10) {
      showBubble("I'm too hungry to play.");
      return;
    }
    pet_info.happiness += 10;
    pet_info.weight    -= 3;
    pet_info.energy    -= 15;
    showBubble(randomFrom(playLines));
    checkAndUpdatePetInfoInHtml();
  }

  // Exercise: decreases happiness and weight, decreases more energy than play
  function clickedExerciseButton() {
    if (pet_info.energy < 20) {
      showBubble("No energy for exercise!");
      return;
    }
    else if (pet_info.weight <= 10) {
      showBubble("I'm too hungry to exercise.");
      return;
    }
    pet_info.happiness -= 8;
    pet_info.weight    -= 7;
    pet_info.energy    -= 20;
    showBubble(randomFrom(exerciseLines));
    checkAndUpdatePetInfoInHtml();
  }

  // Nap: increases energy, slightly lowers happiness
  function clickedNapButton() {
    pet_info.energy    += 40;
    pet_info.happiness -= 5;
    showBubble(randomFrom(napLines));
    checkAndUpdatePetInfoInHtml();
  }

  // Bind buttons
  $(".treat-button").click(clickedTreatButton);
  $(".play-button").click(clickedPlayButton);
  $(".exercise-button").click(clickedExerciseButton);
  $(".nap-button").click(clickedNapButton);

  // Initial render
  checkAndUpdatePetInfoInHtml();

});