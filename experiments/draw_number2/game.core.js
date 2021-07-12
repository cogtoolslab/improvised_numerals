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
  this.experimentName = 'num6_shape3';
  this.iterationName = 'pilot2';  // pilot1, sandbox1, sandbox2
  this.email = 'ladlab.ucsd@gmail.com';

  // save data to the following locations (allowed: 'csv', 'mongo')
  this.dataStore = ['csv', 'mongo'];

  // which condition are we going to use for this game?
  this.game_condition = _.sample(['large']); // 'small' or 'large', whatever conditions we want
  console.log("CONDITION : ", this.game_condition)
  this.anonymizeCSV = true;

  // is the viewer seeing sets of animals, or just written numbers? 'true' if looking at pictures like the sketcher
  this.guessing_pictures = true // _.sample([true,false]);
  console.log("Viewer Sees Pictures?? : ", this.guessing_pictures)

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
    this.numRounds = 30; // sebholt edit; changed 40 to 24 to 32 to 30
  } else {
    this.numRounds = 30; // sebholt edit; changed 48 to 36 to 42 to 18 to 30
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
  num_versions = 100
  v = Math.floor(Math.random() * Math.floor(num_versions)).toString();
  while (v.length < 3) v = "0" + v;

  if (this.guessing_pictures == true || the_role == 's'){
    the_url = "https://iternum2.s3.amazonaws.com/" + item['basic'] + '_' + (item['object']+1)+ '_' + v.toString() + ".png";
  } else if (this.guessing_pictures == false && the_role == 'v'){
    the_url = "forms/images/number_buttons/button" + '_' + (item['object']+1) + ".png";
  };
  return the_url
  }

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

  // // This version does a 6x6 design with no generalization trials:
  // var available_animals = ['bear','deer','owl','rabbit','squirrel','wolf'];
  // var available_cardinalities = this.game_condition == 'small' ? [0,1,2,3,4,5] : [14,15,16,17,18,19];
  // shuffledCardinalities = _.shuffle(available_cardinalities);
  // shuffledAnimals = _.shuffle(available_animals);
  // targs = []
  // for (var b = 0; b < this.numBlocks; b++){
  //   blockAnimals = _.concat(shuffledAnimals.slice(b,shuffledAnimals.length),shuffledAnimals.slice(0,b));
  //   for (var i = 0; i < shuffledCardinalities.length; i++){
  //     sub = blockAnimals[i] + '_' + shuffledCardinalities[i]
  //     new_targ = {
  //       object: shuffledCardinalities[i],
  //       basic: blockAnimals[i],
  //       subordinate: sub,
  //       width: 256,
  //       height: 256};
  //     targs.push(new_targ);
  //   };
  // };
  // target_sequence = this.hierarchical_shuffle(targs,[6,6])

  var available_animals = ['bear','deer','owl']
  var available_cardinalities = this.game_condition == 'small' ? [0,1,2,3,4,5] : [14,15,16,17,18,19];
  shuffledCardinalities = _.shuffle(available_cardinalities);
  shuffledAnimals = _.shuffle(available_animals);

  possibleStimuli = [];
  targs = [];
  for (var r = 0; r < this.numReps; r++){
    repTargs = [];
    for (var c = 0; c < shuffledCardinalities.length; c++){
      for (var a = 0; a < shuffledAnimals.length-1; a++){  // hold out one animal
        sub = shuffledAnimals[a] + '_' + shuffledCardinalities[c]
        new_targ = {
          object: shuffledCardinalities[c],
          basic: shuffledAnimals[a],
          subordinate: sub,
          width: 256,
          height: 256};
        repTargs.push(new_targ);        
      };
    };
    targs = _.concat(targs,this.hierarchical_shuffle(repTargs,[12,6]));
  };
  target_sequence = targs
  // now do the generalization
  genTargs = [];
  for (var c = 0; c < shuffledCardinalities.length; c++){
    sub = shuffledAnimals[shuffledAnimals.length-1] + '_' + shuffledCardinalities[c]
    new_targ = {
      object: shuffledCardinalities[c],
      basic: shuffledAnimals[shuffledAnimals.length-1],
      subordinate: sub,
      width: 256,
      height: 256};
      genTargs.push(new_targ);
  };
  target_sequence = _.concat(target_sequence,_.shuffle(genTargs));

  // // See what the target list looks like:
  // for (var i = 0; i < target_sequence.length; i++){
  //   console.log(target_sequence[i].subordinate)
  // }

  for (var i = 0; i < target_sequence.length; i++) {  
    // new improved target selection as of 21/April/2020
    var target = target_sequence[i]

    var objList = this.newsampleTrial(target,available_animals,available_cardinalities); // sebholt edit (addition)    

    

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
