const jsPsych = initJsPsych({
  on_finish: function() {
    $.post('submit',{"content": jsPsych.data.get().csv()});
    setTimeout(function() {window.location.replace("/debrief?id=" + subjectID);},1000);
  }
});

// declare variables
var chosen_sen_ind;
var chosen_sen;
var curr_trial_num;
var curr_tw;
var curr_twc;
var sen_list;
var trial_number = 1;

var num_hints = 6;
var num_tws_per_cond = 6;
var num_trials = 24;
var num_trials_total = num_trials + 2;


// draw target words randomly from each target word cond
var tw_exp = {};
Object.keys(tw).forEach(twcond => {
  tw_exp[twcond] = jsPsych.randomization.sampleWithoutReplacement(tw[twcond], num_tws_per_cond);
});

var target_words_array = Object.values(tw_exp).reduce((a, b) => a.concat(b)); // target words array
target_words_array = jsPsych.randomization.shuffle(target_words_array); //shuffle target words


// sample sentences from each predictability bin
var sentw_exp = {};
target_words_array.forEach(tw => {
  var chosen_sen_inds = [];
  for (i = 1; i <= num_hints; i++) {
    chosen_sen_ind = jsPsych.randomization.sampleWithoutReplacement(sentw[tw][i], 1);
    chosen_sen_inds.push(chosen_sen_ind[0]);
  }
  sentw_exp[tw] = chosen_sen_inds;
});


// get sentences from indices
var sen_exp = {};
target_words_array.forEach(tw => {
  var chosen_sens = sentw_exp[tw].map(ind => sen[ind][0]);
  sen_exp[tw] = chosen_sens;
});


//timeline variable for target words
var target_words = [];
Object.keys(tw_exp).forEach(twcond => {
  tw_exp[twcond].forEach(tw => {
    target_words.push({target: tw, targetWordCondition: twcond});
  });
});
target_words = jsPsych.randomization.shuffle(target_words); //shuffle target words

//define catch trials (insert at 10th and 20th position)
var catch_1 = {target: "age", targetWordCondition: "catch"};
var catch_2 = {target: "head", targetWordCondition: "catch"};
target_words.splice(9, 0, catch_1);
target_words.splice(19, 0, catch_2);
sentw_exp[catch_1.target] = Array(num_hints).fill(NaN);
sentw_exp[catch_2.target] = Array(num_hints).fill(NaN);
sen_exp[catch_1.target] = [
  'Wheeler left Princeton University in 1976 at the age of 65.',
  'He left home at the age of 16.',
  'In Talbandha, 12% of the population is under 6 years of age.',
  'At the age of nineteen, she met and married her husband Ken, and had two sons.',
  'Eighty-eight percent of patients are 30 years of age or younger.',
  'What age is her son turning this year?'
];
sen_exp[catch_2.target] = [
  'Tom nodded his head in agreement.',
  'Tess shook her head, looking at him with disgust.',
  'Put this hat on to keep your head warm.',
  'He bumped his head on the low kitchen ceiling.',
  'I have a meeting with the head of the department tomorrow.',
  'She seemed to think about that a moment before shaking her head.'
];
sen_exp[catch_1.target] = sen_exp[catch_1.target].map(s => s.replace(catch_1.target, "&#9608;&#9608;&#9608;&#9608;&#9608;"));
sen_exp[catch_2.target] = sen_exp[catch_2.target].map(s => s.replace(catch_2.target, "&#9608;&#9608;&#9608;&#9608;&#9608;"));


// add trial number to target words
for (i = 0; i < target_words.length; i++) {target_words[i].trial_number = i+1}; //add trial num as timeline var

//timeline variable for guesses
var guess_num = [];
for (i = 1; i <= num_hints; i++) {
  guess_num.push({guess: i});
}


/*
  WELCOME========================================================================
*/

//Subject ID
var s1 = jsPsych.randomization.randomID(4);
var s2 = jsPsych.randomization.randomID(2);
var subjectID = [s1,'wp',s2].join('');

//PLS and consent
var consent = {
  type: jsPsychInstructions,
  data: {section: "consent"},
  pages: [`<p>Thanks for doing our experiment!</p>
  <p>Before we get started, click <a href='pdf/pls.pdf'>here</a> 
  to see the Plain Language Statement and <a href='pdf/consent.pdf'>here</a> 
  to see the consent form (both pdfs).</p><p>Clicking continue means you consent 
  to take part in the experiment according to the terms laid out in the form.</p>`],
  show_clickable_nav: true,
  allow_backward: false,
  button_label_next: "Continue"
}

//demographics
var demographics = {
  type: jsPsychSurveyHtmlForm,
  data: {section: "demographics"},
  preamble: "<p>First, please provide some info about yourself.</p><p>Please answer honestly - you won’t be excluded on the basis of anything you put.</p>",
  html: `<div class="demographics-container">
  <p>
    <label for="age">Age: </label>
    <select id="age" name="age" class="demographics-input">
      <option value="" selected="selected">Please select your age...</option>
      <option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option><option value="32">32</option><option value="33">33</option><option value="34">34</option><option value="35">35</option><option value="36">36</option><option value="37">37</option><option value="38">38</option><option value="39">39</option><option value="40">40</option><option value="41">41</option><option value="42">42</option><option value="43">43</option><option value="44">44</option><option value="45">45</option><option value="46">46</option><option value="47">47</option><option value="48">48</option><option value="49">49</option><option value="50">50</option><option value="51">51</option><option value="52">52</option><option value="53">53</option><option value="54">54</option><option value="55">55</option><option value="56">56</option><option value="57">57</option><option value="58">58</option><option value="59">59</option><option value="60">60</option><option value="61">61</option><option value="62">62</option><option value="63">63</option><option value="64">64</option><option value="65">65</option><option value="66">66</option><option value="67">67</option><option value="68">68</option><option value="69">69</option><option value="70">70</option><option value="71">71</option><option value="72">72</option><option value="73">73</option><option value="74">74</option><option value="75">75</option><option value="76">76</option><option value="77">77</option><option value="78">78</option><option value="79">79</option><option value="80">80</option><option value="81">81</option><option value="82">82</option><option value="83">83</option><option value="84">84</option><option value="85">85</option><option value="86">86</option><option value="87">87</option><option value="88">88</option><option value="89">89</option><option value="90">90</option><option value="91">91</option><option value="92">92</option><option value="93">93</option><option value="94">94</option><option value="95">95</option><option value="96">96</option><option value="97">97</option><option value="98">98</option><option value="99">99</option><option value="100">100</option>
    </select>
  </p>
  <p>
    <label for="gender">Gender: </label>
    <select id="gender" name="gender" class="demographics-input">
      <option value="" selected="selected">Please select your gender...</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
      <option value="prefer not to say">Prefer not to say</option>
    </select>
  </p>
  <p>What was the first language you learned? <input name="nativeLang" type="text" class="demographics-input"/></p>
  <p>What other languages do you know? (if none put N/A) <input name="otherLang" type="text" size=70 class="demographics-input"/></p>
  </div>`
}

//fullscreen
var fullscreen = {
  type: jsPsychFullscreen,
  data: {section: "setup"},
  fullscreen_mode: true,
  message: `<p>We ask that you complete this experiment in fullscreen mode to minimise distractions during the task.</p>
  <p>Press continue to do that now.</p>`,
  delay_after: 0
}

//browser data
var browser_check = {
  type: jsPsychBrowserCheck,
  data: {section: "setup"}
};

//preload media
var preload = {
    type: jsPsychPreload,
    data: {section: "setup"},
    images: [
      'img/trial-background.png',
      'img/instructions1.png',
      'img/instructions2.png',
      'img/instructions3.png',
      'img/instructions4.png',
      'img/instructions5.png',
      'img/instructions6.png',
      'img/instructions7.png',
      'img/practice-screenshot.png',
      'img/debrief.png'
    ],
    save_trial_parameters: {
      success: false,
      timeout: false,
      failed_images: false,
      failed_audio: false,
      failed_video: false
    }
}

var welcome = {
  timeline: [browser_check, preload, consent, fullscreen, demographics]
}




/*
  INSTRUCTIONS======================================================================
*/

var instructions = {
  type: jsPsychInstructions,
  data: {section: "instructions"},
  pages: [
    '<img src="img/instructions1.png"></img>',
    '<img src="img/instructions2.png"></img>',
    '<img src="img/instructions3.png"></img>',
    '<img src="img/instructions4.png"></img>',
    '<img src="img/instructions5.png"></img>',
    '<img src="img/instructions6.png"></img>',
    '<img src="img/instructions7.png"></img>'
  ],
  show_clickable_nav: true
}

var instructions_quiz_q1 = {
  prompt: "The goal of your task is to:",
  options: [
    "Write sentences so the computer can guess a code word",
    "Guess the code word based on a set of sentences that all contain it",
    "Rate sentences for how good they are",
    "Provide a new code word that is harder to guess than the existing one"
  ],
  required: true
}

var instructions_quiz_q2 = {
  prompt: "Where do the sentences come from?",
  options: [
    "They are ordinary sentences from books, newspapers, conversations, websites, etc.",
    "They are secret messages sent between operatives of the syndicate",
    "They only come from books",
    "They are written by agents in your agency"
  ],
  required: true
}

var instructions_quiz_q3 = {
  prompt: "Which statement about the code words is true?",
  options: [
    "There are two of them for each set of sentences",
    "They have been provided by a previous participant",
    "They are common English words",
    "They do not fit the sentences",
  ],
  required: true
}

var instructions_quiz = {
  type: jsPsychSurveyMultiChoice,
  data: {section: "instruction_check"},
  preamble: "<p>Before you begin, we have a couple of questions for you to make sure you understand the task.</p><p>If you get any of them wrong you'll have to read the instructions again.</p>",
  questions: [instructions_quiz_q1, instructions_quiz_q2, instructions_quiz_q3]
}

var instruction_quiz_failed = {
  type: jsPsychInstructions,
  data: {section: "instruction_check_failed"},
  pages: ['<p>Sorry, you got at least one of those questions wrong.</p><p>Please have another read of the instructions and try again.</p>'],
  show_clickable_nav: true,
  allow_backward: false,
  button_label_next: "Continue"
}

var instructions_quiz_check = {
  timeline: [instruction_quiz_failed],
  conditional_function: () => {
    var instruction_responses = jsPsych.data.get().last(1).values()[0].response;
    if (instruction_responses.Q0=="Guess the code word based on a set of sentences that all contain it" &&
      instruction_responses.Q1=="They are ordinary sentences from books, newspapers, conversations, websites, etc." &&
      instruction_responses.Q2 =="They are common English words") {
      return false;
    } else {
      return true;
    }
  }
}

var instruction_timeline = {
  timeline: [instructions, instructions_quiz, instructions_quiz_check],
  loop_function: data => {
    var last_trial_data = data.last(1).values()[0];
    return last_trial_data.section === "instruction_check_failed"
  }
}

/*
  PRACTICE==========================================================================
*/

// practice trial stimuli
var prac_tw = "bank";
var prac_sen_list = [
  "\"The prime minister cannot &#9608;&#9608;&#9608;&#9608;&#9608; on their support,\" said the reporter.",
  "The planes &#9608;&#9608;&#9608;&#9608;&#9608; slightly as they make their final approach to Turku Airport.",
  "We sat on the &#9608;&#9608;&#9608;&#9608;&#9608; of the river to watch the boats.",
  "Willows lined the &#9608;&#9608;&#9608;&#9608;&#9608; of the stream.",
  "Sorry I'm late, I was in line at the &#9608;&#9608;&#9608;&#9608;&#9608;.",
  "She went to the &#9608;&#9608;&#9608;&#9608;&#9608; to open an account and deposit some cash."
]


var practice_intro = {
  type: jsPsychInstructions,
  data: {section: "instructions"},
  pages: ["<p>Ok! Before starting the real task, you'll get a chance to have a practice run. Click 'continue' to do that now.</p><p>Each of the sentences will be revealed one at a time and you can make a guess after each one.</p><p>Remember, try your best to identify the code word as quickly as possible based on the sentences you see.</p>"],
  show_clickable_nav: true,
  allow_backward: false,
  button_label_next: "Continue"
}

var practice_guess = {
  type: jsPsychWordPred,
  text: function() {
    var curr_guess = jsPsych.timelineVariable("guess", true);
    return prac_sen_list.slice(0, curr_guess);
  },
  solution: prac_tw,
  guess: jsPsych.timelineVariable("guess"),
  practice: true,
  data: function() {
    var curr_guess = jsPsych.timelineVariable("guess", true);
    return {
      section: "practice_trial",
      trial_num: 0,
      targetWordCondition: "prac",
      target: prac_tw,
      guess: curr_guess, 
      //stimulus: sentw_exp[curr_tw][curr_guess-1]
    };
  },
  on_finish: function(data) {
    //check if last guess is correct
    if (data.correct == 1) {
      jsPsych.endCurrentTimeline();
    }
  }
}

var practice_trial = {
  timeline: [practice_guess],
  timeline_variables: guess_num
}

var practice_end = {
  type: jsPsychInstructions,
  data: {section: "instructions"},
  pages: () => {
    var prac_correct = jsPsych.data.get().filter({section: "practice_trial"}).select('correct').sum();
    var practice_end_correct = `Nice job! You cracked the code word, which was <strong>${prac_tw}</strong>.`;
    var practice_end_wrong = `Bad luck! You did not crack the code word, which was <strong>${prac_tw}</strong>.`;
    var practice_end_1 = `
    <div class="hangman-container">
      <img class="practice-screenshot" src="img/practice-screenshot.png">
      <p>${prac_correct==1 ? practice_end_correct : practice_end_wrong}</p>
      <p>Here you can see all 6 sentences you would have gotten. Notice how the code word fits into all of them.</p>
      <p>A few other things to note:</p>
      <ul class="practice-end">
        <li>The code words are all in lower case (i.e. don't worry about case)</li>
        <li>The blank text (&#9608;&#9608;&#9608;&#9608;&#9608;) does not indicate the number of letters in the code word</li>
      </ul>
    </div>
    `;
    var practice_end_2 = `
    <div class="hangman-container">
      <p>You are now ready to begin the real task.</p>
      <p>You have ${num_trials_total} code words to crack (remember that all of the code words are different).</p>
      <p>Some will be harder than others, and it's unlikely you'll manage to get them all, but do your best to crack as many as you can as quickly as possible.</p>
      <p>At the end of the task, you'll get to see how your score places compared to other people.</p>
      <p>Good luck!</p>
    </div>
    `;
    return [practice_end_1, practice_end_2];
  },
  show_clickable_nav: true,
  allow_backward: false,
  button_label_next: "Continue"
}

var practice = {
  timeline: [practice_intro, practice_trial, practice_end]
}

/*
  EXPERIMENT========================================================================
*/

//code for generating hints
var hintGen = {
  type: jsPsychCallFunction,
  data: {section: "hint_generating_function"},
  func: function() {
    // set the parameters for the current trial
    curr_trial_num = jsPsych.timelineVariable('trial_number', true);
    curr_tw = jsPsych.timelineVariable('target', true);
    curr_twc = jsPsych.timelineVariable('targetWordCondition', true);
    sen_list = sen_exp[curr_tw];
  }
}

//code for each guess
var guess = {
  type: jsPsychWordPred,
  text: function() {
    var curr_guess = jsPsych.timelineVariable("guess", true);
    return sen_list.slice(0, curr_guess);
  },
  solution: () => curr_tw,
  guess: jsPsych.timelineVariable("guess"),
  data: function() {
    var curr_guess = jsPsych.timelineVariable("guess", true);
    return {
      section: "test_trial",
      trial_num: curr_trial_num,
      targetWordCondition: curr_twc,
      target: curr_tw,
      guess: curr_guess, 
      stimulus: sentw_exp[curr_tw][curr_guess-1]
    };
  },
  on_finish: function(data) {
    //check if last guess is correct
    if (data.correct == 1) {
      jsPsych.endCurrentTimeline();
    }
  }
}

var trial = {
  timeline: [guess],
  timeline_variables: guess_num
}

var feedback = {
  type: jsPsychWordPredFeedback,
  solution: jsPsych.timelineVariable('target'),
  text: () => sen_list,
  data: {section: "test_feedback"},
  choices: ["Continue"],
  button_html: '<button class="jspsych-btn feedback-button">%choice%</button>'
}

var exp = {
  timeline: [hintGen, trial, feedback],
  timeline_variables: target_words
}

/*
  END==========================================================================
*/

var endscreen = {
  type: jsPsychInstructions,
  data: {section: "debrief"},
  on_start: function() {
    $.post('submit',{"content": jsPsych.data.get().csv()});
  },
  pages: () => {

    //score
    var final_score = jsPsych.data.get().filter({section: "test_trial"}).select('correct').sum();

    //percentile
    var percentiles_scores = [8,10,11,13,16,num_trials_total+1];
    var percentiles = [10,20,40,60,80,95];
    var final_percentile = percentiles[percentiles_scores.findIndex(n => final_score<n)];
    var final_percentile_text = `${final_percentile}%`

    var debrief_html = [`<div class="trial-container">
    <img src="img/debrief.png"></img>
    <p class='debrief debrief-score'>${final_score}</p>
    <p class='debrief debrief-percentile'>${final_percentile_text}</p>
    </div>
    <p>Press continue to exit fullscreen mode and see your completion code.</p>`];
    return debrief_html;
  },
  show_clickable_nav: true,
  allow_backward: false,
  button_label_next: "Continue"
}

var end_fullscreen = {
  type: jsPsychFullscreen,
  data: {section: "setup"},
  fullscreen_mode: false
}

var endexp = {
  timeline: [endscreen, end_fullscreen]
}


/*
  OVERALL TIMELINE=============================================================
*/

var timeline = [];
timeline.push(welcome);
timeline.push(instruction_timeline);
timeline.push(practice);
timeline.push(exp);
timeline.push(endexp);

jsPsych.data.addProperties({subject: subjectID});

jsPsych.run(timeline);