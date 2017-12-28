var app = {

    //CORDOVA
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        app.init();
    },

    //SENSORS
    initSensors: function () {
        var options = { frequency: 10 };
        var watchID = navigator.accelerometer.watchAcceleration(this.onSuccess, this.onError, options);
    },
    onSuccess: function (motion) {
        app.checkShaken(motion);

        vel_x = motion.x;
        vel_y = motion.y;
    },
    onError: function () {
        alert('Error!!');
    },

    //http://phaser.io/tutorials/making-your-first-phaser-game
    init: function () {
        BALL_SIZE = 50;
        vel_x = 0;
        vel_y = 0;

        score = 0;
        BOUNDARY_POINTS = -1;
        TARGET_POINTS = 10;

        clientHeight = document.documentElement.clientHeight;
        clientWidth = document.documentElement.clientWidth;

        app.initSensors();
        app.initGame();
    },
    initGame: function () {
        var states = { preload: preload, create: create, update: update };
        game = new Phaser.Game(clientWidth, clientHeight, Phaser.AUTO, '', states);

        //Loading Assets
        function preload() {
            game.stage.backgroundColor = 'rgb(68, 136, 170)';
            game.load.image('ball', 'assets/ball.png');
            game.load.image('target', 'assets/target.png');
        }

        //Creating sprites
        function create() {
            //BALL
            ball = game.add.sprite(app.getInitX(), app.getInitY(), 'ball');
            game.physics.arcade.enable(ball);

            //boundaries detection
            ball.body.collideWorldBounds = true;
            ball.body.onWorldBounds = new Phaser.Signal();
            ball.body.onWorldBounds.add(app.ballCollision, this);

            //TARGET
            target = game.add.sprite(app.getInitX(), app.getInitY(), 'target');
            game.physics.arcade.enable(target);

            //SCORE
            scoreText = game.add.text(16, 16, score, { fontSize: '100px', fill: '#FFFFFF' });
        }

        //Refres state
        function update() {
            var PHASER_GRAVITY = 300;

            //Update ball position
            ball.body.velocity.x = -vel_x * PHASER_GRAVITY;
            ball.body.velocity.y = vel_y * PHASER_GRAVITY;

            //Check if collision
            game.physics.arcade.overlap(ball, target, app.targetCollision, null, this);
        }
    },

    //COLLISIONS
    ballCollision: function () {
        app.updateScore(BOUNDARY_POINTS);
        game.stage.backgroundColor = '#f27d0c';

        setTimeout(() => {
            game.stage.backgroundColor = 'rgb(68, 136, 170)';
        }, 100);
    },
    targetCollision: function () {
        app.updateScore(TARGET_POINTS);
        game.stage.backgroundColor = 'rgb(00, 136, 00)';

        setTimeout(() => {
            game.stage.backgroundColor = 'rgb(68, 136, 170)';
        }, 500);

        target.body.x = app.getInitX();
        target.body.y = app.getInitY();
    },

    //EXTRA FUNCTIONS
    getInitX: function () {
        return app.getRandomNumber(clientWidth - BALL_SIZE);
    },

    getInitY: function () {
        return app.getRandomNumber(clientHeight - BALL_SIZE);
    },

    getRandomNumber: function (limit) {
        return Math.floor(Math.random() * limit);
    },

    updateScore: function (points) {
        score += points;
        scoreText.text = score;
    },

    checkShaken: function (motion) {
        var shakenX = Math.abs(motion.x) > 10;
        var shakenY = Math.abs(motion.y) > 10;

        if (shakenX || shakenY) {
            app.restart();
        }
    },
    restart: function () {
        document.location.reload(true);
    },

};

app.initialize();