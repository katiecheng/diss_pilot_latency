
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
  while (currentIndex > 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex --;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


// ## Configuration settings
var numTrials = 8, //40
  condition = randomInteger(4),
  myTrialOrder = shuffle([...Array(numTrials).keys()]),
  interventionTrials = myTrialOrder.slice(0,(numTrials/2)),
  assessmentTrials = myTrialOrder.slice((numTrials/2), numTrials),
  swahili_english_pairs = [
    ["adhama", "honor"],
    ["adui", "enemy"],
    ["bustani", "garden"],
    ["buu", "maggot"],
    ["chakula", "food"],
    ["dafina", "treasure"],
    ["elimu", "science"],
    ["embe", "mango"],
    ["fagio", "broom"],
    ["farasi", "horse"],
    ["fununu", "rumour"],
    ["godoro", "mattress"],
    ["goti", "knee"],
    ["hariri", "silk"],
    ["kaa", "crab"],
    ["kaburi", "grave"],
    ["kaputula", "shorts"],
    ["leso", "scarf"],
    ["maiti", "corpse"],
    ["malkia", "queen"],
    ["mashua", "boat"],
    ["ndoo", "bucket"],
    ["nyanya", "tomato"],
    ["pazia", "curtain"],
    ["pipa", "barrel"],
    ["pombe", "beer"],
    ["punda", "donkey"],
    ["rembo", "ornament"],
    ["roho", "soul"],
    ["sala", "prayer"],
    ["sumu", "poison"],
    ["tabibu", "doctor"],
    ["theluji", "snow"],
    ["tumbili", "monkey"],
    ["usingizi", "sleep"],
    ["vuke", "steam"],
    ["yai", "egg"],
    ["zeituni", "olives"],
    ["ziwa", "lake"],
    ["zulia", "carpet"]
  ];

// Show the instructions slide -- this is what we want subjects to see first.
showSlide("instructions");

// ## The main event
/* I implement the sequence as an object with properties and methods. The benefit of encapsulating everything in an object is that it's conceptually coherent (i.e. the <code>data</code> variable belongs to this particular sequence and not any other) and allows you to **compose** sequences to build more complicated experiments. For instance, if you wanted an experiment with, say, a survey, a reaction time test, and a memory test presented in a number of different orders, you could easily do so by creating three separate sequences and dynamically setting the <code>end()</code> function for each sequence so that it points to the next. **More practically, you should stick everything in an object and submit that whole object so that you don't lose data (e.g. randomization parameters, what condition the subject is in, etc). Don't worry about the fact that some of the object properties are functions -- mmturkey (the Turk submission library) will strip these out.*/
var experiment = {
  // Properties
  numTrials: numTrials,
  condition: condition,
  myTrialOrder: myTrialOrder,
  interventionStrategyGenerate: interventionTrials.slice(0,(numTrials/4)),
  interventionStrategyRestudy: interventionTrials.slice((numTrials/4), numTrials/2),
  interventionStudyTrials: shuffle(interventionTrials.slice(0)), // shallow copy
  interventionStrategyTrials: shuffle(interventionTrials.slice(0)),
  assessmentStudyTrials: assessmentTrials.slice(0),
  assessmentStrategyTrials: shuffle(assessmentTrials.slice(0)),
  swahili_english_pairs: swahili_english_pairs,

  // An array to store the data that we're collecting.
  data: [],

  //Intro to strategy
  interventionStudyFraming: function() {
    var text =  "In a moment, you will be presented with 20 Swahili words paired\
                with their English translations. You will see each Swahili-English\
                word pair for 5 seconds, and then the screen will automatically \
                advance to the next pair. Please pay attention, and try to remember\
                as many word pairs as you can."
    showSlide("interventionStudyFraming");
    $("#interventionStudyText").text(text);
  },

  // 20 items, View each item for 5 sec
  interventionStudy: function() {
    // If the number of remaining trials is 0, we're done, so call the end function.
    if (experiment.interventionStudyTrials.length == 0) {
      experiment.interventionStrategyFraming();
      return;
    }
    
    // Get the current trial - <code>shift()</code> removes the first element of the array and returns it.
    var currTrial = experiment.interventionStudyTrials.shift(),
      swahili = swahili_english_pairs[parseInt(currTrial)][0],
      english = swahili_english_pairs[parseInt(currTrial)][1];

    showSlide("interventionStudy");
    $("#wordpair").text(swahili + " : " + english);
    // Wait 5 seconds before starting the next trial.
    setTimeout(experiment.interventionStudy, 1000);
  },

  //Intro to strategy
  interventionStrategyFraming: function() {
    var text =  "Now you will be asked to study each pair either by (1) \
                reviewing the Swahili-English word pair, or (2) trying to \
                recall the English translation from memory."
    showSlide("interventionStrategyFraming");
    $("#interventionStrategyText").text(text);
  },

  //Apply strategy to each item for 5 sec 1/2 copy 1/2 generate (randomize)
  interventionStrategy: function() {
    // If the number of remaining trials is 0, we're done, so call the end function.
    if (experiment.interventionStrategyTrials.length == 0) {
      experiment.end();
      return;
    }
    // Get the current trial - <code>shift()</code> removes the first element of the array and returns it.
    var currTrial = experiment.interventionStrategyTrials.shift(),
      swahili = swahili_english_pairs[parseInt(currTrial)][0],
      english = swahili_english_pairs[parseInt(currTrial)][1];

    if ($.inArray(currTrial, experiment.interventionStrategyGenerate) != -1) {
      showSlide("interventionStrategyGenerate");
      $("#swahili").text(swahili + " : ");

      // Wait 5 seconds before starting the next trial.
      setTimeout(function(){$("#interventionForm").submit(
        experiment.captureWord("generate", swahili, english));}, 3000
      ); 
    } else {
      showSlide("interventionStudy");
      $("#wordpair").text(swahili + " : " + english);
      // Wait 5 seconds before starting the next trial.
      setTimeout(experiment.interventionStrategy, 3000); 
    }


  },

  // Capture and save trial
  captureWord: function(strategy, swahili, english) {
    var generatedWord = $("#generatedWord").val().toLowerCase(),

      data = {
        strategy: strategy,
        swahili: swahili,
        english: english,
        generatedWord: generatedWord,
        accuracy: english == generatedWord ? 1 : 0
      };

    experiment.data.push(data);
    // show next slide
    experiment.interventionStrategy();
    $("#generatedWord").val('');
    // stop form from being submitted
    return false;
  },

  /* “For 10 of these Swahili-English word pairs, you used the review strategy--
  you studied by reviewing the Swahili-English word pairs. Out of these 10, how 
  many English translations do you think you’ll remember on the quiz?” ( __ / 10, and OE why?)
  “For 10 of these Swahili-English word pairs, you used the recall strategy--you 
  studied by trying to recall the English translation from memory. Out of these 10, 
  how many English translations do you think you’ll remember on the quiz?” ( __ / 10, and OE why?)
  */

  interventionPredict: function() {

  },

  /*
  “Now, you will be shown each Swahili word again. You’ll have 10 seconds to type the 
  correct English translation.”
  */
  interventionTestIntro: function() {

  },

  /*
  No strategy feedback: summative performance outcome
  “You scored a __ / 20!”

  Strategy feedback: Proof of utility
  “You scored a __ / 20!
  When using the recall strategy, you scored __ /10
  When using the review strategy, you scored __ /10
  */
  interventionFeedback: function() {

  },


  // (All items rote for 10 sec, +/- feedback on each item)
  interventionTest: function() {

  },
  /* “Now, you will see 20 new Swahili words paired with their English translations. 
  Then, you will have 5 seconds to study each pair using whatever method you would like. 
  Finally, you will be quizzed on all 20 Swahili-English word pairs.”*/
  assessmentFraming: function() {

  },

  // 20 items, View each item for 5 sec
  assessmentStudy: function() {
    // If the number of remaining trials is 0, we're done, so call the end function.
    if (experiment.assessmentTrials.length == 0) {
      experiment.end();
      return;
    }
    
    // Get the current trial - <code>shift()</code> removes the first element of the array and returns it.
    var n = experiment.assessmentTrials.shift();
  },

  /*
  Study each item for 5 sec
  adhama - _______
  [See English definition]
  (measure latency to click)
  */
  assessmentStrategy: function() {

  },

  /*
  “Now, you will be shown each Swahili word again. You’ll have 10 seconds to type the 
  correct English translation.”
  */
  assessmentTestIntro: function() {

  },

  // (All items rote for 10 sec, +/- feedback on each item)
  assessmentTest: function() {

  },
  // The function that gets called when the sequence is finished.
  end: function() {
    // Show the finish slide.
    showSlide("end");
    // Wait 1.5 seconds and then execute function
    setTimeout(function() {$("#finaldata").text(data)}, 1500);
  }
}