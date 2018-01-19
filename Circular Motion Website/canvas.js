const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2
}

const colours = [
	"#00B182",
	'#008763',
	'#FFB51D',
	'#930B27',
	'#D3D3D3',
];

//event listeners

window.addEventListener('mousemove',function(event){
	mouse.x = event.x;
	mouse.y = event.y;
});

window.addEventListener('resize', function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	init();
});

function randInt (min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);	
}

function randCol (colours){
	return colours[Math.floor(Math.random() * colors.length)];
}

//circle object
function Particle(x, y, radius, colour){
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.colour = colour;
	this.radians = Math.random() * Math.PI*2;
	this.velocity = 0.05;
	this.distanceFromCentre = {
		x:randInt(50,120), 
		y:randInt(50,120)
	};

	this.update = () => {
		this.radians += this.velocity;
		this.x = x + Math.cos(this.radians)* this.distanceFromCentre.x;
		this.y = y + Math.sin(this.radians)* this.distanceFromCentre.y;

		this.draw();

	};

	this.draw = () => {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
		c.fillStyle = this.colour;
		c.fill();
		c.closePath();
	};

}

//implementation
var particles;
function init(){
	particles = [];

	for (var i = 0;i < 50;i++){
		particles.push(new Particle(canvas.width/2, canvas.height/2,5,'blue'));
	}
}

//Animation loop
function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);

	particles.forEach(particle =>{
		particle.update();
	});
}	

init();
animate()