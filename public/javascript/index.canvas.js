const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
canvas.width = windowWidth;
canvas.height = windowHeight;

//set the beginning screen black
// c.fillStyle = "rgba(0, 0, 0, 1)";
// c.fillRect(0, 0, canvas.width, canvas.height);

const mouse = {
    x: windowWidth / 2,
    y: windowHeight / 2
};

const colours = ["#00B182", "#008763", "#FFB51D", "#930B27", "#D3D3D3"];

// Event Listeners
window.addEventListener("mousemove", event => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener("resize", () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    canvas.width = windowWidth;
    canvas.height = windowHeight;

    init();
});

//Goes through the canvas to the homepage
var welcome_btn = document.getElementsByClassName("welcome-btn");
welcome_btn[0].addEventListener("click", () => {
    setTimeout(() => {
        document.location = "./home.hbs";
    }, 3000);
});

var particleCount = 0;
var decreasing = 0;

//Pushing mouse will initiate the circle becoming smaller
window.addEventListener("mousedown", () => {
    decreasing = 1;
    $("body").css({ cursor: "grabbing" });
});

window.addEventListener("mouseup", () => {
    decreasing = 0;
    $("body").css({ cursor: "grab" });
});

//'random' functions
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function randFloat(min, max) {
    return Math.random() * (max - min + 1) + min;
}
function randCol(colours) {
    return colours[Math.floor(Math.random() * colours.length)];
}

//circle object
function Particle(x, y, angle, radius, colour) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.colour = colour;
    // Initial angle
    this.radians = angle;
    this.velocity = randInt(30, 80) / 2500;
    this.velocity3D = this.velocity * 4;
    var velocityIncrease = this.velocity / 25;
    var originalVelocity = this.velocity;
    this.constDist = randInt(windowHeight / 8, windowHeight / 2.5);
    // Current distance from centre
    this.distanceFromCentre = {
        x: Math.abs(this.x - this.constDist),
        y: Math.abs(this.y - this.constDist)
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
        x: this.x,
        y: this.y
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

        // Circular movement
        this.x =
            this.lastMouse.x +
            Math.cos(this.radians) * this.distanceFromCentre.x;
        this.y =
            this.lastMouse.y +
            Math.sin(this.radians) * this.distanceFromCentre.y;

        //returning the circle to the normal radius
        if (decreasing == 0) {
            if (this.distanceFromCentre.x <= this.constDist) {
                this.distanceFromCentre.x += distChange.x + 1;
            } else if (
                this.distanceFromCentre.x >=
                this.constDist + distChange.x * 2
            ) {
                this.distanceFromCentre.x -= distChange.x + 1;
            }
            if (this.distanceFromCentre.y <= this.constDist) {
                this.distanceFromCentre.y += distChange.y + 1;
            } else if (
                this.distanceFromCentre.y >=
                this.constDist + distChange.y * 2
            ) {
                this.distanceFromCentre.y -= distChange.y + 1;
            }

            if (this.velocity > originalVelocity) {
                this.velocity -= velocityIncrease;
            }
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
        // Drawing by creating circles
        // c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        // c.fillStyle = this.colour;
        // c.fill();
        // c.strokeStyle = this.colour;

        // Drawing with lines instead of creating circles
        c.lineJoin = "round";
        c.lineCap = "round";
        c.strokeStyle = this.colour;
        c.lineWidth = this.radius * 1.75;
        c.moveTo(lastPoint.x, lastPoint.y);
        c.lineTo(this.x, this.y);
        c.stroke();

        c.closePath();
    };
}

//implementation
var particles;
function init() {
    particles = [];
    const radius = randInt(windowWidth / 200, windowWidth / 175),
        numCircles = 60;

    for (var i = 0; i < numCircles; i++) {
        let randAngle = randFloat(0, Math.PI * 2);
        let beginningDistance = {
            x: Math.cos(randAngle) * windowWidth + windowWidth / 8,
            y: Math.sin(randAngle) * windowWidth
        };
        particles.push(
            new Particle(
                beginningDistance.x,
                beginningDistance.y,
                randAngle,
                radius,
                randCol(colours)
            )
        );
    }
}

//Animation loop
function animate() {
    requestAnimationFrame(animate);
    // Filling the screen black creates trailing effect
    c.fillStyle = "rgba(0, 0, 0, 0.05)";
    c.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
    });
}

init();
animate();
