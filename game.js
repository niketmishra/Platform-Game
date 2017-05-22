

// Phaser has a Phaser.Game class
// Creating a new phaser game


var GameState = {
    
    
    init : function(someParam){
        // Initialise the settings for entire game
        // This method is optional
        // But if need to pass some infomration btweeen two levels
        // this INIT function is mandotry.
        console.log("In Init");
        this.world.resize(1000,800);
        
        
        this.H = this.world.height;
        this.W = this.world.width;
        
        // This game will use ARCADE Physics
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 1000;
        
        // Create Input from Keyboard
        // Left Right Up and Down.
        this.arrowKeys  =  this.input.keyboard.createCursorKeys();              
        
        // This is for Spacebar.
        this.jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.playerHealth = 100;
        
       
        
        
        
    },
    
    preload : function(){
        console.log("In Preload");
        this.load.image('ground','Images/greenground.png');
        // Loads the assets for your game
        this.load.image('player','Images/pika.png');
        this.load.image('platform','Images/platform.png');
        this.load.image('tree','Images/tree.png');
        this.load.image('hill','Images/hill.png');
        this.load.spritesheet('android','Images/android_spritesheet.png',80,100,5);
        this.load.spritesheet('player','Images/player_spritesheet.png',28,30,5,1,1);
        
        this.load.image('ball','Images/snow.png');
        
    },
    
    create : function(){
        
        
        console.log("In create");
        // To create the objects in the game using the assets
        
        //Give some background color
        this.stage.backgroundColor = "#7ec0ee";
               
        
        
          // Add hills
        for(var i=0;i<=10;i++){
            var h = this.add.sprite(i*250,this.H-80,'hill');
            h.anchor.setTo(0.5,1);
            var s = Math.random()*2 + .5;
            h.scale.setTo(s,s);
        }
        
          // Add trees
        for(var i=1;i<=5;i++){
            this.add.sprite(i*100,this.H-200,'tree');
        }
        
        // Add Ground
        this.ground = this.add.tileSprite(0,this.H-82,this.W,82,'ground');
        this.physics.arcade.enable(this.ground);
        this.ground.body.allowGravity = false;
        this.ground.body.immovable = true;
        
        // Add the Android
        this.android = this.add.sprite(200,300,'android');
        this.android.anchor.setTo(0,1);
       
        
        // Add some animation on this 
        this.android.animations.add('androidkick',[1,0,1,2,3,4,3,2,1],15, true);
        
        // Tell Phaser to start android kick animation
        this.android.animations.play('androidkick');
        
      
        
        // Add Platform
        this.platform = this.add.sprite(200,300,'platform');
        this.physics.arcade.enable(this.platform);
        this.platform.body.allowGravity = false;
        this.platform.body.immovable = true;
        
        // Add Platform Group
        this.createPlatforms();
        
        
        
        
        this.player = this.add.sprite(100,100,'player');
        this.player.scale.setTo(2,2);
        
        // Add animation.
        this.player.animations.add('playerwalk',[0,1,2,1],6,true);
        

        // Both the steps can be done using by enabling
        //physics on the sprite.
        
        this.physics.arcade.enable(this.player);
        //this.player.body.bounce.y = .5;
        //this.player.body.setSize(250,280,0,0);
        
        this.player.inputEnabled = true;
	   //( Above line adds input property to the sprite object)
	   //this.player.input.pixelPerfectClick = true;
	   //this.player.events.onInputDown.add(this.jump,this);
       //this.player.events.onInputDown.add(this.sayHi,this);
        this.player.body.collideWorldBounds = true;
        
        // Tell the camera to follow the player
        this.camera.follow(this.player);
        
        //Lets create a balls group
        this.ballsGroup = this.add.group();
        this.ballsGroup.enableBody = true;
        
        // Talk about Events.
        // Something like set Interval
        /// You are passing context ( Gamestate) as this
        this.ballMaker =
        this.time.events.loop(2000,this.makeBall,this);
        
        
        this.textbox = this.add.text(20,20,"Health "+this.playerHealth);
        this.textbox.fixedToCamera = true;
 
        
        
       
          
    },
    makeBall:function(){
        // To make one ball and add it to the group.
        console.log("Making one ball");
        // How do we make a ball ?
        // After every 2 s a new ball is being created
        
        var ball = this.ballsGroup.getFirstExists(false);
        
        if(!ball){
            ball = this.ballsGroup.create(240,280,'ball');
            
        }
        else{
            //If the ball is found, reset the x,y
            ball.reset(240,280);
        }
        
        var x = Math.random();
        if(x>0.4){
            ball.body.velocity.x = 140;//Math.round(Math.random()*40 + 20);
        }
        else{
             ball.body.velocity.x = -50;//-1*Math.round(Math.random()*40 + 20);
        }
        
    },
    update : function(){
        console.log("In update");
        this.player.body.velocity.x = 0;
        
        this.textbox.setText("Score:"+this.playerHealth);
        
        if(this.playerHealth<0){
                alert("Game Over");
                //Restart
                this.game.state.start('Level1');
        }
        
            
        // Update those objects based on game logic
        this.physics.arcade.collide(this.player,this.ground);
        this.physics.arcade.collide(this.player,this.platform);
        this.physics.arcade.collide(this.player,this.platformGroup);
        this.physics.arcade.collide(this.ballsGroup,this.platformGroup);
        
        this.physics.arcade.overlap(this.ballsGroup,this.player,this.reduceHealth,null,this);
        this.physics.arcade.collide(this.ballsGroup,this.ground);
        
        
        this.physics.arcade.collide(this.ballsGroup,this.platform);
                
        

        
        
        if(this.jumpButton.isDown){
            this.jump();
        }
        if(this.arrowKeys.left.isDown){
            this.player.body.velocity.x = -500;
            console.log("Pressed left");
            
            this.player.scale.setTo(2,2);
            this.player.animations.play('playerwalk');
        }
        else if(this.arrowKeys.right.isDown){
            this.player.body.velocity.x = +500;
            console.log("Pressed right");
            
            this.player.scale.set(-2,2);
            this.player.animations.play('playerwalk');
        }
        else if(this.arrowKeys.up.isDown){
            console.log("Pressed jump");
            this.jump();
        }
        else{
            this.player.animations.stop('playerwalk');
            this.player.frame = 3;
        }
        //iTERATE over every ball in the pool
        this.ballsGroup.forEach(function(ball){
            if(ball.x<=0||ball.x>=1000){
                ball.kill();
                console.log("A ball is dead");
            }
            
        })
        
        //console.log(this.player.body.velocity.y);
        
    },
    reduceHealth:function(){
        console.log("Reducing health");
        this.playerHealth -= 1;
        //alert("Reducing Health");
        
    },
    jump:function(){
        if(this.player.body.touching.down){
            this.player.body.velocity.y = -800;
        }
        //console.log(someInfo);
    },
    sayHi:function(){
        console.log("Pika says hi");
    },
    createPlatforms:function(){
        // Make a group named platforms
        this.platformGroup = this.add.group();
        // First enable body on the group then add platforms.
        this.platformGroup.enableBody = true;
        
        for(var i=0;i<8;i++){
            var x = i*100;
            var y = this.H/2 +  Math.round(Math.random()*100);
           // var y2 = this.H/2 -  Math.round(Math.random()*250);
          
            this.platformGroup.create(i*400, y,'platform');
            //this.platformGroup.create(i*400, y2,'platform');
        }
        
        // This is how you make group gravity-free and immovable.
        this.platformGroup.setAll('body.immovable',true);
        this.platformGroup.setAll('body.allowGravity',false);
        
    },
    render:function(){
        //this.game.debug.body(this.player);
        this.game.debug.body(this.platform);
    }
    
       
}

// A new level
var GameState2 = {
    init : function(){
        // Enable Physics on your game
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 1000;
        
        this.H = this.world.height;
        this.W = this.world.width;
        
        
        // This is for Spacebar.
        this.jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.health = 100;
      
        
    },
    
    preload : function(){
        // Initialise the settings.
        this.load.image( 'bird' ,'assets2/bird1.png');
        this.load.image('ground','Images/greenground.png');
        
        // Load Audio
        this.load.audio('jump','assets/jump.wav');
        this.load.audio('collide','assets/collide.wav');
        
        //Load the pipe
        this.load.image('pole','assets/pipe.png');
        
        //Load the fire spritesheet
        this.load.spritesheet('fire','assets/fire_spritesheet.png',20,20,2,1,1);
        
        
    
    },
    
    create  : function(){
        this.stage.backgroundColor = "#7ec0ee";
        
        this.bird = this.add.sprite(220,100,'bird');
        this.bird.anchor.setTo(.2,.5);
        
        // Enable Physics on our bird
        this.physics.arcade.enable(this.bird);
        
        this.bird.body.collideWorldBounds = true;
        
        
        
        // Add Audio Objects
        this.jumpSound = this.add.audio('jump');
        this.collideSound = this.add.audio('collide');
        // Let us see what are these
        
        // Create the group
        this.polesGroup = this.add.group();
        // Enable body on the group
        this.polesGroup.enableBody = true;
       
        
        // Add Poles to the group
        // I want to create a pole every 2 seconds.
        this.poleMaker =
        this.time.events.loop(2000,this.addPole,this);
        
        //Add Ground
        this.ground = this.add.tileSprite(0,this.H-82,this.W,82,'ground');
        this.physics.arcade.enable(this.ground);
        
        this.ground.body.allowGravity = false;
        this.ground.body.immovable = true;
        
        // Add fire Sprite
        this.firesGroup = this.add.group();
        this.firesGroup.enableBody = true;
        
        //this.physics.arcade.enable(this.firesGroup);
        
        // Add object
        var style = {
            font : "30px Arial",
            fill : "#fff",
            align : "center"
            
        };
        this.score = this.add.text(20,20,"Health "+this.health,style);
       
        
        
    },
    
    update : function(){
        //Update the score as well
        this.score.setText("Health "+this.health);
        
        if(this.bird.angle<=25){
            this.bird.angle +=1;
        }
        
        // You can check if the jump button is down
        if(this.jumpButton.isDown){
            this.bird.body.velocity.y = -400;
            this.bird.angle = -20;
            
            this.jumpSound.play();
        }
        // Check for collision btw bird and ground
        this.physics.arcade.collide(this.bird,this.ground,this.game_over,null,this);
        
        this.physics.arcade.overlap(this.bird,this.firesGroup,function(){ console.log("Hey"); this.health--;},null,this);
        
        //Add collision with pipe also
        this.physics.arcade.collide(this.bird,this.polesGroup,this.game_over,null,this);
        
        if(this.health<=0){
            alert("Game Over");
            this.game.state.start('Level1');
        }
        
        
    },
    addPole :function(){
          var pole = this.polesGroup.getFirstExists(false);
            
            var ry = Math.round((Math.random()*100)/20)*20;
        
            
        
        
        if(!pole){
            pole = this.polesGroup.create(this.W+100,this.H/2+ry,'pole');
            pole.scale.setTo(1,5);
        }
        else{
            //If the pole is found, reset the x,y
            pole.reset(this.W+100,this.H/2+ry);
        }
        pole.body.velocity.x = -200;
         this.polesGroup.setAll('body.immovable',true);
        this.polesGroup.setAll('body.allowGravity',false);
        
        
        var fire = this.firesGroup.getFirstExists(false);
            
        if(!fire){
                fire = this.firesGroup.create(this.W+100,this.H/2+ry-40,'fire');
                fire.scale.setTo(2,2);
                fire.animations.add('glowingfire',[0,1],6,true);
                fire.animations.play('glowingfire');
        }
        else{
            fire.reset(this.W+100,this.H/2-40+ry);
        }
        fire.body.velocity.x = -200;
        
        
        this.firesGroup.setAll('body.immovable',true);
        this.firesGroup.setAll('body.allowGravity',false);
        
        
        
    },

    game_over:function(){
        this.collideSound.play();
        this.bird.angle = 90;
        alert("Game Over");
        this.game.state.start('Level1');
       
    }
    
}


// We have define our GameState(Level1) but we have not told
// State Manager to start our Game.

var game = new Phaser.Game(800,600,Phaser.CANVAS,'my-phaser-game');
// Add the state to state manager
game.state.add('Level1', GameState);
game.state.add('Level2', GameState2);
    
// Start the game by telling state manager which state(level) to start
game.state.start('Level2');

// HW
// Read about Tweens, Particles
// P2 Physics - Rotation Mechanics
// Tilemaps
// How to JSON data ?
