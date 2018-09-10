function drawGrid(ctx, minor, major, stroke, fill){
    minor = minor || 10;
    major = major || minor * 5;
    stroke = stroke ||"#00ff00";
    fill = fill || "#009900";

    ctx.save();
    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;
    let width = ctx.canvas.width, height = ctx.canvas.height;

    for(var x = 0; x < width; x += minor){
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.lineWidth = (x % major == 0) ? 0.5 : 0.25;
        ctx.stroke();
        if(x % major == 0){
            ctx.fillText(x, x, 10);
        }
    }
    for(var y = 0; y < height; y += minor){
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.lineWidth = (y % major == 0) ? 0.5 : 0.25;
        ctx.stroke();
        if(y % major == 0){
            ctx.fillText(y, 0, y + 10);
        }
    }
    ctx.restore();
}

function drawShip(ctx, radius, options){
    options = options || {};

    ctx.save();
    // optional Anzeigen von Kollision radius
    if(options.guide){
        ctx.strokeStyle = "white";
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }
    let angle = (options.angle || 0.5 * Math.PI) / 2;
    // Feuer
    if(options.thruster){
        ctx.save();
        ctx.strokeStyle = "yellow";
        ctx.fillStyle = "red";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(Math.cos(Math.PI + angle * 0.8) * radius / 2, Math.sin(Math.PI + angle * 0.8) * radius / 2);
        ctx.quadraticCurveTo(-radius * 2, 0, Math.cos(Math.PI - angle * 0.8) * radius / 2, Math.sin(Math.PI - angle * 0.8) * radius / 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    // settings
    ctx.lineWidth = options.lineWidth || 2;
    ctx.strokeStyle = options.stroke || "white";
    ctx.fillStyle = options.fill || "black";
    let curve1 = options.curve1 || 0.5;
    let curve2 = options.curve2 || 0.85;
    // draw ship
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.quadraticCurveTo(
        Math.cos(angle) * radius * curve2,
        Math.sin(angle) * radius * curve2,
        Math.cos(Math.PI - angle) * radius,
        Math.sin(Math.PI - angle) * radius
    );
    ctx.quadraticCurveTo(radius * curve1 - radius, 0,
        Math.cos(Math.PI + angle) * radius,
        Math.sin(Math.PI + angle) * radius
    );
    ctx.quadraticCurveTo(
        Math.cos(-angle) * radius * curve2,
        Math.sin(-angle) * radius * curve2,
        radius, 0
    );
    ctx.fill();
    ctx.stroke();

    // optional Kontrollpunkte von curves
    if(options.guide){
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(
            Math.cos(-angle) * radius,
            Math.sin(-angle) * radius
        );
        ctx.lineTo(0, 0);
        ctx.lineTo(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius
        );
        ctx.moveTo(-radius, 0);
        ctx.lineTo(0, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(
            Math.cos(angle) * radius * curve2,
            Math.sin(angle) * radius * curve2,
            radius/40, 0, 2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
            Math.cos(-angle) * radius * curve2,
            Math.sin(-angle) * radius * curve2,
            radius/40, 0, 2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(radius * curve1 - radius, 0, radius/50, 0, 2 * Math.PI);
        ctx.fill();
    }

    ctx.restore();
}

function drawProjectile(ctx, radius, lifetime){
    ctx.fillStyle = "rgb(100%, 100%, " + (100 * lifetime) + "%";
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
}

function drawAsteroid(ctx, radius, shape, options){
    options = options || {};
    ctx.strokeStyle = options.stroke || "white";
    ctx.fillStyle = options.fill || "black";
    ctx.save();
    ctx.beginPath();
    for(let i = 0; i < shape.length; i++){
        ctx.rotate(2 * Math.PI / shape.length);
        ctx.lineTo(radius + radius * options.noise *shape[i], 0);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if(options.guide){
        // line für Kollision
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.stroke();
        // lines für äußerster und innerster Radius
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.arc(0, 0, radius + options.noise * radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, radius - options.noise * radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
    ctx.restore();
}

function drawLine(ctx, o1, o2){
    ctx.save();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(o1.x, o1.y);
    ctx.lineTo(o2.x, o2.y);
    ctx.stroke();
    ctx.restore();
}

function drawPacman(ctx, radius, mouth){
    let angle = 0.2 * Math.PI * mouth;
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, radius, angle, -angle);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.5;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function drawRandPacmans(ctx){
    var minRadius = 5;
    var maxRadius = 50;

    do {
        let x = ctx.canvas.width * Math.random();
        let y = ctx.canvas.height * Math.random();
        let radius = minRadius + maxRadius * Math.random()
        drawPacman(x,y,radius,Math.random());
    }
    while(Math.random() < 0.9);
}

function draw_ghost(ctx, radius, options) {
    options = options || {}
    var feet = options.feet || 4;
    var head_radius = radius * 0.8;
    var foot_radius = head_radius / feet;
    ctx.save();
    ctx.strokeStyle = options.stroke || "white";
    ctx.fillStyle = options.fill || "red";
    ctx.lineWidth = options.lineWidth || radius * 0.05;
    ctx.beginPath();
    for(foot = 0; foot < feet; foot++) {
        ctx.arc(
            (2 * foot_radius * (feet - foot)) - head_radius - foot_radius,
            radius - foot_radius,
            foot_radius, 0, Math.PI
        );
    }
    ctx.lineTo(-head_radius, radius - foot_radius);
    ctx.arc(0, head_radius - radius, head_radius, Math.PI, 2 *Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "white";
    // Augen
    ctx.beginPath();
    ctx.arc(-0.3 * head_radius, -0.63 * head_radius, head_radius * 0.3, 0, 2 * Math.PI);
    ctx.arc(0.3 * head_radius, -0.63 * head_radius, head_radius*0.3, 0, 2*Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(-0.4 * head_radius, -0.55 * head_radius, head_radius*0.12, 0, 2*Math.PI);
    ctx.arc(0.2 * head_radius, -0.55 * head_radius, head_radius*0.12, 0, 2*Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}