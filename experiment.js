
// ## Helper functions

// Shows slides. We're using jQuery here - the **$** is the jQuery selector function, which takes as input either a DOM element or a CSS selector string.
function showSlide(id) {
  // Hide all slides
    $(".slide").hide();
    // Show just the slide we want to show
    $("#"+id).show();
}

// Get a random integer less than n.
function randomInteger(n) {
  return Math.floor(Math.random()*n);
}

// Fisher-Yates (aka Knuth) Shuffle (https://github.com/coolaj86/knuth-shuffle)
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


// ## Configuration settings
var numTrials = 40,
  condition = randomInteger(5);



// Show the instructions slide -- this is what we want subjects to see first.
showSlide("instructions");

// ## The main event
// I implement the sequence as an object with properties and methods. The benefit of encapsulating everything in an object is that it's conceptually coherent (i.e. the <code>data</code> variable belongs to this particular sequence and not any other) and allows you to **compose** sequences to build more complicated experiments. For instance, if you wanted an experiment with, say, a survey, a reaction time test, and a memory test presented in a number of different orders, you could easily do so by creating three separate sequences and dynamically setting the <code>end()</code> function for each sequence so that it points to the next. **More practically, you should stick everything in an object and submit that whole object so that you don't lose data (e.g. randomization parameters, what condition the subject is in, etc). Don't worry about the fact that some of the object properties are functions -- mmturkey (the Turk submission library) will strip these out.**

var experiment = {

  // The function that gets called when the sequence is finished.
  end: function() {
    // Show the finish slide.
    showSlide("finished");
    // Wait 1.5 seconds and then execute function
    setTimeout(function() {}, 1500);
  },

  // The work horse of the sequence - what to do on every trial.
  next: function() {
    showSlide("stage");
    // Display the configuration settings.
    $("#numTrials").text(numTrials);
    $("#condition").text(condition);
  }
}