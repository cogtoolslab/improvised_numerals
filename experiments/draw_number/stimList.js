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
// var bear_1_0 = {filename: "1_0_bear.png" , basic: "bear" , subordinate: "bear_1" , subset:"A", object: 0, url: "https://iterated-number.s3.amazonaws.com/1_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var bear_2_0 = {filename: "2_0_bear.png" , basic: "bear" , subordinate: "bear_2" , subset:"A", object: 1, url: "https://iterated-number.s3.amazonaws.com/2_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var bear_3_0 = {filename: "3_0_bear.png" , basic: "bear" , subordinate: "bear_3" , subset:"A", object: 2, url: "https://iterated-number.s3.amazonaws.com/3_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var bear_4_0 = {filename: "4_0_bear.png" , basic: "bear" , subordinate: "bear_4" , subset:"A", object: 3, url: "https://iterated-number.s3.amazonaws.com/4_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var bear_5_0 = {filename: "5_0_bear.png" , basic: "bear" , subordinate: "bear_5" , subset:"A", object: 4, url: "https://iterated-number.s3.amazonaws.com/5_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var bear_6_0 = {filename: "6_0_bear.png" , basic: "bear" , subordinate: "bear_6" , subset:"A", object: 5, url: "https://iterated-number.s3.amazonaws.com/6_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var bear_7_0 = {filename: "7_0_bear.png" , basic: "bear" , subordinate: "bear_7" , subset:"B", object: 6, url: "https://iterated-number.s3.amazonaws.com/7_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var bear_8_0 = {filename: "8_0_bear.png" , basic: "bear" , subordinate: "bear_8" , subset:"B", object: 7, url: "https://iterated-number.s3.amazonaws.com/8_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var bear_9_0 = {filename: "9_0_bear.png" , basic: "bear" , subordinate: "bear_9" , subset:"B", object: 8, url: "https://iterated-number.s3.amazonaws.com/9_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var bear_10_0 = {filename: "10_0_bear.png" , basic: "bear" , subordinate: "bear_10" , subset:"B", object: 9, url: "https://iterated-number.s3.amazonaws.com/10_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var bear_11_0 = {filename: "11_0_bear.png" , basic: "bear" , subordinate: "bear_11" , subset:"B", object: 10, url: "https://iterated-number.s3.amazonaws.com/11_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var bear_12_0 = {filename: "12_0_bear.png" , basic: "bear" , subordinate: "bear_12" , subset:"B", object: 11, url: "https://iterated-number.s3.amazonaws.com/12_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category

// var deer_1_0 = {filename: "1_0_deer.png" , basic: "deer" , subordinate: "deer_1" , subset:"A", object: 0, url: "https://iterated-number.s3.amazonaws.com/1_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var deer_2_0 = {filename: "2_0_deer.png" , basic: "deer" , subordinate: "deer_2" , subset:"A", object: 1, url: "https://iterated-number.s3.amazonaws.com/2_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var deer_3_0 = {filename: "3_0_deer.png" , basic: "deer" , subordinate: "deer_3" , subset:"A", object: 2, url: "https://iterated-number.s3.amazonaws.com/3_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var deer_4_0 = {filename: "4_0_deer.png" , basic: "deer" , subordinate: "deer_4" , subset:"A", object: 3, url: "https://iterated-number.s3.amazonaws.com/4_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var deer_5_0 = {filename: "5_0_deer.png" , basic: "deer" , subordinate: "deer_5" , subset:"A", object: 4, url: "https://iterated-number.s3.amazonaws.com/5_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var deer_6_0 = {filename: "6_0_deer.png" , basic: "deer" , subordinate: "deer_6" , subset:"A", object: 5, url: "https://iterated-number.s3.amazonaws.com/6_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var deer_7_0 = {filename: "7_0_deer.png" , basic: "deer" , subordinate: "deer_7" , subset:"B", object: 6, url: "https://iterated-number.s3.amazonaws.com/7_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var deer_8_0 = {filename: "8_0_deer.png" , basic: "deer" , subordinate: "deer_8" , subset:"B", object: 7, url: "https://iterated-number.s3.amazonaws.com/8_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var deer_9_0 = {filename: "9_0_deer.png" , basic: "deer" , subordinate: "deer_9" , subset:"B", object: 8, url: "https://iterated-number.s3.amazonaws.com/9_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var deer_10_0 = {filename: "10_0_deer.png" , basic: "deer" , subordinate: "deer_10" , subset:"B", object: 9, url: "https://iterated-number.s3.amazonaws.com/10_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var deer_11_0 = {filename: "11_0_deer.png" , basic: "deer" , subordinate: "deer_11" , subset:"B", object: 10, url: "https://iterated-number.s3.amazonaws.com/11_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var deer_12_0 = {filename: "12_0_deer.png" , basic: "deer" , subordinate: "deer_12" , subset:"B", object: 11, url: "https://iterated-number.s3.amazonaws.com/12_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category

// var owl_1_0 = {filename: "1_0_owl.png" , basic: "owl" , subordinate: "owl_1" , subset:"A", object: 0, url: "https://iterated-number.s3.amazonaws.com/1_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var owl_2_0 = {filename: "2_0_owl.png" , basic: "owl" , subordinate: "owl_2" , subset:"A", object: 1, url: "https://iterated-number.s3.amazonaws.com/2_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var owl_3_0 = {filename: "3_0_owl.png" , basic: "owl" , subordinate: "owl_3" , subset:"A", object: 2, url: "https://iterated-number.s3.amazonaws.com/3_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var owl_4_0 = {filename: "4_0_owl.png" , basic: "owl" , subordinate: "owl_4" , subset:"A", object: 3, url: "https://iterated-number.s3.amazonaws.com/4_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var owl_5_0 = {filename: "5_0_owl.png" , basic: "owl" , subordinate: "owl_5" , subset:"A", object: 4, url: "https://iterated-number.s3.amazonaws.com/5_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var owl_6_0 = {filename: "6_0_owl.png" , basic: "owl" , subordinate: "owl_6" , subset:"A", object: 5, url: "https://iterated-number.s3.amazonaws.com/6_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var owl_7_0 = {filename: "7_0_owl.png" , basic: "owl" , subordinate: "owl_7" , subset:"B", object: 6, url: "https://iterated-number.s3.amazonaws.com/7_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var owl_8_0 = {filename: "8_0_owl.png" , basic: "owl" , subordinate: "owl_8" , subset:"B", object: 7, url: "https://iterated-number.s3.amazonaws.com/8_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var owl_9_0 = {filename: "9_0_owl.png" , basic: "owl" , subordinate: "owl_9" , subset:"B", object: 8, url: "https://iterated-number.s3.amazonaws.com/9_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var owl_10_0 = {filename: "10_0_owl.png" , basic: "owl" , subordinate: "owl_10" , subset:"B", object: 9, url: "https://iterated-number.s3.amazonaws.com/10_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var owl_11_0 = {filename: "11_0_owl.png" , basic: "owl" , subordinate: "owl_11" , subset:"B", object: 10, url: "https://iterated-number.s3.amazonaws.com/11_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var owl_12_0 = {filename: "12_0_owl.png" , basic: "owl" , subordinate: "owl_12" , subset:"B", object: 11, url: "https://iterated-number.s3.amazonaws.com/12_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category

// var rabbit_1_0 = {filename: "1_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_1" , subset:"A", object: 0, url: "https://iterated-number.s3.amazonaws.com/1_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var rabbit_2_0 = {filename: "2_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_2" , subset:"A", object: 1, url: "https://iterated-number.s3.amazonaws.com/2_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var rabbit_3_0 = {filename: "3_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_3" , subset:"A", object: 2, url: "https://iterated-number.s3.amazonaws.com/3_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var rabbit_4_0 = {filename: "4_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_4" , subset:"A", object: 3, url: "https://iterated-number.s3.amazonaws.com/4_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var rabbit_5_0 = {filename: "5_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_5" , subset:"A", object: 4, url: "https://iterated-number.s3.amazonaws.com/5_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var rabbit_6_0 = {filename: "6_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_6" , subset:"A", object: 5, url: "https://iterated-number.s3.amazonaws.com/6_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var rabbit_7_0 = {filename: "7_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_7" , subset:"B", object: 6, url: "https://iterated-number.s3.amazonaws.com/7_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var rabbit_8_0 = {filename: "8_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_8" , subset:"B", object: 7, url: "https://iterated-number.s3.amazonaws.com/8_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var rabbit_9_0 = {filename: "9_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_9" , subset:"B", object: 8, url: "https://iterated-number.s3.amazonaws.com/9_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var rabbit_10_0 = {filename: "10_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_10" , subset:"B", object: 9, url: "https://iterated-number.s3.amazonaws.com/10_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var rabbit_11_0 = {filename: "11_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_11" , subset:"B", object: 10, url: "https://iterated-number.s3.amazonaws.com/11_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var rabbit_12_0 = {filename: "12_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_12" , subset:"B", object: 11, url: "https://iterated-number.s3.amazonaws.com/12_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category

// var squirrel_1_0 = {filename: "1_0_squirrel.png" , basic: "squirrel" , subordinate: "squirrel_1" , subset:"A", object: 0, url: "https://iterated-number.s3.amazonaws.com/1_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var squirrel_2_0 = {filename: "2_0_squirrel.png" , basic: "squirrel" , subordinate: "squirrel_2" , subset:"A", object: 1, url: "https://iterated-number.s3.amazonaws.com/2_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var squirrel_3_0 = {filename: "3_0_squirrel.png" , basic: "squirrel" , subordinate: "squirrel_3" , subset:"A", object: 2, url: "https://iterated-number.s3.amazonaws.com/3_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var squirrel_4_0 = {filename: "4_0_squirrel.png" , basic: "squirrel" , subordinate: "squirrel_4" , subset:"A", object: 3, url: "https://iterated-number.s3.amazonaws.com/4_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var squirrel_5_0 = {filename: "5_0_squirrel.png" , basic: "squirrel" , subordinate: "squirrel_5" , subset:"A", object: 4, url: "https://iterated-number.s3.amazonaws.com/5_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var squirrel_6_0 = {filename: "6_0_squirrel.png" , basic: "squirrel" , subordinate: "squirrel_6" , subset:"A", object: 5, url: "https://iterated-number.s3.amazonaws.com/6_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var squirrel_7_0 = {filename: "7_0_squirrel.png" , basic: "squirrel" , subordinate: "squirrel_7" , subset:"B", object: 6, url: "https://iterated-number.s3.amazonaws.com/7_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var squirrel_8_0 = {filename: "8_0_squirrel.png" , basic: "squirrel" , subordinate: "squirrel_8" , subset:"B", object: 7, url: "https://iterated-number.s3.amazonaws.com/8_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var squirrel_9_0 = {filename: "9_0_squirrel.png" , basic: "squirrel" , subordinate: "squirrel_9" , subset:"B", object: 8, url: "https://iterated-number.s3.amazonaws.com/9_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var squirrel_10_0 = {filename: "10_0_squirrel.png" , basic: "squirrel" , subordinate: "squirrel_10" , subset:"B", object: 9, url: "https://iterated-number.s3.amazonaws.com/10_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var squirrel_11_0 = {filename: "11_0_squirrel.png" , basic: "squirrel" , subordinate: "squirrel_11" , subset:"B", object: 10, url: "https://iterated-number.s3.amazonaws.com/11_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var squirrel_12_0 = {filename: "12_0_squirrel.png" , basic: "squirrel" , subordinate: "squirrel_12" , subset:"B", object: 11, url: "https://iterated-number.s3.amazonaws.com/12_0_squirrel.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category

// var wolf_1_0 = {filename: "1_0_wolf.png" , basic: "wolf" , subordinate: "wolf_1" , subset:"A", object: 0, url: "https://iterated-number.s3.amazonaws.com/1_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var wolf_2_0 = {filename: "2_0_wolf.png" , basic: "wolf" , subordinate: "wolf_2" , subset:"A", object: 1, url: "https://iterated-number.s3.amazonaws.com/2_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var wolf_3_0 = {filename: "3_0_wolf.png" , basic: "wolf" , subordinate: "wolf_3" , subset:"A", object: 2, url: "https://iterated-number.s3.amazonaws.com/3_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var wolf_4_0 = {filename: "4_0_wolf.png" , basic: "wolf" , subordinate: "wolf_4" , subset:"A", object: 3, url: "https://iterated-number.s3.amazonaws.com/4_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var wolf_5_0 = {filename: "5_0_wolf.png" , basic: "wolf" , subordinate: "wolf_5" , subset:"A", object: 4, url: "https://iterated-number.s3.amazonaws.com/5_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var wolf_6_0 = {filename: "6_0_wolf.png" , basic: "wolf" , subordinate: "wolf_6" , subset:"A", object: 5, url: "https://iterated-number.s3.amazonaws.com/6_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var wolf_7_0 = {filename: "7_0_wolf.png" , basic: "wolf" , subordinate: "wolf_7" , subset:"B", object: 6, url: "https://iterated-number.s3.amazonaws.com/7_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var wolf_8_0 = {filename: "8_0_wolf.png" , basic: "wolf" , subordinate: "wolf_8" , subset:"B", object: 7, url: "https://iterated-number.s3.amazonaws.com/8_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var wolf_9_0 = {filename: "9_0_wolf.png" , basic: "wolf" , subordinate: "wolf_9" , subset:"B", object: 8, url: "https://iterated-number.s3.amazonaws.com/9_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var wolf_10_0 = {filename: "10_0_wolf.png" , basic: "wolf" , subordinate: "wolf_10" , subset:"B", object: 9, url: "https://iterated-number.s3.amazonaws.com/10_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var wolf_11_0 = {filename: "11_0_wolf.png" , basic: "wolf" , subordinate: "wolf_11" , subset:"B", object: 10, url: "https://iterated-number.s3.amazonaws.com/11_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
// var wolf_12_0 = {filename: "12_0_wolf.png" , basic: "wolf" , subordinate: "wolf_12" , subset:"B", object: 11, url: "https://iterated-number.s3.amazonaws.com/12_0_wolf.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category






// new, locally stored, stimulus set:
var bear_1_0 = {filename: "1_0_bear.png" , basic: "bear" , subordinate: "bear_1" , subset:"A", object: 0, url: "https://iterated-number.s3.amazonaws.com/1_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bear_2_0 = {filename: "2_0_bear.png" , basic: "bear" , subordinate: "bear_2" , subset:"A", object: 1, url: "https://iterated-number.s3.amazonaws.com/2_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bear_3_0 = {filename: "3_0_bear.png" , basic: "bear" , subordinate: "bear_3" , subset:"A", object: 2, url: "https://iterated-number.s3.amazonaws.com/3_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bear_4_0 = {filename: "4_0_bear.png" , basic: "bear" , subordinate: "bear_4" , subset:"A", object: 3, url: "https://iterated-number.s3.amazonaws.com/4_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bear_5_0 = {filename: "5_0_bear.png" , basic: "bear" , subordinate: "bear_5" , subset:"A", object: 4, url: "https://iterated-number.s3.amazonaws.com/5_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bear_6_0 = {filename: "6_0_bear.png" , basic: "bear" , subordinate: "bear_6" , subset:"A", object: 5, url: "https://iterated-number.s3.amazonaws.com/6_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bear_7_0 = {filename: "7_0_bear.png" , basic: "bear" , subordinate: "bear_7" , subset:"B", object: 6, url: "https://iterated-number.s3.amazonaws.com/7_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bear_8_0 = {filename: "8_0_bear.png" , basic: "bear" , subordinate: "bear_8" , subset:"B", object: 7, url: "https://iterated-number.s3.amazonaws.com/8_0_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category

var deer_1_0 = {filename: "1_0_deer.png" , basic: "deer" , subordinate: "deer_1" , subset:"A", object: 0, url: "https://iterated-number.s3.amazonaws.com/1_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_2_0 = {filename: "2_0_deer.png" , basic: "deer" , subordinate: "deer_2" , subset:"A", object: 1, url: "https://iterated-number.s3.amazonaws.com/2_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_3_0 = {filename: "3_0_deer.png" , basic: "deer" , subordinate: "deer_3" , subset:"A", object: 2, url: "https://iterated-number.s3.amazonaws.com/3_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_4_0 = {filename: "4_0_deer.png" , basic: "deer" , subordinate: "deer_4" , subset:"A", object: 3, url: "https://iterated-number.s3.amazonaws.com/4_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_5_0 = {filename: "5_0_deer.png" , basic: "deer" , subordinate: "deer_5" , subset:"A", object: 4, url: "https://iterated-number.s3.amazonaws.com/5_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_6_0 = {filename: "6_0_deer.png" , basic: "deer" , subordinate: "deer_6" , subset:"A", object: 5, url: "https://iterated-number.s3.amazonaws.com/6_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_7_0 = {filename: "7_0_deer.png" , basic: "deer" , subordinate: "deer_7" , subset:"B", object: 6, url: "https://iterated-number.s3.amazonaws.com/7_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_8_0 = {filename: "8_0_deer.png" , basic: "deer" , subordinate: "deer_8" , subset:"B", object: 7, url: "https://iterated-number.s3.amazonaws.com/8_0_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category

var owl_1_0 = {filename: "1_0_owl.png" , basic: "owl" , subordinate: "owl_1" , subset:"A", object: 0, url: "https://iterated-number.s3.amazonaws.com/1_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owl_2_0 = {filename: "2_0_owl.png" , basic: "owl" , subordinate: "owl_2" , subset:"A", object: 1, url: "https://iterated-number.s3.amazonaws.com/2_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owl_3_0 = {filename: "3_0_owl.png" , basic: "owl" , subordinate: "owl_3" , subset:"A", object: 2, url: "https://iterated-number.s3.amazonaws.com/3_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owl_4_0 = {filename: "4_0_owl.png" , basic: "owl" , subordinate: "owl_4" , subset:"A", object: 3, url: "https://iterated-number.s3.amazonaws.com/4_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owl_5_0 = {filename: "5_0_owl.png" , basic: "owl" , subordinate: "owl_5" , subset:"A", object: 4, url: "https://iterated-number.s3.amazonaws.com/5_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owl_6_0 = {filename: "6_0_owl.png" , basic: "owl" , subordinate: "owl_6" , subset:"A", object: 5, url: "https://iterated-number.s3.amazonaws.com/6_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owl_7_0 = {filename: "7_0_owl.png" , basic: "owl" , subordinate: "owl_7" , subset:"B", object: 6, url: "https://iterated-number.s3.amazonaws.com/7_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owl_8_0 = {filename: "8_0_owl.png" , basic: "owl" , subordinate: "owl_8" , subset:"B", object: 7, url: "https://iterated-number.s3.amazonaws.com/8_0_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category

var rabbit_1_0 = {filename: "1_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_1" , subset:"A", object: 0, url: "https://iterated-number.s3.amazonaws.com/1_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var rabbit_2_0 = {filename: "2_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_2" , subset:"A", object: 1, url: "https://iterated-number.s3.amazonaws.com/2_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var rabbit_3_0 = {filename: "3_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_3" , subset:"A", object: 2, url: "https://iterated-number.s3.amazonaws.com/3_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var rabbit_4_0 = {filename: "4_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_4" , subset:"A", object: 3, url: "https://iterated-number.s3.amazonaws.com/4_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var rabbit_5_0 = {filename: "5_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_5" , subset:"A", object: 4, url: "https://iterated-number.s3.amazonaws.com/5_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var rabbit_6_0 = {filename: "6_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_6" , subset:"A", object: 5, url: "https://iterated-number.s3.amazonaws.com/6_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var rabbit_7_0 = {filename: "7_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_7" , subset:"B", object: 6, url: "https://iterated-number.s3.amazonaws.com/7_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var rabbit_8_0 = {filename: "8_0_rabbit.png" , basic: "rabbit" , subordinate: "rabbit_8" , subset:"B", object: 7, url: "https://iterated-number.s3.amazonaws.com/8_0_rabbit.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category



// set v2

var bear_1_1 = {filename: "1_1_bear.png" , basic: "bear" , subordinate: "bear_1" , subset:"A", object: 0, url: "stimuli/v1/1_1_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bear_2_1 = {filename: "2_1_bear.png" , basic: "bear" , subordinate: "bear_2" , subset:"A", object: 1, url: "stimuli/v1/2_1_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bear_3_1 = {filename: "3_1_bear.png" , basic: "bear" , subordinate: "bear_3" , subset:"A", object: 2, url: "stimuli/v1/3_1_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bear_4_1 = {filename: "4_1_bear.png" , basic: "bear" , subordinate: "bear_4" , subset:"A", object: 3, url: "stimuli/v1/4_1_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bear_5_1 = {filename: "5_1_bear.png" , basic: "bear" , subordinate: "bear_5" , subset:"A", object: 4, url: "stimuli/v1/5_1_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bear_6_1 = {filename: "6_1_bear.png" , basic: "bear" , subordinate: "bear_6" , subset:"A", object: 5, url: "stimuli/v1/6_1_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bear_7_1 = {filename: "7_1_bear.png" , basic: "bear" , subordinate: "bear_7" , subset:"B", object: 6, url: "stimuli/v1/7_1_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var bear_8_1 = {filename: "8_1_bear.png" , basic: "bear" , subordinate: "bear_8" , subset:"B", object: 7, url: "stimuli/v1/8_1_bear.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category

var deer_1_1 = {filename: "1_1_deer.png" , basic: "deer" , subordinate: "deer_1" , subset:"A", object: 0, url: "stimuli/v1/1_1_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_2_1 = {filename: "2_1_deer.png" , basic: "deer" , subordinate: "deer_2" , subset:"A", object: 1, url: "stimuli/v1/2_1_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_3_1 = {filename: "3_1_deer.png" , basic: "deer" , subordinate: "deer_3" , subset:"A", object: 2, url: "stimuli/v1/3_1_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_4_1 = {filename: "4_1_deer.png" , basic: "deer" , subordinate: "deer_4" , subset:"A", object: 3, url: "stimuli/v1/4_1_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_5_1 = {filename: "5_1_deer.png" , basic: "deer" , subordinate: "deer_5" , subset:"A", object: 4, url: "stimuli/v1/5_1_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_6_1 = {filename: "6_1_deer.png" , basic: "deer" , subordinate: "deer_6" , subset:"A", object: 5, url: "stimuli/v1/6_1_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_7_1 = {filename: "7_1_deer.png" , basic: "deer" , subordinate: "deer_7" , subset:"B", object: 6, url: "stimuli/v1/7_1_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var deer_8_1 = {filename: "8_1_deer.png" , basic: "deer" , subordinate: "deer_8" , subset:"B", object: 7, url: "stimuli/v1/8_1_deer.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category

var owl_1_1 = {filename: "1_1_owl.png" , basic: "owl" , subordinate: "owl_1" , subset:"A", object: 0, url: "stimuli/v1/1_1_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owl_2_1 = {filename: "2_1_owl.png" , basic: "owl" , subordinate: "owl_2" , subset:"A", object: 1, url: "stimuli/v1/2_1_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owl_3_1 = {filename: "3_1_owl.png" , basic: "owl" , subordinate: "owl_3" , subset:"A", object: 2, url: "stimuli/v1/3_1_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owl_4_1 = {filename: "4_1_owl.png" , basic: "owl" , subordinate: "owl_4" , subset:"A", object: 3, url: "stimuli/v1/4_1_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owl_5_1 = {filename: "5_1_owl.png" , basic: "owl" , subordinate: "owl_5" , subset:"A", object: 4, url: "stimuli/v1/5_1_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owl_6_1 = {filename: "6_1_owl.png" , basic: "owl" , subordinate: "owl_6" , subset:"A", object: 5, url: "stimuli/v1/6_1_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owl_7_1 = {filename: "7_1_owl.png" , basic: "owl" , subordinate: "owl_7" , subset:"B", object: 6, url: "stimuli/v1/7_1_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category
var owl_8_1 = {filename: "8_1_owl.png" , basic: "owl" , subordinate: "owl_8" , subset:"B", object: 7, url: "stimuli/v1/8_1_owl.png" , width: 256, height: 256} // 'basic' means 'basic level', i.e. category




// var stimListv2 = [
//   bear_1_1, bear_2_1, bear_3_1, bear_4_1, 
//   bear_5_1, bear_6_1, bear_7_1, bear_8_1,

//   deer_1_1, deer_2_1, deer_3_1, deer_4_1, 
//   deer_5_1, deer_6_1, deer_7_1, deer_8_1,

//   owl_1_1, owl_2_1, owl_3_1, owl_4_1, 
//   owl_5_1, owl_6_1, owl_7_1, owl_8_1,

// ]

var stimList = [
  bear_1_0, bear_2_0, bear_3_0, bear_4_0, 
  bear_5_0, bear_6_0, bear_7_0, bear_8_0,
  // bear_9_0, bear_10_0, bear_11_0, bear_12_0,

  deer_1_0, deer_2_0, deer_3_0, deer_4_0, 
  deer_5_0, deer_6_0, deer_7_0, deer_8_0,
  // deer_9_0, deer_10_0, deer_11_0, deer_12_0,

  owl_1_0, owl_2_0, owl_3_0, owl_4_0, 
  owl_5_0, owl_6_0, owl_7_0, owl_8_0,
  // owl_9_0, owl_10_0, owl_11_0, owl_12_0,

  rabbit_1_0, rabbit_2_0, rabbit_3_0, rabbit_4_0,
  rabbit_5_0, rabbit_6_0, rabbit_7_0, rabbit_8_0,
  // rabbit_9_0, rabbit_10_0, rabbit_11_0, rabbit_12_0,

  // squirrel_1_0, squirrel_2_0, squirrel_3_0, squirrel_4_0,
  // squirrel_5_0, squirrel_6_0, squirrel_7_0, squirrel_8_0,
  // squirrel_9_0, squirrel_10_0, squirrel_11_0, squirrel_12_0,

  // wolf_1_0, wolf_2_0, wolf_3_0, wolf_4_0,
  // wolf_5_0, wolf_6_0, wolf_7_0, wolf_8_0,
  // wolf_9_0, wolf_10_0, wolf_11_0, wolf_12_0
]

module.exports = {stimList};
