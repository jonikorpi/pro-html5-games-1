//= require_tree .


// Game
var game = {

  init: function() {
    levels.init();
    loader.init();
    game.canvas = $("#gamecanvas")[0];
    game.context = game.canvas.getContext("2d");
    $(".gamelayer").hide();
    $("#gamestartscreen").show();
  },

  showLevelScreen: function(){
    $('.gamelayer').hide();
    $('#levelselectscreen').show();
  },

};


// Levels
var levels = {

  data: [
    {
      name: "First level",
      foreground: "desert-foreground",
      background: "sky-background",
      entities: []
    },
    {
      name: "Second level",
      foreground: "desert-foreground",
      background: "sky-background",
      entities: []
    }
  ],

  init: function() {
    var html = "";
    $.each(levels.data, function(i, level) {
      html+= "<a class='button' data-level-id='" + i + "'>" + level.name + "</a>";
    });
    $('#levelselectscreen').html(html);
    $(document).on("click", "#levelselectscreen .button", function(){
      levels.load( $(this).attr("data-level-id") );
      $('#levelselectscreen').hide();
    });
  },

  load: function(number) {
    // declare a new currentLevel object
    game.currentLevel = { number: number, hero: [] };
    game.score = 0;
    $('#score').html('Score: '+game.score);
    var level=levels.data[number];
    // load the background, foreground, and slingshot images
    game.currentLevel.backgroundImage = loader.loadImage("images/backgrounds/" + level.background + ".png");
    game.currentLevel.foregroundImage = loader.loadImage("images/backgrounds/" + level.foreground + ".png");
    game.slingshotImage = loader.loadImage("images/slingshot.png");
    game.slingshotFrontImage = loader.loadImage("images/slingshot-front.png");
    // Call game.start() once the assets have loaded
    if (loader.loaded) {
      game.start()
    }
    else {
      loader.onload = game.start;
    }
  },

}


// Asset loader
var loader = {

  loaded: true,
  loadedCount: 0, // Assets that have been loaded so far
  totalCount: 0, // Total number of assets that need to be loaded
  soundFileExtn: "undefined",

  init: function() {
    // check for sound support
    var mp3Support, oggSupport;
    var audio = document.createElement('audio');
    if (audio.canPlayType) {
      // Currently canPlayType() returns: "", "maybe" or "probably"
      mp3Support="" !=audio.canPlayType('audio/mpeg');
      oggSupport="" !=audio.canPlayType('audio/ogg; codecs="vorbis"');
    }
    else {
      //The audio tag is not supported
      mp3Support = false;
      oggSupport = false;
    }
    // Check for ogg, then mp3, and finally set soundFileExtn to undefined
    loader.soundFileExtn = oggSupport ? ".ogg" : mp3Support ? ".mp3" : undefined;
  },

  loadImage : function(url) {
    this.totalCount++;
    this.loaded = false; $('#loadingscreen').show();
    var image=new Image(); image.src = url;
    image.onload = loader.itemLoaded; return image;
  },

  loadSound: function(url) {
    this.totalCount++;
    this.loaded = false;
    $('#loadingscreen').show();
    var audio=new Audio();
    audio.src = url + loader.soundFileExtn; audio.addEventListener("canplaythrough", loader.itemLoaded, false); return audio;
  },

  itemLoaded: function() {
    loader.loadedCount++;
    $('#loadingmessage').html('Loaded '+loader.loadedCount+' of '+loader.totalCount);
    if (loader.loadedCount === loader.totalCount) {
      // Loader has loaded completely..
      loader.loaded = true;
      // Hide the loading screen
      $('#loadingscreen').hide();
      // and call the loader.onload method if it exists
      if (loader.onload) {
        loader.onload();
        loader.onload = undefined;
      }
    }
  },

}


// Onload
$(function() {

  game.init();

  $(document).on("click", "#play", function(){
    game.showLevelScreen();
  });

});
