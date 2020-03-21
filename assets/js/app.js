var triggerHand = document.getElementById('tick-hand');
var triggerButton = document.getElementById('start');
var stopButton = document.getElementById('stop');
var bpmInput = document.getElementById('bpm');
var audioClip = new Audio('https://www.jo3.io/assets/downloads/metronome.wav');

class Metronome {
  constructor(elem, bpm, sound) {
    this.elem = elem;
    this.bpm = bpm;
    this.tick_dur = (60/bpm) / 2;
    this.sound = sound;
    this.rot = 8;
    this.easeType = Linear.easeNone;
    this.animation = new gsap.timeline({paused:true, repeat: -1});
    console.log(this.sound);
    this.animation.set(this.elem, {transformOrigin: "bottom center"});
    this.animation.to(this.elem, {duration: this.tick_dur, rotation: this.rot, ease: this.easeType, onComplete: this.playSound()});
    this.animation.to(this.elem, {duration: this.tick_dur, rotation: 0, ease: this.easeType});
    this.animation.to(this.elem, {duration: this.tick_dur, rotation: this.rot * -1, ease: this.easeType, onComplete: this.playSound});
    this.animation.to(this.elem, {duration: this.tick_dur, rotation: 0, ease: this.easeType});
  }
  playSound() {
    console.log(this.sound);
    // this.sound.currentTime = 0;
    // this.sound.play();
  }
  tick(){
    console.log('tick')
  }
}

var met = new Metronome('#tick-hand', 120, audioClip);

// bpmInput.addEventListener('input', () => { bpm = bpmInput.value;
//                                          console.log(bpm);
//                                          });
triggerHand.addEventListener('click', () => met.animation.play(0));
triggerButton.addEventListener('click', () => met.animation.play(0));
stopButton.addEventListener('click', () => {
  met.animation.seek(0) 
  met.animation.pause()
});