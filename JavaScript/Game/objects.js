function collision(o1, o2) {
    return distanceBetween(o1, o2) < (o1.radius + o2.radius);
}
function distanceBetween(o1, o2) {
    return Math.sqrt(Math.pow(o1.x - o2.x, 2) + Math.pow(o1.y - o2.y,2));
}


class Mass{
    constructor(x, y, mass, radius, angle, xSpeed, ySpeed, rotationSpeed){
        this.x = x;
        this.y = y;
        this.mass = mass || 1;
        this.radius = radius || 50;
        this.angle = angle || 0;
        this.xSpeed = xSpeed || 0;
        this.ySpeed = ySpeed || 0;
        this.rotationSpeed = rotationSpeed || 0;
    }
    update(elapsed, c){
        this.x += this.xSpeed * elapsed;
        this.y += this.ySpeed * elapsed;
        this.angle += this.rotationSpeed * elapsed;
        this.angle %= (2 * Math.PI);
        if(this.x - this.radius > c.canvas.width) {
            this.x = -this.radius;
        }
        if(this.x + this.radius < 0) {
            this.x = c.canvas.width + this.radius;
        }
        if(this.y - this.radius > c.canvas.height) {
            this.y = -this.radius;
        }
        if(this.y + this.radius < 0) {
            this.y = c.canvas.height + this.radius;
        }
    }
    draw(c){
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        c.beginPath();
        c.arc(0, 0, this.radius, 0, 2 * Math.PI);
        c.lineTo(0, 0);
        c.strokeStyle = "#ffffff";
        c.stroke();
        c.restore();
    }
    push(angle, force, elapsed){
        this.xSpeed += elapsed * (Math.cos(angle) * force) / this.mass;
        this.ySpeed += elapsed * (Math.sin(angle) * force) / this.mass;
    }
    twist(force, elapsed){
        this.rotationSpeed += elapsed * force / this.mass;
    }
    speed(){
        return Math.sqrt(Math.pow(this.xSpeed, 2) + Math.pow(this.ySpeed, 2));
    }
    movementAngle(){
        return Math.atan2(this.ySpeed, this.xSpeed);
    }
}

class Ship extends Mass{
    constructor(x, y, mass, radius, power, weaponPower){
        super(x, y, mass, radius, 1.5 * Math.PI);
        this.thrusterPower = power;
        this.steeringPower = power/20;
        this.rightThruster = false;
        this.leftThruster = false;
        this.thrusterOn = false;
        this.trigger = false;
        this.loaded = false;
        this.weaponReloadTime = 0.25;
        this.timeUntilReloaded = this.weaponReloadTime;
        this.weaponPower = weaponPower || 200;
        this.compromised = false;
        this.maxHealth = 2.0;
        this.health = this.maxHealth;
    }
    update(elapsed, c){
        this.push(this.angle, this.thrusterOn * this.thrusterPower, elapsed);
        this.twist((this.rightThruster - this.leftThruster) * this.steeringPower, elapsed);
        // reload as necessary
        this.loaded = this.timeUntilReloaded === 0;
        if(!this.loaded){
            this.timeUntilReloaded -= Math.min(elapsed, this.timeUntilReloaded);
        }
        if(this.compromised){
            this.health -= Math.min(elapsed, this.health);
        }
        super.update(elapsed, c);
    }
    draw(c, guide){
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        if(guide && this.compromised){
            c.save();
            c.fillStyle = "red";
            c.beginPath();
            c.arc(0, 0, this.radius, 0, 2 * Math.PI);
            c.fill();
            c.restore();
        }
        drawShip(c, this.radius, {guide: guide, thruster: this.thrusterOn});
        c.restore();
    }
    projectile(elapsed){
        var p = new Projectile(0.025, 1, this.x + Math.cos(this.angle) * this.radius,
                        this.y + Math.sin(this.angle) * this.radius,
                        this.xSpeed, this.ySpeed, this.rotationSpeed);
        p.push(this.angle, this.weaponPower, elapsed);
        this.push(this.angle + Math.PI, this.weaponPower, elapsed);
        this.timeUntilReloaded = this.weaponReloadTime;
        return p;
    }
}

class Projectile extends Mass {
    constructor(mass, lifetime, x, y, xSpeed, ySpeed, rotationSpeed){
        var density = 0.001;
        var radius = Math.sqrt((mass / density) / Math.PI);
        super(x, y, mass, radius, 0, xSpeed, ySpeed, rotationSpeed);
        this.lifetime = lifetime;
        this.life = 1.0;
    }
    update(elapsed, c){
        this.life -= (elapsed/this.lifetime);
        super.update(elapsed, c);
    }
    draw(c, guide){
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        drawProjectile(c, this.radius, this.life, guide);
        c.restore();
    }
}

class Asteroid extends Mass{
    constructor(x, y, mass, xSpeed, ySpeed, rotationSpeed){
        var density = 1; // kg per square pixel
        var radius = Math.sqrt((mass/density) / Math.PI);
        super(x, y, mass, radius, 0, xSpeed, ySpeed, rotationSpeed);
        this.circumference = 2 * Math.PI * this.radius;
        this.segments = Math.ceil(this.circumference / 15);
        this.segments = Math.min(25, Math.max(5, this.segments));
        this.noise = 0.2;
        this.shape = [];
        for(var i = 0; i < this.segments; i++){
            this.shape.push(Math.random() - 0.5);
        }
    }
    draw(c, guide){
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        drawAsteroid(c, this.radius, this.shape, {guide: guide, noise: this.noise});
        c.restore();
    }
    child(mass){
        return new Asteroid(this.x, this.y, mass, this.xSpeed, this.ySpeed, this.rotationSpeed);
    }
}

class Indicator{
    constructor(label, x, y, width, height){
        this.label = label + ": ";
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw(c, max, level){
        c.save();
        c.strokeStyle = "white";
        c.fillStyle = "white";
        c.font = this.height + "pt Arial";
        var offset = c.measureText(this.label).width;
        c.fillText(this.label, this.x, this.y + this.height - 1);
        c.beginPath();
        c.rect(offset + this.x, this.y, this.width, this.height);
        c.stroke();
        c.beginPath();
        c.rect(offset + this.x, this.y, this.width * (level/max), this.height);
        c.fill();
        c.restore();
    }
}

class NumberIndicator{
    constructor(label, x, y, options){
        options = options || {};
        this.label = label + ": ";
        this.x = x;
        this.y = y;
        this.digits = options.digits || 0;
        this.pt = options.pt || 10;
        this.align = options.align || 'end';
    }
    draw(c, value){
        c.save();
        c.fillStyle = "white";
        c.font = this.pt + "pt Arial";
        c.textAlign = this.align;
        c.fillText(this.label + value.toFixed(this.digits), this.x, this.y + this.pt - 1);
        c.restore();
    }
}

class Message{
    constructor(x, y, options){
        options = options || {};
        this.x = x;
        this.y = y;
        this.mainPt = options.mainPt || 28;
        this.subPt = options.subPt || 18;
        this.fill = options.fill || "white";
        this.textAlign = options.textAlign || 'center';
    }
    draw(c, main, sub){
        c.save();
        c.fillStyle = this.fill;
        c.textAlign = this.textAlign;
        c.font = this.mainPt + "pt Arial";
        c.fillText(main, this.x, this.y);
        c.font = this.subPt + "pt Arial";
        c.fillText(sub, this.x, this.y + this.mainPt);
        c.restore();
    }
}

// ----------------------- PacMan---------------------------------------------------------------------------------------
class Pacman{
    constructor(x, y, radius, speed){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.angle = 0;
        this.xSpeed = speed;
        this.ySpeed = 0;
        this.time = 0;
        this.mouth = 0;
    }
    draw(c){
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        drawPacman(c, this.radius, this.mouth);
        c.restore();
    }
    moveRight(){
        this.xSpeed = this.speed;
        this.ySpeed = 0;
        this.angle = 0;
    }
    moveDown(){
        this.xSpeed = 0;
        this.ySpeed = this.speed;
        this.angle = 0.5 * Math.PI;
    }
    moveLeft(){
        this.xSpeed = -this.speed;
        this.ySpeed = 0;
        this.angle = Math.PI;
    }
    moveUp(){
        this.xSpeed = 0;
        this.ySpeed = -this.speed;
        this.angle = 1.5 * Math.PI;
    }
    update(elapsed, width, height){
        if(this.x - this.radius + elapsed * this.xSpeed > width) {
            this.x = -this.radius;
        }
        if(this.x + this.radius + elapsed * this.xSpeed < 0) {
            this.x = width + this.radius;
        }
        if(this.y - this.radius + elapsed * this.ySpeed > height) {
            this.y = -this.radius;
        }
        if(this.y + this.radius + elapsed * this.ySpeed < 0) {
            this.y = height + this.radius;
        }
        this.x += this.xSpeed * elapsed;
        this.y += this.ySpeed * elapsed;
        this.time += elapsed;
        this.mouth = Math.abs(Math.sin(2 * Math.PI * this.time));
    }
}

class Ghost{
    constructor(x, y, radius, speed, colour){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.colour = colour;
    }
    draw(c){
        c.save();
        c.translate(this.x, this.y);
        draw_ghost(c, this.radius, {fill: this.colour});
        c.restore();
    }
    update(target, elapsed){
        var angle = Math.atan2(target.y - this.y, target.x - this.x);
        var xSpeed = Math.cos(angle) * this.speed;
        var ySpeed = Math.sin(angle) * this.speed;
        this.x += xSpeed * elapsed;
        this.y += ySpeed * elapsed;
    }
}