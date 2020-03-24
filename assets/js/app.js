gsap.registerPlugin(Draggable);

var triggerHand = document.getElementById('tick-hand');
var triggerButton = document.getElementById('start');
var stopButton = document.getElementById('stop');
var bpmInput = document.getElementById('bpm');
var incr = document.getElementById('increase');
var decr = document.getElementById('decrease');
var audioClip = document.createElement('audio');
audioClip.src = 'https://www.jo3.io/assets/downloads/metronome.wav';


class Metronome {
  constructor(elem, startBpm = 40, sound) {
    this._elem = elem;
    this._bpm = startBpm;
    this._maxBpm = 208;
    // gsap timelines run in seconds convert bpm to bps, each tick has two movements so halve the bps  (center to right, center to left)
    this._tickDur = (60/startBpm) / 2;
    this._sound = sound;
    this._rot = 8;
    this._easeType = Linear.easeNone;
    // create gsap timeline for animation
    this._animation = new gsap.timeline({
      name: 'Metronome Obj Timeline', 
      paused:true, repeat: -1, 
      onComplete: this.playSound,  // pass reference of playSound to onComplete callback function in gsap timeline
      onCompleteParams: [this._sound]  // sound will need to be referenced by parent to timeline event calling onComplete - see playSound() method
    });
    this._animation.set(this._elem, {transformOrigin: "bottom center"});
    this._animation.to(this._elem, {duration: this._tickDur, rotation: this._rot, ease: this._easeType, onComplete: this.playSound });
    this._animation.to(this._elem, {duration: this._tickDur, rotation: 0, ease: this._easeType});
    this._animation.to(this._elem, {duration: this._tickDur, rotation: this._rot * -1, ease: this._easeType, onComplete: this.playSound });
    this._animation.to(this._elem, {duration: this._tickDur, rotation: 0, ease: this._easeType});
  }
  playAnim() {
    // if (this._)
    if (this._animation.isActive()) {
      this.stopAnim();
    }
    this._animation.play(0);   
  }
  stopAnim() {
    this._animation.seek(0);
    this._animation.pause();
  }
  playSound() {
    // gsap timeline callback seems to be called by a child timeline object, refer to parent for audio supplied in constructor
    this.parent.vars.onCompleteParams[0].currentTime = 0;
    this.parent.vars.onCompleteParams[0].play();
  }
  calcTick() {
    this._tickDur = (60 / this._bpm) / 2;
    // console.log(`new bpm and tickDur: ${this._bpm}, ${this._tickDur}`);
  }
  get bpm() {
    return this._bpm;
  }
  set bpm(val) {
    this._bpm = val;
    // update tick duration and animation with new bpm
    this.update();
  }
  // triggered by change in BPM input (focusout event)
  update() {
    this.calcTick();
    this.stopAnim();
    // create new timeline with updated tick duration
    this._animation = new gsap.timeline({name: 'the tl', paused:true, repeat: -1, onComplete: this.playSound, onCompleteParams: [this._sound]});
    this._animation.set(this._elem, {transformOrigin: "bottom center"});
    this._animation.to(this._elem, {duration: this._tickDur, rotation: this._rot, ease: this._easeType, onComplete: this.playSound });
    this._animation.to(this._elem, {duration: this._tickDur, rotation: 0, ease: this._easeType});
    this._animation.to(this._elem, {duration: this._tickDur, rotation: this._rot * -1, ease: this._easeType, onComplete: this.playSound });
    this._animation.to(this._elem, {duration: this._tickDur, rotation: 0, ease: this._easeType});
  }

}

bpmInput.addEventListener('focusout', () => met.bpm = bpmInput.value);
bpmInput.addEventListener('change', () => met.bpm = bpmInput.value);
triggerHand.addEventListener('click', () => met.playAnim());
triggerButton.addEventListener('click', () => met.playAnim());
stopButton.addEventListener('click', () => {
  met.stopAnim();
});
incr.addEventListener('click', () => {
  bpmInput.value++;
  met.bpm = bpmInput.value;
});
decr.addEventListener('click', () => {
  bpmInput.value--;
  met.bpm = bpmInput.value;
});

// Create draggable weight to set BPM on tickhand, lock to Y axis and #tick-hand element
var weight = Draggable.create('#weight', {
  type:"y",
  bounds: document.getElementById("tick-hand"),
  onDrag: function() {
    let newBpm = Math.round((met._maxBpm * percentCalc(this.minY, this.maxY, this.y)));
    console.log(newBpm)
    bpmInput.value = newBpm;
    met.bpm = newBpm;
  }
});
// Returns decimal to represent percentage of vertical travel bottom to top of #tick-hand
function percentCalc(min, max, currentVal) {
  let temp = (min - currentVal) / min;
  // console.log(min, max, currentVal, temp);
  return temp === -0 || temp === 0 ? .01 : temp;
}

var met = new Metronome('#tick-hand', bpmInput.value, audioClip);