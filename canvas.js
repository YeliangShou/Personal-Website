const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//set the beginning screen black
//c.fillStyle = 'rgba(0, 0, 0, 1)'
//c.fillRect(0, 0, canvas.width, canvas.height);


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

//event listener for going home
window.addEventListener('click',function(){
	// setTimeout( function(){
	// 	document.location = 'Actual Website/homePage.html';
	// },3000);
	
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
	this.velocity = randInt(5,10)/250;
	this.constDist = randInt(100,400);
	this.distanceFromCentre = {
		x: this.constDist,
		y: this.constDist
	}
	this.distanceFromCentre3D = {
		x: randInt(100,400),
		y: randInt(100,400)
	}
	this.lastMouse = {
		x: x,
		y: y
	};

	this.update = function(){
		const lastPoint = {
			x: this.x,
			y: this.y
		};

		this.radians += this.velocity;
		//drag effect
		this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
		this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;

		// this.x = this.lastMouse.x + Math.cos(this.radians)* this.distanceFromCentre3D.x;
		// this.y = this.lastMouse.y + Math.sin(this.radians)* this.distanceFromCentre3D.y;
		//cool 3d circle effect made using above
		this.x = this.lastMouse.x + Math.cos(this.radians)*this.distanceFromCentre.x;
		this.y = this.lastMouse.y + Math.sin(this.radians)*this.distanceFromCentre.y;

		this.draw(lastPoint);

	};

	this.draw = lastPoint => {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
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
function init(){
	particles = [];
	const radius = randInt(10,15), numCircles = 60;

	for (var i = 0;i < numCircles;i++){
		particles.push(new Particle(canvas.width/2, canvas.height/2,
			radius, randCol(colours)));
	}
}

var numCircles = 60;
var decrease = [];
window.addEventListener('mousedown',function(){
	//for (var i = 0;i < numCircles; i++){
	particles.forEach(particle => {
		decrease.push((setInterval(function(){
			particle.distanceFromCentre.x -= randInt(100,400)/100;
			particle.distanceFromCentre.y -= randInt(100,400)/100;
			},100)
		));
	});	

	// particles.forEach(particle => {
	// 	decrease = setInterval(function(){
	// 		particle.distanceFromCentre.x -= randInt(100,400)/100;
	// 		particle.distanceFromCentre.y -= randInt(100,400)/100;
	// 	},100); 	
	// });
});

window.addEventListener('mouseup',function(){
	particles.forEach(particle => {
		//particle.distanceFromCentre.x = particle.constDist;
		//particle.distanceFromCentre.y = particle.constDist;
		clearInterval(decrease);
	});
});

//Animation loop
function animate(){
	requestAnimationFrame(animate);
	c.fillStyle = 'rgba(0, 0, 0, 0.05)'
	c.fillRect(0, 0, canvas.width, canvas.height);

	particles.forEach(particle =>{
		particle.update();
	});
}	

init();
animate()