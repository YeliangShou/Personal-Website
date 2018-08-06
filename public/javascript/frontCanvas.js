const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//set the beginning screen black
//c.fillStyle = 'rgba(0, 0, 0, 1)'
//c.fillRect(0, 0, canvas.width, canvas.height);

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

const colours = ["#00B182", "#008763", "#FFB51D", "#930B27", "#D3D3D3"];

//event listeners

window.addEventListener("mousemove", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //init();
});

//Goes through the canvas to the homepage
var enter = document.getElementsByClassName("enter");
enter[0].addEventListener("click", function() {
    setTimeout(function() {
        document.location = "./home.hbs";
    }, 3000);
});

//decreasing circle size and making it go bonkers
var particleCount = 0,
    decreasing = 0;

//Pushing mouse will initiate the circle becoming smaller
window.addEventListener("mousedown", function() {
    decreasing = 1;
});

window.addEventListener("mouseup", function() {
    decreasing = 0;
});

//'random' functions

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randCol(colours) {
    return colours[Math.floor(Math.random() * colours.length)];
}

//circle object
function Particle(x, y, radius, colour) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colour = colour;
    this.radians = randInt(0, Math.PI * 2);
    this.velocity = randInt(30, 80) / 2500;
    this.velocity3D = this.velocity * 4;
    var velocityIncrease = this.velocity / 25;
    var originalVelocity = this.velocity;
    this.constDist = randInt(window.innerHeight / 8, window.innerHeight / 2.5);
    this.distanceFromCentre = {
        x: -window.innerWidth / 1.5,
        y: -window.innerHeight / 1.5
        //just to start at a closer position for testing
        // x: -window.innerWidth/5,
        // y: -window.innerHeight/5
    };
    this.distanceFromCentre3D = {
        x: randInt(this.constDist / 6, this.constDist / 2),
        y: randInt(this.constDist / 6, this.constDist / 2)
    };
    var distChange = {
        x: 2,
        y: 2
    };

    this.lastMouse = {
        x: x,
        y: y
    };
    var alternate = {
        x: 0,
        y: 0
    };

    //Used to update the circles
    this.update = function() {
        const lastPoint = {
            x: this.x,
            y: this.y
        };

        this.radians += this.velocity;
        //drag effect
        this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
        this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;

        this.x =
            this.lastMouse.x +
            Math.cos(this.radians) * this.distanceFromCentre.x;
        this.y =
            this.lastMouse.y +
            Math.sin(this.radians) * this.distanceFromCentre.y;

        //returning the circle to the normal radius
        if (this.distanceFromCentre.x <= this.constDist && decreasing == 0) {
            this.distanceFromCentre.x += distChange.x + 1;
        }
        if (this.distanceFromCentre.y <= this.constDist && decreasing == 0) {
            this.distanceFromCentre.y += distChange.y + 1;
        }
        if (this.velocity > originalVelocity && decreasing == 0) {
            this.velocity -= velocityIncrease;
        }

        //making the circle shrink and go crazy at the middle
        if (
            this.distanceFromCentre.x <= this.constDist + 5 &&
            decreasing == 1
        ) {
            //creates 3D effect
            if (this.distanceFromCentre.x > this.distanceFromCentre3D.x) {
                this.distanceFromCentre.x -= distChange.x;
            } else if (
                this.distanceFromCentre.x <
                this.distanceFromCentre3D.x - 10
            ) {
                this.distanceFromCentre.x += distChange.x;
            }

            //Velocity is only being changed from the distance from X shouldn't be that big of a deal
            if (this.velocity < this.velocity3D) {
                this.velocity += velocityIncrease;
            }
        }
        if (
            this.distanceFromCentre.y <= this.constDist + 5 &&
            decreasing == 1
        ) {
            if (this.distanceFromCentre.y > this.distanceFromCentre3D.y) {
                this.distanceFromCentre.y -= distChange.y;
            } else if (
                this.distanceFromCentre.y <
                this.distanceFromCentre3D.y - 10
            ) {
                this.distanceFromCentre.y += distChange.y;
            }
            // else{
            // 	this.distanceFromCentre.y = this.distanceFromCentre3D.y;
            // }
        }

        this.draw(lastPoint);
    };

    this.draw = lastPoint => {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.colour;
        c.fill();
        // got rid of this because of ridges
        // c.strokeStyle = this.colour;
        // c.lineWidth = this.radius;
        // c.moveTo(lastPoint.x, lastPoint.y);
        // c.lineTo(this.x, this.y);
        c.strokeStyle = this.colour;
        c.stroke();
        c.closePath();
    };
}

//implementation
var particles;
function init() {
    particles = [];
    const radius = randInt(8, 10),
        numCircles = 60;

    for (var i = 0; i < numCircles; i++) {
        particles.push(
            new Particle(
                canvas.width / 2,
                canvas.height / 2,
                radius,
                randCol(colours)
            )
        );
    }
}

//Animation loop
function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = "rgba(0, 0, 0, 0.05)";
    c.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
    });
}

init();
animate();
