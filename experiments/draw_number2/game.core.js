/*  Copyright (c) 2012 Sven "FuzzYspo0N" Bergström,
                  2013 Robert XD Hawkins
 written by : http://underscorediscovery.com
    written for : http://buildnewgames.com/real-time-multiplayer/
    substantially modified for collective behavior experiments on the web
    MIT Licensed.
*/

// const { all } = require('underscore');

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
  this.experimentName = 'num6_shape3';
  this.iterationName = 'regularity1';  // pilot1, sandbox1, sandbox2, pilot2, sandbox3, 
  // pilot1 was very dull for everyone, too much counting for viewer and sketcher
  // sandbox2 was to check that we are storing the correct time stamps and whether viewer sees images or numbers
  // pilot2 showed viewers arabic numerals instead of stims
  // sandbox3 to check if we are storing 'regularity' info correctly
  // pilot3 shows viewers regular arrays, or random ones that never vary between roles or trial number
  // 
  this.email = 'ladlab.ucsd@gmail.com';

  // save data to the following locations (allowed: 'csv', 'mongo')
  this.dataStore = ['csv', 'mongo'];

  // which condition are we going to use for this game?
  this.game_condition = _.sample(['large']); // 'small' or 'large', whatever conditions we want
  
  this.anonymizeCSV = true;

  // is the viewer seeing sets of animals, or just written numbers? 'true' if looking at pictures like the sketcher
  this.guessing_pictures = true // _.sample([true,false]);

  // will the spatial distribution of animals on the stim be regular or random?
  this.regularity = _.sample(['regular','random']) // 'regular' or 'random'

  // we want every cardinality in the random condition to have its own spatial distribution,
  // which should be constant within-game but arbitrary between-games
  // currently there are 20 possible cardinalities:
  this.stimVersions = Array.from({length: 20}, () => Math.floor(Math.random() * 100));

  // next bit of code is because one of the arrangements looks too much like a swastika, so remove it
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  };
  // console.log("Stim Versions : ", this.stimVersions);
  var uhoh = this.stimVersions.findIndex(element => element == 7);
  while (uhoh != -1){
    uhoh = this.stimVersions.findIndex(element => element == 7);
    if (uhoh != -1){
      this.stimVersions[uhoh] = getRandomInt(8,100);
      // console.log("Uh oh: ",uhoh);
    };
  };
  // console.log("Modified:       ", this.stimVersions);



  // How many players in the game?
  this.players_threshold = 2;
  this.playerRoleNames = {
    role1 : 'sketcher',
    role2 : 'viewer'
  };

  // How many objects do we have in a context?
  this.setSize = 4; // many things depend on this

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

  // How many strokes do we get?
  this.strokeLimit = 4;

  // Which stroke number are we on?
  this.currStrokeNum = 0;

  // Has the sketcher drawn anything?
  this.strokeMade = false;

  // How much ink do we get?
  this.inkLimit = 200;

  // How much ink have we used?
  this.inkUsed = 0;

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

  // Modify the sketchpad dimensions
  this.sketchpadShape = [300,300]

  // How many repetitions do we want?
  if (this.setSize == 4) {
    this.numReps = 6;
  } else {
    this.numReps = 2;
  }

  // How many rounds do we want people to complete?
  if (this.setSize == 4) {
    this.numRounds = 36; // sebholt edit; changed 40 to 24 to 32 to 30
  } else {
    this.numRounds = 36; // sebholt edit; changed 48 to 36 to 42 to 18 to 30
  }

  // how many blocks in total?
  this.numBlocks = 6;

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

  // Most recent submit time
  this.submitTime = 0;

  // Most recent clicked time
  this.clickedTime = 0;

  // Most recent confirm time
  this.confirmTime = 0;

  // Using different categories for the conditions?
  this.diffCats = true; // set to true if we want repeated and control to come from different clusters

  // When did the current trial start?
  this.trialStartTime = Date.now();


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
    // this.stimList = _.map(require('./stimList', _.clone))[0];
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
};

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
    // following block is to switch roles
    // _.map(this.get_active_players(), function(p){
    //   if(p.player.instance.role === 'sketcher'){
    //     p.player.instance.role = 'viewer'
    //   } else if(p.player.instance.role === 'viewer'){
    //     p.player.instance.role = 'sketcher'
    //   }
      
    //   console.log(p.player.instance.role);});

    // console.log('got to newRound in game.core.js and not the final round');
    // Otherwise, get the preset list of objects for the new round
    this.roundNum += 1;
    this.trialInfo = {currStim: this.trialList[this.roundNum]};
    this.objects = this.trialList[this.roundNum];
    this.objClicked = false;
    active_players = this.get_active_players();
    // this.setupTimer(this.timeLimit,active_players); // remove timer
    this.trialStartTime = Date.now();
    
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

// sebholt begin edit, writing a function to return a random version image url from Amazon given the target's features
game_core.prototype.fetchURL = function(item,the_role) {
  // for arbitrary versions each time:
  // num_versions = 100
  // v = Math.floor(Math.random() * Math.floor(num_versions)).toString();

  // for version identical to cardinality:
  // v = (item['object']+1).toString();

  // for within-game same version per cardinality, but arbitrary between-game
  v = this.stimVersions[item['object']].toString();
  while (v.length < 3) v = "0" + v;
  
  if (this.regularity == 'random'){
    the_url = "https://iternum2.s3.amazonaws.com/" + this.regularity + '_'  + item['basic'] + '_' + (item['object']+1)+ '_' + v + '.png'
  } else {
    the_url = "https://iternum2.s3.amazonaws.com/" + this.regularity + '_'  + item['basic'] + '_' + (item['object']+1)+ '_000.png';
  };
  
  // if (this.guessing_pictures == true || the_role == 's'){
  //   the_url = "https://iternum2.s3.amazonaws.com/" + item['basic'] + '_' + (item['object']+1)+ '_' + v.toString() + ".png";
  // } else if (this.guessing_pictures == false && the_role == 'v'){
  //   the_url = "forms/images/number_buttons/button" + '_' + (item['object']+1) + ".png";
  // };
  return the_url
  };

// sebholt begin edit rewrite this function
game_core.prototype.newsampleTrial = function(target,animals,cardinalities) {
  var curTarg = target
  var numbers = cardinalities
  
  // var discriminator = _.filter(_.without(stimlist,target), {'basic' : curTarg['basic']});
  // var sampled_distr1 = _.sample(discriminator);
  // var sampled_distr2 = _.sample(_.without(discriminator,sampled_distr1));
  // var sampled_distr3 = _.sample(_.without(_.without(discriminator,sampled_distr1),sampled_distr2));
  // var sampled_distr4 = _.sample(_.without(_.without(_.without(discriminator,sampled_distr1),sampled_distr2),sampled_distr3));
  // var sampled_distr5 = _.sample(_.without(_.without(_.without(_.without(discriminator,sampled_distr1),sampled_distr2),sampled_distr3),sampled_distr4));
  
  
  var numbers = _.difference(cardinalities, [curTarg['object']]);
  numbers = _.shuffle(numbers);

  var sampled_distr1 = {
    object: numbers[0],
    basic: curTarg['basic'],
    subordinate: curTarg['basic'] + '_' + numbers[0],
    width: 256,
    height: 256};
  
  var sampled_distr2 = {
    object: numbers[1],
    basic: curTarg['basic'],
    subordinate: curTarg['basic'] + '_' + numbers[1],
    width: 256,
    height: 256};

  var sampled_distr3 = {
    object: numbers[2],
    basic: curTarg['basic'],
    subordinate: curTarg['basic'] + '_' + numbers[2],
    width: 256,
    height: 256};

  if (this.setSize == 6){
    var sampled_distr4 = {
      object: numbers[3],
      basic: curTarg['basic'],
      subordinate: curTarg['basic'] + '_' + numbers[3],
      width: 256,
      height: 256};
  
    var sampled_distr5 = {
      object: numbers[4],
      basic: curTarg['basic'],
      subordinate: curTarg['basic'] + '_' + numbers[4],
      width: 256,
      height: 256};
  };
  


  // console.log("Ds: ",curTarg.subordinate,sampled_distr1.subordinate,
  // sampled_distr2.subordinate,sampled_distr3.subordinate,
  // sampled_distr4.subordinate,sampled_distr5.subordinate);
  // // console.log(stimlist.length)
  // console.log(_.intersection(discriminator,[curTarg]));
  // console.log(discriminator)
  

  var d1 = _.extend({}, sampled_distr1, {target_status: 'distr1'}, {sketcher_url: this.fetchURL(sampled_distr1,'s')}, {viewer_url: this.fetchURL(sampled_distr1,'v')});
  var d2 = _.extend({}, sampled_distr2, {target_status: 'distr2'}, {sketcher_url: this.fetchURL(sampled_distr2,'s')}, {viewer_url: this.fetchURL(sampled_distr2,'v')});
  var d3 = _.extend({}, sampled_distr3, {target_status: 'distr3'}, {sketcher_url: this.fetchURL(sampled_distr3,'s')}, {viewer_url: this.fetchURL(sampled_distr3,'v')});
  var tg = _.extend({}, curTarg, {target_status: 'target'}, {sketcher_url: this.fetchURL(curTarg,'s')}, {viewer_url: this.fetchURL(curTarg,'v')});
  var newoutput = [d1,d2,d3,tg]

  if (this.setSize == 6){
    var d4 = _.extend({}, sampled_distr4, {target_status: 'distr4'}, {sketcher_url: this.fetchURL(sampled_distr4,'s')}, {viewer_url: this.fetchURL(sampled_distr4,'v')});
    var d5 = _.extend({}, sampled_distr5, {target_status: 'distr5'}, {sketcher_url: this.fetchURL(sampled_distr5,'s')}, {viewer_url: this.fetchURL(sampled_distr5,'v')});
    var newoutput = [d1,d2,d3,d4,d5,tg]
  };
  
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
  var objList = new Array;
  var locs = new Array;

  var trialList = [];

  var all_animals = ['bear','deer','owl'] //,'wolf'
  var training_cardinalities = this.game_condition == 'small' ? [0,1,2,3,4,5] : [14,15,16,17,18,19];
  var testing_cardinalities = this.game_condition == 'small' ? [0,1,2,3,4,5] : [14,15,16,17,18,19];

  // console.log("TRAIN: ", training_cardinalities);
  // console.log("TEST: ", testing_cardinalities);

  // designate one animal to be the first and last (test) block
  special_animal = _.sample(all_animals);
  // available_animals = _.without(all_animals,special_animal);
  available_animals = all_animals; // added for study 2 (12/Aug/2021)

  shuffledTrainCardinalities = _.shuffle(training_cardinalities);
  shuffledTestCardinalities = _.shuffle(testing_cardinalities);
  shuffledAnimals = _.shuffle(available_animals);

  // block1 = [];
  // for (var c = 0; c < shuffledTrainCardinalities.length; c++){
  //   sub = special_animal + '_' + shuffledTrainCardinalities[c]
  //   new_targ = {
  //     object: shuffledTrainCardinalities[c],
  //     basic: special_animal,
  //     subordinate: sub,
  //     width: 256,
  //     height: 256};
  //   block1.push(new_targ);
  // };

  // blockTest = [];
  // for (var c = 0; c < shuffledTestCardinalities.length; c++){
  //   sub = special_animal + '_' + shuffledTestCardinalities[c]
  //   new_targ = {
  //     object: shuffledTestCardinalities[c],
  //     basic: special_animal,
  //     subordinate: sub,
  //     width: 256,
  //     height: 256};
  //   blockTest.push(new_targ);
  // };

  all_targs = [];
  for (var a = 0; a < shuffledAnimals.length; a++){
    for (var c = 0; c < shuffledTrainCardinalities.length; c++){
      new_targ = {
        object: shuffledTrainCardinalities[c],
        basic: shuffledAnimals[a],
        subordinate: shuffledAnimals[a] + '_' + shuffledTrainCardinalities[c],
        width: 256,
        height: 256};
      all_targs.push(new_targ);
    };
  };
  
  all_targs1 = all_targs;
  blocksRep1 = [];
  // tempAnimals = shuffledAnimals;
  // tempCardinalities = shuffledCardinalities;
    for (var a = 0; a < shuffledAnimals.length; a++){
      for (var c = 0; c < shuffledTrainCardinalities.length; c++){
        // animal = _.sample(tempAnimals);
        // tempAnimals = _.without(tempAnimals,animal);
        // cardinality = _.sample(tempCardinalities);
        // tempCardinalities = _.without(tempCardinalities,cardinality);
        // if (tempCardinalities.length == 0){tempCardinalities = shuffledCardinalities};
        // if (tempAnimals.length == 0){tempAnimals = shuffledAnimals};
        same_number = _.filter(all_targs1, {'object': shuffledTrainCardinalities[c]});
        animal = _.sample(same_number);
        all_targs1 = _.without(all_targs1,animal);
        animal = animal.basic;

        sub = animal + '_' + shuffledTrainCardinalities[c]
        new_targ = {
          object: shuffledTrainCardinalities[c],
          basic: animal,
          subordinate: sub,
          width: 256,
          height: 256};
        blocksRep1.push(new_targ);        
      };
    };

    all_targs2 = all_targs;
    blocksRep2 = [];
    // tempAnimals = shuffledAnimals;
    // tempCardinalities = shuffledCardinalities;
      for (var a = 0; a < shuffledAnimals.length; a++){
        for (var c = 0; c < shuffledTrainCardinalities.length; c++){
          // animal = _.sample(tempAnimals);
          // tempAnimals = _.without(tempAnimals,animal);
          // cardinality = _.sample(tempCardinalities);
          // tempCardinalities = _.without(tempCardinalities,cardinality);
          // if (tempCardinalities.length == 0){tempCardinalities = shuffledCardinalities};
          // if (tempAnimals.length == 0){tempAnimals = shuffledAnimals};
          same_number = _.filter(all_targs2, {'object': shuffledTrainCardinalities[c]});
          animal = _.sample(same_number);
          all_targs2 = _.without(all_targs2,animal);
          animal = animal.basic;
  
          sub = animal + '_' + shuffledTrainCardinalities[c]
          new_targ = {
            object: shuffledTrainCardinalities[c],
            basic: animal,
            subordinate: sub,
            width: 256,
            height: 256};
          blocksRep2.push(new_targ);        
        };
      };
  

  // // trying to rewrite it differently on 2021-Aug-17
  // blocksRep = [];
  // tempAnimals = shuffledAnimals;
  //   for (var r = 0; r < this.numReps; r++){
  //     for (var c = 0; c < shuffledTrainCardinalities.length; c++){
  //       if (tempAnimals.length == 0){
  //         tempAnimals = shuffledAnimals;
  //       };
  //       animal = _.sample(tempAnimals);
  //       tempAnimals = _.without(tempAnimals,animal)
  //       same_number = _.filter(all_targs, {'object': shuffledTrainCardinalities[c]});
  //       same_both = _.filter(same_number, {'basic': animal});
  //       all_targs = _.without(all_targs,same_both[0]);
        

  //       sub = animal + '_' + shuffledTrainCardinalities[c]
  //       new_targ = {
  //         object: shuffledTrainCardinalities[c],
  //         basic: animal,
  //         subordinate: sub,
  //         width: 256,
  //         height: 256};
  //       blocksRep.push(new_targ);        
  //     };
  //   };
  // Now shuffle all the blocks:
  // blocksRep = this.hierarchical_shuffle(blocksRep,[shuffledTrainCardinalities.length,shuffledAnimals.length])

  // target_sequence = _.concat(block1,blocksRep,blockTest); // 12/Aug/2021
  target_sequence = _.concat(blocksRep1,blocksRep2);
  target_sequence = this.hierarchical_shuffle(target_sequence,[shuffledTrainCardinalities.length,shuffledAnimals.length]);

  // // See what the target list looks like:
  // for (var i = 0; i < target_sequence.length; i++){
  //   console.log(target_sequence[i].subordinate)
  // };

  for (var i = 0; i < target_sequence.length; i++) {  
    // new improved target selection as of 21/April/2020
    var target = target_sequence[i]

    if (training_cardinalities.includes(target.object)){
      var objList = this.newsampleTrial(target,all_animals,training_cardinalities);
    } else {
      var objList = this.newsampleTrial(target,all_animals,testing_cardinalities);
    };       

    

    // sample locations for those objects
    var locs = this.sampleStimulusLocs();
    // construct trial list (in sets of complete rounds)
    trialList.push(_.map(_.zip(objList, locs.speaker, locs.listener), function(tuple) {
      var object = _.clone(tuple[0]);      
      object.width = local_this.cellDimensions.width;
      object.height = local_this.cellDimensions.height;
      var speakerGridCell = local_this.getPixelFromCell(tuple[1][0], tuple[1][1]);
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
