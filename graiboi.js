// Many thanks to:
// @Gordon http://forum.espruino.com/profiles/224/
// @Robin http://forum.espruino.com/profiles/116219/
// @allObjects http://forum.espruino.com/profiles/1922/
// @SimonGAndrews http://forum.espruino.com/profiles/177555/
// who have helped me understand the MPR121 module and many other things

require("Storage");

I2C1.setup({scl:B8,sda:B9});
var mpr1;
var lastKeyPressed = 0;
var speaker1 = B3;
var speaker2 = B13;

var bend = C0;
var note;
var pwm;

var step = 0;
require("Encoder").connect(C6,C7,function (direction) {
  step += direction;
  print(step);
});

// https://en.wikipedia.org/wiki/Piano_key_frequencies#

var freq01 = 261.6256;   //C4
var freq02 = 277.1826;   //Co4/Dm4
var freq03 = 293.6648;   //D4
var freq04 = 311.1270;   //Do4/Em4
var freq05 = 329.6276;   //E4
var freq06 = 349.2282;   //F4
var freq07 = 369.9944;   //Fo4/Gm4
var freq08 = 391.9954;   //G4
var freq09 = 415.3047;   //Go4/Am4
var freq10 = 440.0000;   //A4
var freq11 = 466.1638;   //Ao4/Bm4
var freq12 = 493.8833;   //B4

function whichNote(i){
if(i==0){
note = freq01;
}
else if(i==1){
note = freq02;
}
else if(i==2){
note = freq03;
}
else if(i==3){
note = freq04;
}
else if(i==4){
note = freq05;
}
else if(i==5){
note = freq06;
}
else if(i==6){
note = freq07;
}
else if(i==7){
note = freq08;
}
else if(i==8){
note = freq09;
}
else if(i==9){
note = freq10;
}
else if(i==10){
note = freq11;
}
else if(i==11){
note = freq12;
}
}

function getPwm(){
pwm = analogRead(bend);
}

function onInit() {
  mpr1 = require("MPR121").connect(I2C1, function(){
    setInterval(function() {
      var keys = mpr1.touched();
      if (keys!=lastKeyPressed){
        for (var i=0;i<12;i++){
          var kbit = 1<<i;
          if ((keys&kbit) && !(lastKeyPressed&kbit)){
            whichNote(i);
            getPwm();
            note = note + step;
            analogWrite(speaker1, pwm, {freq:note});
            analogWrite(speaker2, pwm, {freq:note});
			  	}
          if (!(keys&kbit) && (lastKeyPressed&kbit)){
            analogWrite(speaker1, 0);
            analogWrite(speaker2, 0);

          }
		    }
		  }
      lastKeyPressed = keys;
    });
  });
}
