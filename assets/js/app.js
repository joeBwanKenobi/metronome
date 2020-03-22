var triggerHand = document.getElementById('tick-hand');
var triggerButton = document.getElementById('start');
var stopButton = document.getElementById('stop');
var bpmInput = document.getElementById('bpm');
var audioClip = document.createElement('audio');
audioClip.src = 'https://www.jo3.io/assets/downloads/metronome.wav';

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
    this.animation.to(this.elem, {duration: this.tick_dur, rotation: this.rot, ease: this.easeType});
    this.animation.to(this.elem, {duration: this.tick_dur, rotation: 0, ease: this.easeType});
    this.animation.to(this.elem, {duration: this.tick_dur, rotation: this.rot * -1, ease: this.easeType});
    this.animation.to(this.elem, {duration: this.tick_dur, rotation: 0, ease: this.easeType});
  }

  playAnim() {
    this.animation.play(0);
    this.timer();
  }
  stopAnim() {
    this.animation.seek(0);
    this.animation.pause();
    clearInterval(this.clock);
  }

  playSound() {

  }
  timer(){
    this.clock = setInterval(() => { this.sound.currentTime = 0; this.sound.play() }, 60000/120);
  }

}

// var met = new Metronome('#tick-hand', 120, audioClip);

// bpmInput.addEventListener('input', () => { bpm = bpmInput.value;
//                                          console.log(bpm);
//                                          });
triggerHand.addEventListener('click', () => met.playAnim());
triggerButton.addEventListener('click', () => met.playAnim());
stopButton.addEventListener('click', () => {
  met.stopAnim();
});

var met = new Metronome('#tick-hand', 120, audioClip);