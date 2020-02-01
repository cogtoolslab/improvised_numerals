// Shapenet chairs stimuli 
// for Communication Task, Version 2.0 (refgame)
// https://github.com/cogtoolslab/graphical_conventions/blob/master/experiments/README.md

// December 31, 2018

// What's new:
// Added useSubmitButton flag in game.core.js
// When set to true, the Sketcher must click the Submit button when they are done 
// drawing for the Viewer to be able to see their drawing, so that the Viewer is not 
// able to interrupt the Sketcher's drawing.
// 30-second time limit in the speed bonus system still applies to the time taken 
// since the Sketcher begins drawing until the Viewer selects an object
// Minimize context variability & increase sampling density within context: 
// The same sets of 4 dining and 4 waiting items are used across pairs. 
// Assignment of repeated and control condition labels to each of these sets is 
// randomized across pairs. Thus approx. half of pairs will see dining repeatedly 
// (with waiting items as control), and half of pairs will see waiting repeatedly 
// (with dining as control).

// sebholt getting our different stimuli for the animals
// get rid of the stuff in game.core getRandomizedConditions that depends on 'subset', 'cluster', 'object', or 'pose' because we're not going to use it
var bears_1_0 = {filename: "1_0_bear.png" , basic: "bears" , subordinate: "bears_1" , subset:"A", object: 0, url: "https://iterated-number.s3.amazonaws.com/1_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bears_2_0 = {filename: "2_0_bear.png" , basic: "bears" , subordinate: "bears_2" , subset:"A", object: 1, url: "https://iterated-number.s3.amazonaws.com/2_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bears_3_0 = {filename: "3_0_bear.png" , basic: "bears" , subordinate: "bears_3" , subset:"A", object: 2, url: "https://iterated-number.s3.amazonaws.com/3_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bears_4_0 = {filename: "4_0_bear.png" , basic: "bears" , subordinate: "bears_4" , subset:"A", object: 3, url: "https://iterated-number.s3.amazonaws.com/4_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bears_5_0 = {filename: "5_0_bear.png" , basic: "bears" , subordinate: "bears_5" , subset:"A", object: 4, url: "https://iterated-number.s3.amazonaws.com/5_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bears_6_0 = {filename: "6_0_bear.png" , basic: "bears" , subordinate: "bears_6" , subset:"A", object: 5, url: "https://iterated-number.s3.amazonaws.com/6_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bears_7_0 = {filename: "7_0_bear.png" , basic: "bears" , subordinate: "bears_7" , subset:"B", object: 6, url: "https://iterated-number.s3.amazonaws.com/7_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bears_8_0 = {filename: "8_0_bear.png" , basic: "bears" , subordinate: "bears_8" , subset:"B", object: 7, url: "https://iterated-number.s3.amazonaws.com/8_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bears_9_0 = {filename: "9_0_bear.png" , basic: "bears" , subordinate: "bears_9" , subset:"B", object: 8, url: "https://iterated-number.s3.amazonaws.com/9_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bears_10_0 = {filename: "10_0_bear.png" , basic: "bears" , subordinate: "bears_10" , subset:"B", object: 9, url: "https://iterated-number.s3.amazonaws.com/10_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bears_11_0 = {filename: "11_0_bear.png" , basic: "bears" , subordinate: "bears_11" , subset:"B", object: 10, url: "https://iterated-number.s3.amazonaws.com/11_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bears_12_0 = {filename: "12_0_bear.png" , basic: "bears" , subordinate: "bears_12" , subset:"B", object: 11, url: "https://iterated-number.s3.amazonaws.com/12_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category

var deer_1_0 = {filename: "1_0_deer.png" , basic: "deer" , subordinate: "deer_1" , subset:"A", object: 0, url: "https://iterated-number.s3.amazonaws.com/1_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_2_0 = {filename: "2_0_deer.png" , basic: "deer" , subordinate: "deer_2" , subset:"A", object: 1, url: "https://iterated-number.s3.amazonaws.com/2_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_3_0 = {filename: "3_0_deer.png" , basic: "deer" , subordinate: "deer_3" , subset:"A", object: 2, url: "https://iterated-number.s3.amazonaws.com/3_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_4_0 = {filename: "4_0_deer.png" , basic: "deer" , subordinate: "deer_4" , subset:"A", object: 3, url: "https://iterated-number.s3.amazonaws.com/4_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_5_0 = {filename: "5_0_deer.png" , basic: "deer" , subordinate: "deer_5" , subset:"A", object: 4, url: "https://iterated-number.s3.amazonaws.com/5_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_6_0 = {filename: "6_0_deer.png" , basic: "deer" , subordinate: "deer_6" , subset:"A", object: 5, url: "https://iterated-number.s3.amazonaws.com/6_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_7_0 = {filename: "7_0_deer.png" , basic: "deer" , subordinate: "deer_7" , subset:"B", object: 6, url: "https://iterated-number.s3.amazonaws.com/7_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_8_0 = {filename: "8_0_deer.png" , basic: "deer" , subordinate: "deer_8" , subset:"B", object: 7, url: "https://iterated-number.s3.amazonaws.com/8_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_9_0 = {filename: "9_0_deer.png" , basic: "deer" , subordinate: "deer_9" , subset:"B", object: 8, url: "https://iterated-number.s3.amazonaws.com/9_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_10_0 = {filename: "10_0_deer.png" , basic: "deer" , subordinate: "deer_10" , subset:"B", object: 9, url: "https://iterated-number.s3.amazonaws.com/10_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_11_0 = {filename: "11_0_deer.png" , basic: "deer" , subordinate: "deer_11" , subset:"B", object: 10, url: "https://iterated-number.s3.amazonaws.com/11_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_12_0 = {filename: "12_0_deer.png" , basic: "deer" , subordinate: "deer_12" , subset:"B", object: 11, url: "https://iterated-number.s3.amazonaws.com/12_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category

var owls_1_0 = {filename: "1_0_owl.png" , basic: "owls" , subordinate: "owls_1" , url: "https://iterated-number.s3.amazonaws.com/1_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owls_2_0 = {filename: "2_0_owl.png" , basic: "owls" , subordinate: "owls_2" , url: "https://iterated-number.s3.amazonaws.com/2_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owls_3_0 = {filename: "3_0_owl.png" , basic: "owls" , subordinate: "owls_3" , url: "https://iterated-number.s3.amazonaws.com/3_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owls_4_0 = {filename: "4_0_owl.png" , basic: "owls" , subordinate: "owls_4" , url: "https://iterated-number.s3.amazonaws.com/4_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owls_5_0 = {filename: "5_0_owl.png" , basic: "owls" , subordinate: "owls_5" , url: "https://iterated-number.s3.amazonaws.com/5_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owls_6_0 = {filename: "6_0_owl.png" , basic: "owls" , subordinate: "owls_6" , url: "https://iterated-number.s3.amazonaws.com/6_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owls_7_0 = {filename: "7_0_owl.png" , basic: "owls" , subordinate: "owls_7" , url: "https://iterated-number.s3.amazonaws.com/7_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owls_8_0 = {filename: "8_0_owl.png" , basic: "owls" , subordinate: "owls_8" , url: "https://iterated-number.s3.amazonaws.com/8_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owls_9_0 = {filename: "9_0_owl.png" , basic: "owls" , subordinate: "owls_9" , url: "https://iterated-number.s3.amazonaws.com/9_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owls_10_0 = {filename: "10_0_owl.png" , basic: "owls" , subordinate: "owls_10" , url: "https://iterated-number.s3.amazonaws.com/10_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owls_11_0 = {filename: "11_0_owl.png" , basic: "owls" , subordinate: "owls_11" , url: "https://iterated-number.s3.amazonaws.com/11_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owls_12_0 = {filename: "12_0_owl.png" , basic: "owls" , subordinate: "owls_12" , url: "https://iterated-number.s3.amazonaws.com/12_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category

var rabbits_1_0 = {filename: "1_0_rabbit.png" , basic: "rabbits" , subordinate: "rabbits_1" , url: "https://iterated-number.s3.amazonaws.com/1_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var rabbits_2_0 = {filename: "2_0_rabbit.png" , basic: "rabbits" , subordinate: "rabbits_2" , url: "https://iterated-number.s3.amazonaws.com/2_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var rabbits_3_0 = {filename: "3_0_rabbit.png" , basic: "rabbits" , subordinate: "rabbits_3" , url: "https://iterated-number.s3.amazonaws.com/3_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var rabbits_4_0 = {filename: "4_0_rabbit.png" , basic: "rabbits" , subordinate: "rabbits_4" , url: "https://iterated-number.s3.amazonaws.com/4_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var rabbits_5_0 = {filename: "5_0_rabbit.png" , basic: "rabbits" , subordinate: "rabbits_5" , url: "https://iterated-number.s3.amazonaws.com/5_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var rabbits_6_0 = {filename: "6_0_rabbit.png" , basic: "rabbits" , subordinate: "rabbits_6" , url: "https://iterated-number.s3.amazonaws.com/6_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var rabbits_7_0 = {filename: "7_0_rabbit.png" , basic: "rabbits" , subordinate: "rabbits_7" , url: "https://iterated-number.s3.amazonaws.com/7_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var rabbits_8_0 = {filename: "8_0_rabbit.png" , basic: "rabbits" , subordinate: "rabbits_8" , url: "https://iterated-number.s3.amazonaws.com/8_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var rabbits_9_0 = {filename: "9_0_rabbit.png" , basic: "rabbits" , subordinate: "rabbits_9" , url: "https://iterated-number.s3.amazonaws.com/9_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var rabbits_10_0 = {filename: "10_0_rabbit.png" , basic: "rabbits" , subordinate: "rabbits_10" , url: "https://iterated-number.s3.amazonaws.com/10_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var rabbits_11_0 = {filename: "11_0_rabbit.png" , basic: "rabbits" , subordinate: "rabbits_11" , url: "https://iterated-number.s3.amazonaws.com/11_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var rabbits_12_0 = {filename: "12_0_rabbit.png" , basic: "rabbits" , subordinate: "rabbits_12" , url: "https://iterated-number.s3.amazonaws.com/12_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category

var squirrels_1_0 = {filename: "1_0_squirrel.png" , basic: "squirrels" , subordinate: "squirrels_1" , url: "https://iterated-number.s3.amazonaws.com/1_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var squirrels_2_0 = {filename: "2_0_squirrel.png" , basic: "squirrels" , subordinate: "squirrels_2" , url: "https://iterated-number.s3.amazonaws.com/2_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var squirrels_3_0 = {filename: "3_0_squirrel.png" , basic: "squirrels" , subordinate: "squirrels_3" , url: "https://iterated-number.s3.amazonaws.com/3_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var squirrels_4_0 = {filename: "4_0_squirrel.png" , basic: "squirrels" , subordinate: "squirrels_4" , url: "https://iterated-number.s3.amazonaws.com/4_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var squirrels_5_0 = {filename: "5_0_squirrel.png" , basic: "squirrels" , subordinate: "squirrels_5" , url: "https://iterated-number.s3.amazonaws.com/5_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var squirrels_6_0 = {filename: "6_0_squirrel.png" , basic: "squirrels" , subordinate: "squirrels_6" , url: "https://iterated-number.s3.amazonaws.com/6_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var squirrels_7_0 = {filename: "7_0_squirrel.png" , basic: "squirrels" , subordinate: "squirrels_7" , url: "https://iterated-number.s3.amazonaws.com/7_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var squirrels_8_0 = {filename: "8_0_squirrel.png" , basic: "squirrels" , subordinate: "squirrels_8" , url: "https://iterated-number.s3.amazonaws.com/8_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var squirrels_9_0 = {filename: "9_0_squirrel.png" , basic: "squirrels" , subordinate: "squirrels_9" , url: "https://iterated-number.s3.amazonaws.com/9_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var squirrel_10_0 = {filename: "10_0_squirrel.png" , basic: "squirrels" , subordinate: "squirrels_10" , url: "https://iterated-number.s3.amazonaws.com/10_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var squirrels_11_0 = {filename: "11_0_squirrel.png" , basic: "squirrels" , subordinate: "squirrels_11" , url: "https://iterated-number.s3.amazonaws.com/11_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var squirrels_12_0 = {filename: "12_0_squirrel.png" , basic: "squirrels" , subordinate: "squirrels_12" , url: "https://iterated-number.s3.amazonaws.com/12_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category

var wolves_1_0 = {filename: "1_0_wolf.png" , basic: "wolves" , subordinate: "wolves_1" , url: "https://iterated-number.s3.amazonaws.com/1_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var wolves_2_0 = {filename: "2_0_wolf.png" , basic: "wolves" , subordinate: "wolves_2" , url: "https://iterated-number.s3.amazonaws.com/2_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var wolves_3_0 = {filename: "3_0_wolf.png" , basic: "wolves" , subordinate: "wolves_3" , url: "https://iterated-number.s3.amazonaws.com/3_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var wolves_4_0 = {filename: "4_0_wolf.png" , basic: "wolves" , subordinate: "wolves_4" , url: "https://iterated-number.s3.amazonaws.com/4_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var wolves_5_0 = {filename: "5_0_wolf.png" , basic: "wolves" , subordinate: "wolves_5" , url: "https://iterated-number.s3.amazonaws.com/5_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var wolves_6_0 = {filename: "6_0_wolf.png" , basic: "wolves" , subordinate: "wolves_6" , url: "https://iterated-number.s3.amazonaws.com/6_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var wolves_7_0 = {filename: "7_0_wolf.png" , basic: "wolves" , subordinate: "wolves_7" , url: "https://iterated-number.s3.amazonaws.com/7_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var wolves_8_0 = {filename: "8_0_wolf.png" , basic: "wolves" , subordinate: "wolves_8" , url: "https://iterated-number.s3.amazonaws.com/8_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var wolves_9_0 = {filename: "9_0_wolf.png" , basic: "wolves" , subordinate: "wolves_9" , url: "https://iterated-number.s3.amazonaws.com/9_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var wolves_10_0 = {filename: "10_0_wolf.png" , basic: "wolves" , subordinate: "wolves_10" , url: "https://iterated-number.s3.amazonaws.com/10_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var wolves_11_0 = {filename: "11_0_wolf.png" , basic: "wolves" , subordinate: "wolves_11" , url: "https://iterated-number.s3.amazonaws.com/11_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var wolves_12_0 = {filename: "12_0_wolf.png" , basic: "wolves" , subordinate: "wolves_12" , url: "https://iterated-number.s3.amazonaws.com/12_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category

var stimList = [
  bears_1_0, bears_2_0, bears_3_0, bears_4_0, 
  bears_5_0, bears_6_0, bears_7_0, bears_8_0,
  //bears_9_0, bears_10_0, bears_11_0, bears_12_0,
  deer_1_0, deer_2_0, deer_3_0, deer_4_0, 
  deer_5_0, deer_6_0, deer_7_0, deer_8_0,
  //deer_9_0, deer_10_0, deer_11_0, deer_12_0
  owls_1_0, owls_2_0, owls_3_0, owls_4_0, 
  owls_5_0, owls_6_0, owls_7_0, owls_8_0
]

module.exports = stimList;
