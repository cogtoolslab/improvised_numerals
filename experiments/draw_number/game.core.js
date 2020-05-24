/*  Copyright (c) 2012 Sven "FuzzYspo0N" Bergström,
                  2013 Robert XD Hawkins
 written by : http://underscorediscovery.com
    written for : http://buildnewgames.com/real-time-multiplayer/
    substantially modified for collective behavior experiments on the web
    MIT Licensed.
*/

/*
  The main game class. This gets created on both server and
  client. Server creates one for each game that is hosted, and each
  client creates one for itself to play the game. When you set a
  variable, remember that it's only set in that instance.
*/
var has_require = typeof require !== 'undefined';

if( typeof _ === 'undefined' ) {
  if( has_require ) {
    _ = require('lodash');
    utils  = require(__base + 'utils/sharedUtils.js');
  }
  else throw 'mymodule requires underscore, see http://underscorejs.org';
}

var game_core = function(options){
  // Store a flag if we are the server instance
  this.server = options.server ;
  this.projectName = 'iterated_number';
  this.experimentName = 'num8_shape4';
  this.iterationName = 'sandbox3';
  this.email = 'ladlab.ucsd@gmail.com';
  // console.log("color randomized");

  // save data to the following locations (allowed: 'csv', 'mongo')
  this.dataStore = ['csv', 'mongo'];

  // which condition are we going to use for this game?
  this.game_condition = _.sample(['shape','number','number','number','number']); // need to actually set condition somewhere at the beginning of game, right? Or just keep in manual
  console.log("CONDITION : ", this.game_condition)
  this.anonymizeCSV = true;

  // How many players in the game?
  this.players_threshold = 2;
  this.playerRoleNames = {
    role1 : 'sketcher',
    role2 : 'viewer'
  };

  // How many objects do we have in a context?
  this.setSize = 4; // many things depend on this
  // console.log("actual setSize:" + this.setSize);

  //Dimensions of world in pixels and number of cells to be divided into;
  this.numHorizontalCells = this.setSize;
  this.numVerticalCells = 1;
  // if set size is anything larger than 4 (assuming we don't choose anything smaller than 4)
  // use 150 as our default cell size
  if (this.setSize == 4) {
    this.cellDimensions = {height : 200, width : 200};
  } else {
    this.cellDimensions = {height : 150, width : 150};
  }
  this.cellPadding = 0;
  this.world = {height : (this.cellDimensions.height * this.numVerticalCells
              + this.cellPadding),
              width : (this.cellDimensions.width * this.numHorizontalCells
              + this.cellPadding)};


  // track shift key drawing tool use
  this.shiftKeyUsed = 0; // "1" on trials where used, "0" otherwise

  // Which stroke number are we on?
  this.currStrokeNum = 0;

  // Has the sketcher drawn anything?
  this.strokeMade = false;

  // Is the sketcher done with their drawing?
  this.doneDrawing = false;

  // Is the sketcher allowed to draw?
  this.drawingAllowed = false;

  // time (in ms) to wait before giving feedback
  this.feedbackDelay = 300;

  // how long the sketcher has to finish their drawing
  this.timeLimit = 30;

  // toggle whether an object has been clicked
  this.objClicked = false;

  // Which round (a.k.a. "trial") are we on (initialize at -1 so that first round is 0-indexed)
  this.roundNum = -1;

  // How many repetitions do we want?
  if (this.setSize == 4) {
    this.numReps = 6;
  } else {
    this.numReps = 4;
  }

  // How many rounds do we want people to complete?
  if (this.setSize == 4) {
    this.numRounds = 32; // sebholt edit; changed 40 to 24 to 32
  } else {
    this.numRounds = 48;
  }
  // should we fix the pose to 3/4 view across trials and games?
  this.poseFixed = 1;

  // How many objects per round (how many items in the menu)?
  this.numItemsPerRound = this.numHorizontalCells*this.numVerticalCells;

  // Items x Rounds?
  this.numItemsxRounds = this.numItemsPerRound*this.numRounds;

  // This will be populated with the set of objects
  this.trialInfo = {};

  // Progress bar timer
  this.timer;

  // Most recent start stroke time
  this.startStrokeTime = Date.now();

  // Most recent end stroke time
  this.endStrokeTime = Date.now();

  // Using different categories for the conditions?
  this.diffCats = true; // set to true if we want repeated and control to come from different clusters

  // Is the sketcher ready to move on?
  this.sketcherReady = false;

  // Is the viewer ready to move on?
  this.viewerReady = false;

  // Use submit button
  this.useSubmitButton = true;

  if(this.server) {
    console.log('sent server update bc satisfied this.server')
    // If we're initializing the server game copy, pre-create the list of trials
    // we'll use, make a player object, and tell the player who they are
    this.stimList = _.map(require('./stimList', _.clone))[0];
    this.id = options.id;
    this.expName = options.expName;
    this.player_count = options.player_count;
    this.trialList = this.makeTrialList();

    this.data = {
      id : this.id,
      trials : [],
      catch_trials : [], system : {},
      subject_information : {
	    gameID: this.id,
	    score: 0,
      bonus_score: 0
      }
    };
    this.players = [{
      id: options.player_instances[0].id,
      instance: options.player_instances[0].player,
      player: new game_player(this,options.player_instances[0].player)
    }];
    this.streams = {};
    this.server_send_update();
  } else {
    // If we're initializing a player's local game copy, create the player object
    this.players = [{
      id: null,
      instance: null,
      player: new game_player(this)
    }];
  }
};

var game_player = function( game_instance, player_instance) {
  this.instance = player_instance;
  this.game = game_instance;
  this.role = '';
  this.message = '';
  this.id = '';
};

// server side we set some classes to global types, so that
// we can use them in other files (specifically, game.server.js)
if('undefined' != typeof global) {  
  module.exports = {game_core, game_player};
}

// HELPER FUNCTIONS

// Method to easily look up player
game_core.prototype.get_player = function(id) {
  var result = _.find(this.players, function(e){ return e.id == id; });
  return result.player;
};

// Method to get list of players that aren't the given id
game_core.prototype.get_others = function(id) {
  var otherPlayersList = _.filter(this.players, function(e){ return e.id != id; });
  var noEmptiesList = _.map(otherPlayersList, function(p){return p.player ? p : null;});
  return _.without(noEmptiesList, null);
};

// Returns all players
game_core.prototype.get_active_players = function() {
  var noEmptiesList = _.map(this.players, function(p){return p.player ? p : null;});
  return _.without(noEmptiesList, null);
};

// Advance to the next round
game_core.prototype.newRound = function() {
  
  //console.log("calling gc.newRound() in game core");
  // If you've reached the planned number of rounds, end the game
  if(this.roundNum == this.numRounds - 1) {
    _.map(this.get_active_players(), function(p){
      p.player.instance.disconnect();});
  } 
  else {
    // sebholt edit begin (to switch roles)
    // _.map(this.get_active_players(), function(p){
    //   if(p.player.instance.role === 'sketcher'){
    //     p.player.instance.role = 'viewer'
    //   } else if(p.player.instance.role === 'viewer'){
    //     p.player.instance.role = 'sketcher'
    //   }
    //   console.log(p.player.instance.role);});
    // sebholt edit end
        
    // console.log('got to newRound in game.core.js and not the final round');
    // Otherwise, get the preset list of objects for the new round
    this.roundNum += 1;
    this.trialInfo = {currStim: this.trialList[this.roundNum]};
    //console.log("this.trialList[this.roundNum]: " + this.trialList[this.roundNum]);
    this.objects = this.trialList[this.roundNum];
    //console.log("objects HERE:", this.objects) // sebholt print statement DELETE SOON
    this.objClicked = false;
    active_players = this.get_active_players();
    this.setupTimer(this.timeLimit,active_players);
    this.server_send_update();
  }
};

// Set up timer function on each new round
game_core.prototype.setupTimer = function(timeleft, active_players) {
  this.timeleft = timeleft;
  var that = this;
  if (timeleft >= 0 && !(this.objClicked)) {
    _.map(active_players, function(p){
      p.player.instance.emit('updateTimer', timeleft);
    });
    this.timer = setTimeout(function(){
      that.setupTimer(timeleft - 1,active_players);
    }, 1000);
  } else {
    clearTimeout(this.timer);
    console.log("calling timeOut")
    _.map(active_players, function(p){
      p.player.instance.emit('timeOut', timeleft);
    });
  }
}

// game_core.prototype.getRandomizedConditions = function() {
//   var numCats = 2;
//   var numObjs = this.setSize * 2; // sebholt edit. What is now 3 was 2
//   var setSize = this.setSize; // this is the number of objects that appear in a single menu // changed from 4
//   //console.log("setsize in getRandomizedConditions: " + this.setSize);
//   // make category array
//   var repeatedColor = _.sample(["#ce0a04", "#4286f4"]); // randomly assign border color (red or blue) to repeated and control
//   var repeatedCat = "bear";
//   var controlCat = "deer";

//   var shuffledObjs = _.shuffle(_.range(0,numObjs));
//   var repeatedObjs = shuffledObjs.slice(0,setSize);
//   var controlObjs = shuffledObjs.slice(setSize,setSize*2);

//   // define common trialInfo for each condition (omits: targetID, phase, repetition -- these are 
//   // added iteratively)
//   commonRepeatedTrialInfo = {'objectIDs': repeatedObjs,
//                             'category': repeatedCat,
//                             'pose': 35,
//                             'condition':'repeated',
//                             'repeatedColor':repeatedColor
//                             }

//   commonControlTrialInfo = {'objectIDs': controlObjs,
//                             'category': controlCat,
//                             'pose': 35,
//                             'condition':'control',
//                             'repeatedColor':repeatedColor
//                             }
// // console.log("commonRepeatedTrialInfo: ", commonRepeatedTrialInfo ,"\n") // sebholt print statement
// // console.log("commonControlTrialInfo: ", commonControlTrialInfo ,"\n") // sebholt print statement
//   // pre phase 
//   var pre = _.shuffle(_.concat(_.map(repeatedObjs, curObj => {
//                     return _.extend({}, commonRepeatedTrialInfo, {'phase':'pre','repetition':0, 'targetID': curObj});
//                     }), 
//                                _.map(controlObjs, curObj => {
//                     return _.extend({}, commonControlTrialInfo, {'phase':'pre','repetition':0, 'targetID': curObj});
//                     })));
// // console.log("pre: ", pre ,"\n") // sebholt print statement
//   // repeated phase
//   var repeated = _.flatMap(_.range(1,this.numReps+1), curRep => {
//                   return _.map(_.shuffle(repeatedObjs), curObj => {
//                     return _.extend({}, commonRepeatedTrialInfo, {'phase':'repeated','repetition':curRep, 'targetID': curObj});
//                   })
//                  });

//   // post phase
//   var post = _.shuffle(_.concat(_.map(repeatedObjs, curObj => {
//                     return _.extend({}, commonRepeatedTrialInfo, {'phase':'post','repetition':this.numReps+1, 'targetID': curObj});
//                     }), 
//                                _.map(controlObjs, curObj => {
//                     return _.extend({}, commonControlTrialInfo, {'phase':'post','repetition':1, 'targetID': curObj});
//                     })));  

//   // build session by concatenating pre, repeated, and post phases
//   var session = _.concat(pre, repeated, post);

//   // this is the design dictionary
//   return session;

// };

// sebholt begin edit, rewriting getRandomizedConditions function
game_core.prototype.getRandomizedConditions = function() {
  var reps = 1

  var session = _.range(this.stimList.length*reps)
  console.log("stimlist length : ",this.stimList.length,'\n')
  console.log("session length : ",session.length, '\n')
  
  return session;

};
// sebholt end edit, rewriting getRandomizedConditions function

// sebholt begin edit, writing a function to return a random version image url from Amazon given the target's features
game_core.prototype.fetchURL = function(item) {
  num_versions = 100
  v = Math.floor(Math.random() * Math.floor(num_versions)).toString();
  while (v.length < 3) v = "0" + v;
  return "https://iternum.s3.amazonaws.com/" + item['basic'] + '_' + (item['object']+1)+ '_' + v.toString() + ".png";
  }


// // filter stimList according to numObjs (setSize * 2) 
// // as of 12/31/18: as long as you're pulling from stimList_subord_v2.js, this doesn't do anything.
// var filterStimList = function(stimList, numObjs) {
//   // sebholt note: if you change numObjs in the next line to numObjs-2, it takes the first 6 of *each category*
//   return _.filter(stimList, ({object}) => object < numObjs); 
// }

// game_core.prototype.sampleTrial = function(trialInfo, currentSetSize) {
//   var filteredList = filterStimList(this.stimList, currentSetSize*2);
//   var miniTrialInfo = _.pick(trialInfo, ['condition', 'phase', 'repetition', 'repeatedColor'])
//   var distractorLabels = ['distr1', 'distr2', 'distr3']

//   // Pull objects specified in trialInfo out of stimlist 
//   return _.map(trialInfo.objectIDs, objID => {
//     var objFromList = _.find(filteredList, {'basic' : trialInfo.category, 'object' : objID});
//     var targetStatus = objID == trialInfo.targetID ? 'target' : distractorLabels.pop();
//     return _.extend({}, objFromList, miniTrialInfo, {target_status: targetStatus});
//   });
// };

// sebholt begin edit rewrite this function
game_core.prototype.newsampleTrial = function(target,stimlist) {
  // stimlist = this.stimList // commenting this, so as to ignore the one imported from stimList.js
  var curTarg = target

  var same_number = _.without(_.filter(stimlist, {'object' : curTarg['object']}),curTarg);
  var same_shape = _.without(_.filter(stimlist, {'basic' : curTarg['basic']}),curTarg);
  var same_neither = _.differenceWith(stimlist, same_number, _.isEqual);
  same_neither = _.without(_.differenceWith(same_neither, same_shape, _.isEqual),curTarg);
  // ^ replace above two lines with a single call of '_.without' – this does the job better

  var not_number = _.differenceWith(stimlist, _.filter(stimlist, {'object' : curTarg['object']}), _.isEqual);

  // sample from each of the distractor categories (first try):
  discriminator = this.game_condition == 'number' ?  same_shape : same_number;
  var sampled_distr1 = _.sample(discriminator);
  var sampled_distr2 = _.sample(_.without(discriminator,sampled_distr1));
  // console.log("sampled: ",_.without(_.without(discriminator,sampled_distr1),sampled_distr2))
  // var sampled_distr3 = condition == 'number' ? _.sample(_.without(_.without(discriminator,sampled_distr1),sampled_distr2)) : _.without(_.without(discriminator,sampled_distr1),sampled_distr2);
  var sampled_distr3 = _.sample(_.without(_.without(discriminator,sampled_distr1),sampled_distr2));


  // sample from each of the distractor categories (second try):
  // var sampled_distr1 = _.sample(not_number);
  // var sampled_distr2 = _.sample(_.without(not_number,sampled_distr1));
  // var sampled_distr3 = _.sample(_.without(_.without(not_number,sampled_distr1),sampled_distr2));

  
  var d1 = _.extend({}, sampled_distr1, {target_status: 'distr1'}, {sketcher_url: this.fetchURL(sampled_distr1)}, {viewer_url: this.fetchURL(sampled_distr1)});
  var d2 = _.extend({}, sampled_distr2, {target_status: 'distr2'}, {sketcher_url: this.fetchURL(sampled_distr2)}, {viewer_url: this.fetchURL(sampled_distr2)});
  var d3 = _.extend({}, sampled_distr3, {target_status: 'distr3'}, {sketcher_url: this.fetchURL(sampled_distr3)}, {viewer_url: this.fetchURL(sampled_distr3)});
  var tg = _.extend({}, curTarg, {target_status: 'target'}, {sketcher_url: this.fetchURL(curTarg)}, {viewer_url: this.fetchURL(curTarg)});

  
  var newoutput = [d1,d2,d3,tg]
  return newoutput ;
};
// sebholt end edit rewrite this function


game_core.prototype.sampleStimulusLocs = function() {
  var listenerLocs = _.shuffle([[1,1], [2,1], [3,1], [4,1]]); // added [5,1],[6,1]
  var speakerLocs = _.shuffle([[1,1], [2,1], [3,1], [4,1]]); // added [5,1],[6,1]
  if (this.setSize == 6) {
    listenerLocs = _.shuffle([[1,1], [2,1], [3,1], [4,1], [5,1], [6,1]]); // added [5,1],[6,1]
    speakerLocs = _.shuffle([[1,1], [2,1], [3,1], [4,1], [5,1], [6,1]]); // added [5,1],[6,1]
  }
  return {listener : listenerLocs, speaker : speakerLocs};
};


// sebholt adding a function to sort his super annoying list
// 'binwidths' is a list containing the length, in increasing order, of the constituents you want shuffled
game_core.prototype.hierarchical_shuffle = function(unshuffled,binwidths) {
  shuffled_list = unshuffled;

  for (var i = 0; i < binwidths.length; i++) {

    level_consituents = []
    for (var j = 0; j < shuffled_list.length / binwidths[i]; j++) {
      new_constituent = _.shuffle(shuffled_list.slice(j*binwidths[i],j*binwidths[i]+binwidths[i]))
      level_consituents.push(new_constituent)
    }
    shuffled_list = level_consituents;
  }

  for (var i = 0; i < binwidths.length; i++) {
    shuffled_list = _.flatten(shuffled_list);
  }
  return shuffled_list;
};


game_core.prototype.makeTrialList = function () {
  
  var local_this = this;
  var session = this.getRandomizedConditions(); // added

  var objList = new Array;
  var locs = new Array;

  var trialList = [];
  var currentSetSize = this.setSize;

  var possible_targets = this.stimList;  // sebholt addition
  var available_animals = ['bear','deer','owl','rabbit'] //,'rabbit','squirrel','wolf'];  // sebholt addition
  var available_cardinalities = [0,1,2,3,4,5,6,7];  // sebholt addition




  // sebholt trying to make a better trial sequence 21/April/2020
  block1 = [];
  block1_cardinalities = _.shuffle(available_cardinalities);
  block1_animals = _.shuffle(available_animals);
  for (var i = 0; i < available_cardinalities.length; i++) {
    
    // pick our values and add them to the list
    cur_card = block1_cardinalities[i];
    cur_animal = i < block1_animals.length ? block1_animals[i] : block1_animals[i-block1_animals.length];
    cur_sub = cur_animal + '_' + cur_card
    // console.log("try", cur_card, cur_sub)
    new_targ = {object: cur_card,
                basic: cur_animal,
                subordinate: cur_sub,
                width: 256,
                height: 256};
    block1.push(new_targ);
  }
  // come up with a nicer regex for the non-initial blockss
  block2 = []
  block1.forEach(element => {
    ind = block1_cardinalities.indexOf(element.object);
    cur_card = ind == block1_cardinalities.length-1 ? block1_cardinalities[0] : block1_cardinalities[ind+1];
    cur_sub = element.basic + '_' + cur_card
    new_targ = {object: cur_card,
      basic: element.basic,
      subordinate: cur_sub,
      width: 256,
      height: 256};
    block2.push(new_targ)
  });
  block3 = []
  block2.forEach(element => {
    ind = block1_cardinalities.indexOf(element.object);
    cur_card = ind == block1_cardinalities.length-1 ? block1_cardinalities[0] : block1_cardinalities[ind+1];
    cur_sub = element.basic + '_' + cur_card
    new_targ = {object: cur_card,
      basic: element.basic,
      subordinate: cur_sub,
      width: 256,
      height: 256};
    block3.push(new_targ)
  });
  block4 = []
  block3.forEach(element => {
    ind = block1_cardinalities.indexOf(element.object);
    cur_card = ind == block1_cardinalities.length-1 ? block1_cardinalities[0] : block1_cardinalities[ind+1];
    cur_sub = element.basic + '_' + cur_card
    new_targ = {object: cur_card,
      basic: element.basic,
      subordinate: cur_sub,
      width: 256,
      height: 256};
    block4.push(new_targ)
  });

  var target_sequence = _.concat(block1, block2, block3, block4);
  target_sequence = this.hierarchical_shuffle(target_sequence,[4,2,4])

  // just checking to see that it has indeed produced all possible targets without replacement
  // subs = []
  // target_sequence.forEach(element => {
  //   console.log(element.object, element.subordinate);
  //   subs.push(element.subordinate)
  // });
  // unique_subs = [...new Set(subs)];
  // console.log(unique_subs.length)

  // test = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
  // new_test = _.concat(_.shuffle(test.slice(0,4)), _.shuffle(test.slice(4,8)), _.shuffle(test.slice(8,12)));
  // new_test = this.hierarchical_shuffle(test,[3,2]);
  // console.log(new_test,new_test.length);//, "length: ",new_test.length, typeof Array.from(new_test));

  //console.log(new_test[1][1]);




  // for (var i = 0; i < session.length; i++) {    // sebholt commented this
  for (var i = 0; i < session.length; i++) {  // sebholt addition, to replace above
    var trialInfo = session[i]
    // for (var i = 0; i < categoryList.length; i++) { // "i" indexes round number ---- commented out
    // sample four object images that are unique and follow the condition constraints

    // sebholt begin edit

    // var current_animal = _.sample(available_animals)
    // var same_animal = _.filter(possible_targets, {'basic': current_animal})

    // // now we have the animal, find all remaining targets whose cardinality hasn't been used in this block
    // var valid_targets = _.filter(same_animal, function(possible){
    //   return available_cardinalities.includes(possible.object)
    // })
    // var target = _.sample(valid_targets)

    // console.log(i)
    // console.log("numbers",available_cardinalities)
    // console.log("UH OH",current_cardinality,'\n')
    // console.log("animals",available_animals)
    // console.log("current_animal",current_animal,'\n')
    // console.log("curtarg",target,'\n\n')
    // console.log("CurTarg",target.subordinate,'\n')
    // console.log("valid_targets",valid_targets,'\n')

    // var current_cardinality = target.object
    

    // trying it a new way. Commented out on 22/April
    // var ticker = 0
    // while (ticker == 0){
    //   var poss_targs = _.filter(possible_targets, function(candidate){
    //     return available_cardinalities.includes(candidate.object) && available_animals.includes(candidate.basic)
    //   })
    //   if (poss_targs.length == 0){
    //     console.log("numbers",available_cardinalities)
    //     console.log("animals",available_animals)
    //   }
    //   var target = _.sample(poss_targs)
    //   ticker = 1
    // }

    // new improved target selection as of 21/April/2020
    var target = target_sequence[i]
    
    // console.log("poss_targs",poss_targs,'\n')
    // console.log(target.subordinate)
    var current_cardinality = target.object
    var current_animal = target.basic

    // delete current animal, cardinality, and target from their respective lists
    // available_animals = available_animals.filter(function(item) {
    //   return item !== current_animal
    // });
    possible_targets = possible_targets.filter(function(item) {
      return item !== target
    });
    available_cardinalities = available_cardinalities.filter(function(item) {
      return item !== current_cardinality
    });
    // console.log("IS THIS CONDITION BEING MET??", possible_targets.length)
    // if the sets from which we're sampling without replacement are empty, refill them:
    if (possible_targets.length == 0) {
      possible_targets = this.stimList
    }
    if (available_animals.length == 0) {
      available_animals = ['bear','deer','owl','rabbit']; //,'rabbit','squirrel','wolve'];
    }
    if (available_cardinalities.length == 0) {
      available_cardinalities = [0,1,2,3,4,5,6,7]; //,8,9,10,11];
    }
    // sebholt end edit

    // var objList = this.sampleTrial(trialInfo, currentSetSize); // sebholt edit, commented this
    var objList = this.newsampleTrial(target,target_sequence); // sebholt edit (addition)    

    // console.log('objList',objList);

    // sample locations for those objects
    var locs = this.sampleStimulusLocs();
    // construct trial list (in sets of complete rounds)
    trialList.push(_.map(_.zip(objList, locs.speaker, locs.listener), function(tuple) {
      var object = _.clone(tuple[0]);      
      object.width = local_this.cellDimensions.width;
      object.height = local_this.cellDimensions.height;
      var speakerGridCell = local_this.getPixelFromCell(tuple[1][0], tuple[1][1]);
      // console.log("speakerGridCell: ",speakerGridCell,"\n") // sebholt print statement
      var listenerGridCell = local_this.getPixelFromCell(tuple[2][0], tuple[2][1]);
      object.speakerCoords = {
      	gridX : tuple[1][0],
      	gridY : tuple[1][1],
      	trueX : speakerGridCell.centerX - object.width/2,
      	trueY : speakerGridCell.centerY - object.height/2,
      	gridPixelX: speakerGridCell.centerX - 100,
      	gridPixelY: speakerGridCell.centerY - 100
            };
      object.listenerCoords = {
      	gridX : tuple[2][0],
      	gridY : tuple[2][1],
      	trueX : listenerGridCell.centerX - object.width/2,
      	trueY : listenerGridCell.centerY - object.height/2,
      	gridPixelX: listenerGridCell.centerX - 100,
      	gridPixelY: listenerGridCell.centerY - 100
      };
      
      return object;

      }));


  };

  return(trialList);

};

game_core.prototype.server_send_update = function(){
  //Make a snapshot of the current state, for updating the clients
  var local_game = this;

  // Add info about all players
  var player_packet = _.map(local_game.players, function(p){
    return {id: p.id,
            player: null};
  });

  var state = {
    gs : this.game_started,   // true when game's started
    pt : this.players_threshold,
    pc : this.player_count,
    dataObj  : this.data,
    roundNum : this.roundNum,
    trialInfo: this.trialInfo,
    objects: this.objects,
    gameID: this.id
  };

    // console.log('state',state);

  _.extend(state, {players: player_packet});
  _.extend(state, {instructions: this.instructions});
  if(player_packet.length == 2) {
    _.extend(state, {objects: this.objects});
  }
  // console.log('printing state variable from server_send_update');
  // console.log(state);
  //Send the snapshot to the players
  this.state = state;
  _.map(local_game.get_active_players(), function(p){
    p.player.instance.emit( 'onserverupdate', state);});
};

// maps a grid location to the exact pixel coordinates
// for x = 1,2,3,4; y = 1,2,3,4
game_core.prototype.getPixelFromCell = function (x, y) {
  return {
    centerX: (this.cellPadding/2 + this.cellDimensions.width * (x - 1)
        + this.cellDimensions.width / 2),
    centerY: (this.cellPadding/2 + this.cellDimensions.height * (y - 1)
        + this.cellDimensions.height / 2),
    upperLeftX : (this.cellDimensions.width * (x - 1) + this.cellPadding/2),
    upperLeftY : (this.cellDimensions.height * (y - 1) + this.cellPadding/2),
    width: this.cellDimensions.width,
    height: this.cellDimensions.height
  };
};

// maps a raw pixel coordinate to to the exact pixel coordinates
// for x = 1,2,3,4; y = 1,2,3,4
game_core.prototype.getCellFromPixel = function (mx, my) {
  var cellX = Math.floor((mx - this.cellPadding / 2) / this.cellDimensions.width) + 1;
  var cellY = Math.floor((my - this.cellPadding / 2) / this.cellDimensions.height) + 1;
  return [cellX, cellY];
};
