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

//'random' functions

function randInt (min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);	
}

function randCol (colours){
	return colours[Math.floor(Math.random() * colours.length)];
}

//circle object
function Particle(x, y, radius, colour){
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.colour = colour;
	this.radians = randInt(0,Math.PI*2);
	this.velocity = randInt(5,10)/100;
	this.distanceFromCentre = randInt(50,120);
	this.lastMouse = {
		x: x,
		y: y
	};

	this.update = () => {
		const lastPoint = {
			x: this.x,
			y: this.y
		};

		this.radians += this.velocity;
		//drag effect
		this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
		this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;

		//this.x = x + Math.cos(this.radians)* this.distanceFromCentre.x;
		//this.y = y + Math.sin(this.radians)* this.distanceFromCentre.y;
		//cool 3d circle effect made using above
		this.x = this.lastMouse.x + Math.cos(this.radians)*this.distanceFromCentre;
		this.y = this.lastMouse.y + Math.sin(this.radians)*this.distanceFromCentre;

		this.draw(lastPoint);

	};

	this.draw = lastPoint => {
		c.beginPath();
		// c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
		// c.fillStyle = this.colour;
		// c.fill();
		// got rid of this because of ridges
		c.strokeStyle = this.colour;
		c.lineWidth = this.radius;
		c.moveTo(lastPoint.x, lastPoint.y);
		c.lineTo(this.x, this.y);
		c.stroke();
		c.closePath();
	};

}

//implementation
var particles;
function init(){
	particles = [];
	const radius = randInt(1,2);
	for (var i = 0;i < 50;i++){
		particles.push(new Particle(canvas.width/2, canvas.height/2,
			radius, randCol(colours)));
	}
}

//Animation loop
function animate(){
	requestAnimationFrame(animate);
	c.fillStyle = 'rgba(255, 255, 255, 0.05)'
	c.fillRect(0, 0, canvas.width, canvas.height);

	particles.forEach(particle =>{
		particle.update();
	});
}	

init();
animate()