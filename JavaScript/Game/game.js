class AsteroidsGame{
    constructor(id){
        // TODO: WAS macht bind()??
        this.canvas = document.getElementById(id);
        this.c = this.canvas.getContext("2d");
        this.canvas.focus();
        this.guide = false;
        this.shipMass = 10;
        this.shipRadius = 15;
        this.asteroidMass = 5000;
        this.asteroidPush = 500000;
        this.massDestroyed = 500;
        this.score = 0;
        this.level = 0;
        this.gameOver = false;

        this.ship = new Ship(this.canvas.width / 2, this.canvas.height / 2, this.shipMass, this.shipRadius, 1000, 200);
        this.projectiles = [];
        this.asteroids = [];
        this.levelUp();
        this.canvas.addEventListener("keydown", this.keyDown.bind(this), true);
        this.canvas.addEventListener("keyup", this.keyUp.bind(this), true);

        this.healthIndicator = new Indicator("Health", 5, 5, 100, 10);
        this.scoreIndicator = new NumberIndicator("Score", this.canvas.width - 10, 5);
        this.levelIndicator = new NumberIndicator("Level", this.canvas.width/2, 5, {align: "center"});
        this.fpsIndicator = new NumberIndicator("FPS", this.canvas.width - 10, this.canvas.height - 15, {digits:2});
        this.message = new Message(this.canvas.width/2, this.canvas.height * 0.4, {fill: "red"});

        window.requestAnimationFrame(this.frame.bind(this));
    }
    resetGame(){
        this.gameOver = false;
        this.score = 0;
        this.level = 0;
        this.ship = new Ship(this.canvas.width / 2, this.canvas.height / 2, this.shipMass, this.shipRadius, 1000, 200);
        this.projectiles = [];
        this.asteroids = [];
        this.levelUp();
    }
    levelUp(){
        this.level += 1;
        for(var i = 0; i < this.level; i++){
            this.asteroids.push(this.movingAsteroid());
        }
    }
    movingAsteroid(elapsed){
        var asteroid =this.newAsteroid();
        this.pushAsteroid(asteroid, elapsed);
        return asteroid;
    }
    newAsteroid(){
        return new Asteroid(this.canvas.width * Math.random(), this.canvas.height * Math.random(), this.asteroidMass);
    }
    pushAsteroid(asteroid, elapsed){
        elapsed = elapsed || 0.015;
        asteroid.push(2* Math.PI * Math.random(), this.asteroidPush, elapsed);
        asteroid.twist((Math.random() - 0.5) * Math.PI * this.asteroidPush * 0.02, elapsed);
    }
    keyDown(e) {
        this.keyHandler(e, true);
    }
    keyUp(e) {
        this.keyHandler(e, false);
    }
    keyHandler(e, value){
        var nothingHandled = false;
        switch(e.key || e.keyCode){
            case "ArrowUp":
            case 38:
                this.ship.thrusterOn = value;
                break;
            case "ArrowLeft":
            case 37:
                this.ship.leftThruster = value;
                break;
            case "ArrowRight":
            case 39:
                this.ship.rightThruster= value;
                break;
            case " ":
            case 32: // leertaste
                if(this.gameOver){
                    this.resetGame();
                }
                else{
                    this.ship.trigger = value;
                }
                break;
            case "g":
            case 71:
                if(value) this.guide = ! this.guide;
                break;
            default:
                nothingHandled = true;
        }
        if(!nothingHandled) e.preventDefault(); // um Aktionen im Browser mit den Taster zu erlauben, wenn canvas nicht fokussiert ist
    }
    frame(timestamp) {
        if(!this.previous) this.previous = timestamp;
        var elapsed = timestamp - this.previous;
        this.fps = 1000 / elapsed;
        this.update(elapsed/1000);
        this.draw();
        this.previous = timestamp;
        window.requestAnimationFrame(this.frame.bind(this));
    }
    update(elapsed){
        if(this.asteroids.length == 0){
            this.levelUp();
        }
        this.ship.compromised = false;
        this.asteroids.forEach(function (asteroid) {
            asteroid.update(elapsed, this.c);
            if(collision(asteroid, this.ship)){
                this.ship.compromised = true;
            }
        }, this);
        if(this.ship.health <= 0){ // GAMEOVER
            this.gameOver = true;
            return;
        }
        this.ship.update(elapsed, this.c);
        this.projectiles.forEach(function (p, i, projectiles) {
            p.update(elapsed, this.c);
            if(p.life <= 0){
                projectiles.splice(i, 1);
            }
            else{
                this.asteroids.forEach(function (asteroid, j) {
                    if(collision(asteroid, p)){
                        projectiles.splice(i, 1);
                        this.asteroids.splice(j, 1);
                        this.splitAsteroid(asteroid, elapsed);
                    }
                }, this);
            }
        }, this);
        if(this.ship.trigger && this.ship.loaded){
            this.projectiles.push(this.ship.projectile(elapsed));
        }
    }
    draw(){
        this.c.clearRect(0,0,this.canvas.width, this.canvas.height);
        if(this.guide){
            drawGrid(this.c);
            this.asteroids.forEach(function (asteroid) {
                drawLine(this.c, asteroid, this.ship);
                this.projectiles.forEach(function (p) {
                    drawLine(this.c, p, asteroid);
                }, this);
            }, this);
            this.fpsIndicator.draw(this.c, this.fps);
        }
        this.asteroids.forEach(function (asteroid) {
            asteroid.draw(this.c, this.guide);
        }, this);
        if(this.gameOver){
            this.message.draw(this.c, "GAME OVER lil bitch :)", "Press space to play again", {fill: "red"});
            return;
        }
        this.ship.draw(this.c, this.guide);
        this.projectiles.forEach(function (p) {
            p.draw(this.c);
        }, this);
        this.healthIndicator.draw(this.c, this.ship.maxHealth, this.ship.health);
        this.scoreIndicator.draw(this.c, this.score);
        this.levelIndicator.draw(this.c, this.level);
    }
    splitAsteroid(asteroid, elapsed){
        asteroid.mass -= this.massDestroyed;
        this.score += this.massDestroyed;
        var split = 0.25 + 0.5 * Math.random(); // split unevenly
        var ch1 = asteroid.child(asteroid.mass * split);
        var ch2 = asteroid.child(asteroid.mass * (1-split));
        [ch1, ch2].forEach(function (child) {
            if(child.mass < this.massDestroyed){
                this.score += child.mass;
            }
            else{
                this.pushAsteroid(child, elapsed);
                this.asteroids.push(child);
            }
        }, this);
    }
}