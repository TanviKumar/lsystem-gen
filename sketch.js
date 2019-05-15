let canvas_width = 800, canvas_height = 800;
let factor, axiom, rule1, rule2;
let startx, starty;
let iterations, len, angle, thickness;
let bgColor, color1, color2;
let myCanvas;
let tessel = false;
let keepOld = false;

function lsystem() {
	this.angle = 0;
	this.axiom = "F";
	this.sentence = this.axiom;
	this.len = 400;
	this.factor = 2;
	this.weight = [];
	this.branchValue = 1;
	this.check = false;
	this.alphabet= ["F", "f", "X", "x", "Y", "y", "[", "]", "+", "-"];
	this.rules = [];
	this.rules[0] = {
	  	letter: "",
		becomes: "",
		alternate: ""
	};
	this.rules[1] = {
		letter: "",
		becomes: "",
		alternate: ""
	};
}

lsystem.prototype.generate = function() {
	this.len *= this.factor; //So the tree becomes denser instead of larger.
	this.branchValue += 1; //To ensure increased thickness of trunk.
	let nextSentence = "";
	for (let i = 0; i < this.sentence.length; i++) {
		let current = this.sentence.charAt(i);
		if(current == current.toLowerCase()) {
			current = current.toUpperCase();
		}
		let found = false;
	
		if (current == this.rules[0].letter) {
			found = true;
			if (this.rules[0].alternate != "") {
				if (Math.random() > 0.5) {
					nextSentence += this.rules[0].alternate;
				} else {
					nextSentence += this.rules[0].becomes;
				}
			} else {
				nextSentence += this.rules[0].becomes;
			}
		} else if (current == this.rules[1].letter) {
			found = true;
			if (this.rules[1].alternate != "") {
				if (Math.random() > 0.5) {
					nextSentence += this.rules[1].alternate;
				} else {
					nextSentence += this.rules[1].becomes;
				}
			} else {
				nextSentence += this.rules[1].becomes;
			}
		}
		
		if (!found) {
			nextSentence += current;
		}
	}
	this.sentence = nextSentence;
}

lsystem.prototype.draw = function() {
	resetMatrix();
	translate(startx.value, starty.value);

	this.angle = angle.value;
	this.factor = factor.value;
	this.axiom = axiom.value;
	this.len   = len.value;
	this.weight = thickness.value;

	// For first rule
	let turtles = rule1.value.split("=");
	this.rules[0].letter = turtles[0];
	let rule = turtles[1].split(",");
	this.rules[0].becomes = rule[0];
	if (rule[1])
		this.rules[0].alternate = rule[1];
	else
		this.rules[0].alternate = "";

	// For second rule
	turtles = rule2.value.split("=");
	this.rules[1].letter = turtles[0];
	rule = turtles[1].split(",");
	this.rules[1].becomes = rule[0];
	if (rule[1])
		this.rules[1].alternate = rule[1];
	else
		this.rules[1].alternate = "";

	// Start the L System
	this.sentence = this.axiom;
	this.generate();
	for (let iter = 1; iter < iterations.value; ++iter) {
		this.generate();
	}

	let fromColor = color(color1.value);
	let toColor = color(color2.value);
	// Drawing the L System
	for (let i = 0; i < this.sentence.length; i++) {
    	let current = this.sentence.charAt(i);
	    if (current == "F" || current == "f") {
			strokeWeight(thickness.value);
			stroke(lerpColor(fromColor, toColor, i / this.sentence.length));
	        line(0, 0, 0, -this.len);
			translate(0, -this.len);
			for (let time = 0; time < 1000; ++time){
			};
	    } 
	    else if (current == "+") {
	      	rotate(this.angle);
	    } 
	    else if (current == "-") {
	        rotate(-this.angle);
	    } 
	    else if (current == "[") {
	    	this.branchValue -= 1;	
	        push();
	    } 
	    else if (current == "]") {
	    	this.branchValue += 1;
	        pop();
    	}
	}
}

function preload() {
	myCanvas = createCanvas(canvas_width, canvas_height);
	myCanvas.parent("mainDiv");
	angleMode(DEGREES);
	factor = document.getElementById("factor");
	axiom = document.getElementById("axiom");
	rule1 = document.getElementById("rule1");
	rule2 = document.getElementById("rule2");
	startx = document.getElementById("startx");
	starty = document.getElementById("starty");
	iterations = document.getElementById("iterations");
	len = document.getElementById("len");
	angle = document.getElementById("angle");
	thickness = document.getElementById("thickness");
	bgColor = document.getElementById("bgColor");
	color1 = document.getElementById("color1");
	color2 = document.getElementById("color2");
}

function setup() {
	myCanvas = createCanvas(canvas_width, canvas_height);
	myCanvas.parent("mainDiv");
	background(10);
	fill(bgColor.value);
	rect(0, 0, width, height);
	if (tessel == true) {
		for (let i = 0; i < 2; ++i) {
			if (i != 0) {
				startx.value = 550;
				starty.value = 550;
			} else {
				startx.value = 300;
				starty.value = 300;
			}
			let lObject = new lsystem();
			lObject.draw();
		}
	} else {
		keepOld = false;
		let lObject = new lsystem();
		lObject.draw();
	}
}

function setValues(f, ax, r1, r2, sx, sy, iter, l, ang, c1, c2) {
	factor.value = f;
	axiom.value = ax;
	rule1.value = r1;
	rule2.value = r2;
	startx.value = sx;
	starty.value = sy;
	iterations.value = iter;
	len.value = l;
	angle.value = ang;
	color1.value = c1;
	color2.value = c2;	
}

function setPattern(event) {
	tessel = false;
	if (event.target.innerText == "Peano") {
		setValues(0.3, "X",
				"X=XFYFX+F+YFXFY-F-XFYFX",
				"Y=YFXFY-F-XFYFX+F+YFXFY",
				25, 775, 1, 1000, 90, "#FF0077", "#00006F");
	} else if (event.target.innerText == "Hilbert") {
		setValues(0.5, "X",
				"X=+YF-XFX-FY+",
				"Y=-XF+YFY+FX-",
				25, 775, 1, 700, 90, "#FF0077", "#00006F");	
	} else if (event.target.innerText == "Q Gosper") {
		setValues(0.2, "-YF",
				"X=XFX-YF-YF+FX+FX-YF-YFFX+YF+FXFXYF-FX+YF+FXFX+YF-FXYF-YF-FX+FX+YFYF-",
				"Y=+FXFX-YF-YF+FX+FXYF+FX-YFYF-FX-YF+FXYFYF-FX-YFFX+FX+YF-YF-FX+FX+YFY",
				795, 795, 1, 750, 90, "#FFFFFF", "#00006F");	
	} else if (event.target.innerText == "Koch") {
		setValues(0.25, "F+F+F+F",
				"F=F+F-F-FF+F+F-F",
				"X=X",
				175, 625, 1, 450, 90, "#ED5B5B", "#5E04A7");
	} else if (event.target.innerText == "Pentaplex") {
		setValues(0.4, "F++F++F++F++F",
				"F=F++F++F+++++F-F++F",
				"X=X",
				25, 625, 1, 350, 36, "#ED5B5B", "#5E04A7");
	} else if (event.target.innerText == "Dragon") {
		setValues(0.7, "FX",
				"X=X+YF+",
				"Y=-FX-Y",
				350, 400, 1, 250, 90, "#ED5B5B", "#5E04A7");
	} else if (event.target.innerText == "Tessel") {
		tessel = true;
		setValues(0.707, "[FX]+[FX]+[FX]+[FX]",
				"X=X+YF+",
				"Y=-FX-Y",
				350, 400, 1, 250, 90, "#ED5B5B", "#5E04A7");
	} else if (event.target.innerText == "S Square") {
		setValues(0.5, "F+XF+F+XF",
				"X=XF-F+F-XF+F+XF-F+F-X",
				"Y=Y",
				100, 425, 1, 150, 90, "#FF0000", "#FFFF00");
	} else if (event.target.innerText == "Peano-C") {
		setValues(0.25,"F",
				"F=F+F-F-FF+F+F-F",
				"X=X",
				175, 625, 1, 450, 90, "#FF0000", "#FFFF00");	
	} else if (event.target.innerText == "S Carpet") {
		setValues(0.33, "F",
				"F=FFF[+FFF+FFF+FFF]",
				"X=X",
				25, 775, 1, 750, 90, "#FF0000", "#FF00FF");
	} else if (event.target.innerText == "Terdragon") {
		setValues(0.6, "F",
				"F=F+F-F",
				"Y=Y",
				475, 275, 1, 300, 120, "#FF0000", "#BF00FF");
	} else if (event.target.innerText == "Gosper") {
		setValues(0.4, "XF",
				"X=X+YF++YF-FX--FXFX-YF+",
				"Y=-FX+YFYF++YF+FX--FX-Y",
				200, 350, 1, 350, 60, "#00F8FF", "#0A00D5");
	} else if (event.target.innerText == "Weed") {
		setValues(0.5, "F",
				"F=F[-F]F[+F]F",
				"X=X",
				400, 800, 1, 150, 30, "#00FF14", "#F9FF00");
	} else if (event.target.innerText == "Tree 1") {
		setValues(0.5, "X",
				"X=F+[[X]-X]-F[-FX]+X",
				"F=FF",
				500, 800, 1, 300, 25, "#00FF14", "#F9FF00");
	} else if (event.target.innerText == "Tree 2") {
		setValues(0.5, "F",
				"F=FF[++F[-F]+F][F[+F]-F][--F[+F]-F]",
				"X=X",
				400, 800, 1, 250, 25, "#FF0000", "#F9FF00");
	} else if (event.target.innerText == "Tree 3") {
		setValues(0.5, "F",
				"F=FF[--F+FF+F][+F-F-F]",
				"X=X",
				500, 800, 1, 200, 25, "#00FF14", "#0A00D5");
	}

	setup();
}
