
var currentQuestion = 0;
var initialsInput = $("#initials-text");
var initialsArray = [];
var secondsLeft = (questions.length) * 15;
var xInterval = null;
var newInitials = null;

// on-click .start sets the timer and shows the content of the quiz

$(".start").click(function () {
  setTimer();
  $(".start").hide();
  $(".quiz").show();
  showQuestion();
});

// ...and starting the timer function

function setTimer() {
  xInterval = setInterval(function () {
    $("#timer").html(secondsLeft);
    secondsLeft--;
    if (secondsLeft <= 0) {
      clearInterval(xInterval);
      timeUp();
    }
  }, 1000);
}

//clicking on the start quiz button hides the start page and shows the quiz page while firing the showQuestion() function

function showQuestion() {
  var choices = questions[currentQuestion].choices;
  var question = questions[currentQuestion].title;
  $(".quiz h2").text(question);
  $(".quiz ul").html("");
  for (var i = 0; i < parseInt(choices.length); i++) {
    var show = questions[currentQuestion].choices[i];
    $(".quiz ul").append(`<li class="button-select" id="${i}">${show}</li>`);
  }

  // comparing user's guests with correct answer with on-click if/else statement. Feedback is appended and styled.

  $("li").click(function () {
    var guessid = $(this).attr("id");
    var guess = questions[currentQuestion].choices[guessid];
    var answer = questions[currentQuestion].answer;

    // checking if user's guess matches correct answer

    if (answer === guess) {
      $(".feedback").fadeIn(5);
      $(".feedback")
        .html("<h1>Correct!<h1>")
        .fadeOut(10);
      $(".feedback").css({
        color: "green",
        "text-align": "center",
        "border-top": "lightgrey",
        "border-top-width": "1px",
        "border-top-style": "solid"
      });
      currentQuestion++;
      showScorePage();

    } else {
      $(".feedback").fadeIn(5);
      $(".feedback")
        .html("<h4>Wrong!<h4>")
        .fadeOut(10);
      $(".feedback").css({
        color: "red",
        "text-align": "center",
        "border-top": "grey",
        "border-top-width": "1px",
        "border-top-style": "solid"
      });

       // incorrect answer will penalize time by 10 seconds

      secondsLeft = secondsLeft -= 10;
      currentQuestion++;
      showScorePage();
    }
  });
}

// after all questions are answered or the time is up running showScore and timeUp functions... ->

function showScorePage() {
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    $("#timer").remove();
    $(".quiz").hide();
    $(".scoreContainer").show();
    $("#scoreNumber").append(secondsLeft);
    clearInterval(xInterval);
  }
}

// -> ...while appending remaining time in seconds to the resulted score of the user

function timeUp() {
  $("#timer").text("expired!");
  $(".quiz").hide();
  $(".scoreContainer").show();
  $("#scoreNumber").append(secondsLeft);
  clearInterval(xInterval);
}

// Three local storage functions start with on-click #submit-initials button

$("#submit-initials").click(function(e) {
  e.preventDefault();
  loadScores();
  saveScores();
  showScores();
  highScoresPage();
});

// 1 - Save every new input of user's initials and resulted score. Push that info to an array. Stringify array's content to save to local storage.

function saveScores() {
  var scoreName = initialsInput.val();
  var highScores = scoreName + " : " + secondsLeft;
  initialsArray.push(highScores);

  // + add sort method to the array to show higher score first

  initialsArray.sort(function(a, b){return b-a}); 
  localStorage.setItem("listOfItems", JSON.stringify(initialsArray));
}

// 2 - Get stored in local storage info and parse it back into an object format (from string). 

function loadScores() {
  var savedScores = localStorage.getItem("listOfItems");
  var allScores = JSON.parse(savedScores);

  // If score were retrieved from local storage we need to update initialsArray to it
  
  if (allScores != null) {
    initialsArray = allScores;
  }
}

//3 - For each new result submitted we create a new line and append that to ordered list on #highScorePage

function showScores() {
  for (i = 0; i < initialsArray.length; i++) {
    newInitials = $("<li></li>").append(initialsArray[i]);
    $("#scoreList").append(newInitials);    
  }
}

// 4 - After all 3 local storage functions run show the new div

function highScoresPage() {
  $(".highScorePage").show();
  $("#initialsArray").hide();
}

// Function to see and hide highScorePage div

$("#view-highscores").click(function(){
  $(".highScorePage").toggle();
});

// functions for each of the "try again" and "clear highscores"

$("#go-back").click(function () {
  window.location.reload();
});

$("#clear").click(function (e) {
  e.preventDefault();
  $("#scoreList").css('display', 'none');
  localStorage.clear();
});