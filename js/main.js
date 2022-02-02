// "use strict";

let midi, data;
let keyData = document.getElementById('key_data');

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
    sysex: false  // this defaults to false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  alert("No MIDI support in your browser");
}

function onMIDISuccess(midiAccess) {
  // when we get a successful response, run this code
  console.log('MIDI Access Object', midiAccess);

  midi = midiAccess;  // This is our raw MIDI data, inputs, outputs and sysex status

  let inputs = midi.inputs.values();

  // Loop over all available inputs and listen for any MIDI input
  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    // Each time there is a MIDI message call the onMIDIMessage function
    input.value.onmidimessage = onMIDIMessage;
  }

}

function onMIDIFailure(error) {
  // when we get a failed response, run this code
  console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
}

function onMIDIMessage(event) {
  // data = message.data  // This gives us our [command/channel, note, velocity] data
  // console.log('MIDI data', data); // MIDI data [144, 63, 73]

  data = event.data, cmd = data[0] >> 4, channel = data[0] & 0xf, type = data[0] & 0xf0,  // Channel agnostic message type
    note = data[1], velocity = data[2];
  // With pressure and tilt off
  // Note off: 128, cmd: 8
  // Note on: 144, cmd: 9
  // Pressure/tilt on
  // Pressure: 176, cmd: 11
  // Bend: 224, cmd: 14

  // Filter out the MiniNova mystery persistent MIDI messages. I believe it must be the MIDI clock??
  if (channel !== 8 && cmd !== 15 && type !== 240) {
    //console.log('data', data, 'cmd', cmd, 'channel', channel);
    logger(keyData, 'key data', data);
  }

  switch (type) {
    case 144: // noteOn message
      noteOn(note, velocity);
      break;
    case 128: // noteOff message
      noteOff(note, velocity);
      break;


  }

  function noteOn(midiNote, velocity) {
    player(midiNote, velocity);
  }

  function noteOff(midiNote, velocity) {
    player(midiNote, velocity);
  }

  function player(note, velocity) {
  }


  // Utility Functions
  function midiNoteToPitch(data) {
    const midiObjectTest = {
      60: "C4 (middle C)",
      61: "C#4/Db4",
      62: "D4",
      63: "D#4/Eb4",
      65: "F4",
      66: "F#4/Gb4",
      67: "G4",
      68: "G#4/Ab4",
      69: "A4",
      70: "A#4/Bb4",
      71: "B4",
      72: "C5",
      73: "C#5/Db5",
      74: "D5",
      75: "D#5/Eb5",
      76: "E5",
      77: "F5",
      78: "F#5/Gb5",
      79: "G5",
      80: "G#5/Ab5",
      81: "A5",
      82: "A#5/Bb5",
      83: "B5",
      84: "C6",
      85: "C#6/Db6",
      86: "D6",
      87: "D#6/Eb6",
      88: "E6",
      89: "F6",
      90: "F#6/Gb6",
      91: "G6",
      92: "G#6/Ab6",
      93: "A6",
      94: "A#6/Bb6",
      95: "B6",
      96: "C7",
      97: "C#7/Db7",
      98: "D7",
      99: "D#7/Eb7",
      100: "E7",
      101: "F7",
      102: "F#7/Gb7",
      103: "G7",
      104: "G#7/Ab7",
      105: "A7",
      106: "A#7/Bb7",
      107: "B7",
      108: "C8",
      109: "C#8/Db8",
      110: "D8",
      111: "D#8/Eb8",
      112: "E8",
      113: "F8",
      114: "F#8/Gb8",
      115: "G8",
      116: "G#8/Ab8",
      117: "A8",
      118: "A#8/Bb8",
      119: "B8"

    };
    let midiNote = data[1];
    let pitch;
    return midiObjectTest[midiNote];
  }

  function logger(container, label, data) {
    messages = label + " [channel: " + (data[0] & 0xf) + ", cmd: " + (data[0] >> 4) + ", type: " + (data[0] & 0xf0) + " , MIDI note: " + data[1] + ", note: " + midiNoteToPitch(data) + ", velocity: " + data[2] + "]";
    console.log(messages);
  }


  // function midiNoteToPitch(data) {
  //   let midiNote = data[1];
  //   let pitch;
  //   switch (midiNote) {
  //     case 0:
  //       pitch = "C-1";
  //       break;
  //     case 1:
  //       pitch = "C#-1/Db-1";
  //       break;
  //     case 2:
  //       pitch = "D-1";
  //       break;
  //     case 3:
  //       pitch = "D#-1/Eb-1";
  //       break;
  //     case 4:
  //       pitch = "E-1";
  //       break;
  //     case 5:
  //       pitch = "F-1";
  //       break;
  //     case 6:
  //       pitch = "F#-1/Gb-1";
  //       break;
  //     case 7:
  //       pitch = "G-1";
  //       break;
  //     case 8:
  //       pitch = "G#-1/Ab-1";
  //       break;
  //     case 9:
  //       pitch = "A-1";
  //       break;
  //     case 10:
  //       pitch = "A#-1/Bb-1";
  //       break;
  //     case 11:
  //       pitch = "B-1";
  //       break;
  //     case 12:
  //       pitch = "C0";
  //       break;
  //     case 13:
  //       pitch = "C#0/Db0";
  //       break;
  //     case 14:
  //       pitch = "D0";
  //       break;
  //     case 15:
  //       pitch = "D#0/Eb0";
  //       break;
  //     case 16:
  //       pitch = "E0";
  //       break;
  //     case 17:
  //       pitch = "F0";
  //       break;
  //     case 18:
  //       pitch = "F#0/Gb0";
  //       break;
  //     case 19:
  //       pitch = "G0";
  //       break;
  //     case 20:
  //       pitch = "G#0/Ab0";
  //       break;
  //     case 21:
  //       pitch = "A0";
  //       break;
  //     case 22:
  //       pitch = "A#0/Bb0";
  //       break;
  //     case 23:
  //       pitch = "B0";
  //       break;
  //     case 24:
  //       pitch = "C1";
  //       break;
  //     case 25:
  //       pitch = "C#1/Db1";
  //       break;
  //     case 26:
  //       pitch = "D1";
  //       break;
  //     case 27:
  //       pitch = "D#1/Eb1";
  //       break;
  //     case 28:
  //       pitch = "E1";
  //       break;
  //     case 29:
  //       pitch = "F1";
  //       break;
  //     case 30:
  //       pitch = "F#1/Gb1";
  //       break;
  //     case 31:
  //       pitch = "G1";
  //       break;
  //     case 32:
  //       pitch = "G#1/Ab1";
  //       break;
  //     case 33:
  //       pitch = "A1";
  //       break;
  //     case 34:
  //       pitch = "A#1/Bb1";
  //       break;
  //     case 35:
  //       pitch = "B1";
  //       break;
  //     case 36:
  //       pitch = "C2";
  //       break;
  //     case 37:
  //       pitch = "C#2/Db2";
  //       break;
  //     case 38:
  //       pitch = "D2";
  //       break;
  //     case 39:
  //       pitch = "D#2/Eb2";
  //       break;
  //     case 40:
  //       pitch = "E2";
  //       break;
  //     case 41:
  //       pitch = "F2";
  //       break;
  //     case 42:
  //       pitch = "F#2/Gb2";
  //       break;
  //     case 43:
  //       pitch = "G2";
  //       break;
  //     case 44:
  //       pitch = "G#2/Ab2";
  //       break;
  //     case 45:
  //       pitch = "A2";
  //       break;
  //     case 46:
  //       pitch = "A#2/Bb2";
  //       break;
  //     case 47:
  //       pitch = "B2";
  //       break;
  //     case 48:
  //       pitch = "C3";
  //       break;
  //     case 49:
  //       pitch = "C#3/Db3";
  //       break;
  //     case 50:
  //       pitch = "D3";
  //       break;
  //     case 51:
  //       pitch = "D#3/Eb3";
  //       break;
  //     case 52:
  //       pitch = "E3";
  //       break;
  //     case 53:
  //       pitch = "F3";
  //       break;
  //     case 54:
  //       pitch = "F#3/Gb3";
  //       break;
  //     case 55:
  //       pitch = "G3";
  //       break;
  //     case 56:
  //       pitch = "G#3/Ab3";
  //       break;
  //     case 57:
  //       pitch = "A3";
  //       break;
  //     case 58:
  //       pitch = "A#3/Bb3";
  //       break;
  //     case 59:
  //       pitch = "B3";
  //       break;
  //     case 60:
  //       pitch = "C4 (middle C)";
  //       break;
  //     case 61:
  //       pitch = "C#4/Db4";
  //       break;
  //     case 62:
  //       pitch = "D4";
  //       break;
  //     case 63:
  //       pitch = "D#4/Eb4";
  //       break;
  //     case 64:
  //       pitch = "E4";
  //       break;
  //     case 65:
  //       pitch = "F4";
  //       break;
  //     case 66:
  //       pitch = "F#4/Gb4";
  //       break;
  //     case 67:
  //       pitch = "G4";
  //       break;
  //     case 68:
  //       pitch = "G#4/Ab4";
  //       break;
  //     case 69:
  //       pitch = "A4";
  //       break;
  //     case 70:
  //       pitch = "A#4/Bb4";
  //       break;
  //     case 71:
  //       pitch = "B4";
  //       break;
  //     case 72:
  //       pitch = "C5";
  //       break;
  //     case 73:
  //       pitch = "C#5/Db5";
  //       break;
  //     case 74:
  //       pitch = "D5";
  //       break;
  //     case 75:
  //       pitch = "D#5/Eb5";
  //       break;
  //     case 76:
  //       pitch = "E5";
  //       break;
  //     case 77:
  //       pitch = "F5";
  //       break;
  //     case 78:
  //       pitch = "F#5/Gb5";
  //       break;
  //     case 79:
  //       pitch = "G5";
  //       break;
  //     case 80:
  //       pitch = "G#5/Ab5";
  //       break;
  //     case 81:
  //       pitch = "A5";
  //       break;
  //     case 82:
  //       pitch = "A#5/Bb5";
  //       break;
  //     case 83:
  //       pitch = "B5";
  //       break;
  //     case 84:
  //       pitch = "C6";
  //       break;
  //     case 85:
  //       pitch = "C#6/Db6";
  //       break;
  //     case 86:
  //       pitch = "D6";
  //       break;
  //     case 87:
  //       pitch = "D#6/Eb6";
  //       break;
  //     case 88:
  //       pitch = "E6";
  //       break;
  //     case 89:
  //       pitch = "F6";
  //       break;
  //     case 90:
  //       pitch = "F#6/Gb6";
  //       break;
  //     case 91:
  //       pitch = "G6";
  //       break;
  //     case 92:
  //       pitch = "G#6/Ab6";
  //       break;
  //     case 93:
  //       pitch = "A6";
  //       break;
  //     case 94:
  //       pitch = "A#6/Bb6";
  //       break;
  //     case 95:
  //       pitch = "B6";
  //       break;
  //     case 96:
  //       pitch = "C7";
  //       break;
  //     case 97:
  //       pitch = "C#7/Db7";
  //       break;
  //     case 98:
  //       pitch = "D7";
  //       break;
  //     case 99:
  //       pitch = "D#7/Eb7";
  //       break;
  //     case 100:
  //       pitch = "E7";
  //       break;
  //     case 101:
  //       pitch = "F7";
  //       break;
  //     case 102:
  //       pitch = "F#7/Gb7";
  //       break;
  //     case 103:
  //       pitch = "G7";
  //       break;
  //     case 104:
  //       pitch = "G#7/Ab7";
  //       break;
  //     case 105:
  //       pitch = "A7";
  //       break;
  //     case 106:
  //       pitch = "A#7/Bb7";
  //       break;
  //     case 107:
  //       pitch = "B7";
  //       break;
  //     case 108:
  //       pitch = "C8";
  //       break;
  //     case 109:
  //       pitch = "C#8/Db8";
  //       break;
  //     case 110:
  //       pitch = "D8";
  //       break;
  //     case 111:
  //       pitch = "D#8/Eb8";
  //       break;
  //     case 112:
  //       pitch = "E8";
  //       break;
  //     case 113:
  //       pitch = "F8";
  //       break;
  //     case 114:
  //       pitch = "F#8/Gb8";
  //       break;
  //     case 115:
  //       pitch = "G8";
  //       break;
  //     case 116:
  //       pitch = "G#8/Ab8";
  //       break;
  //     case 117:
  //       pitch = "A8";
  //       break;
  //     case 118:
  //       pitch = "A#8/Bb8";
  //       break;
  //     case 119:
  //       pitch = "B8";
  //       break;
  //     case 120:
  //       pitch = "C9";
  //       break;
  //     case 121:
  //       pitch = "C#9/Db9";
  //       break;
  //     case 122:
  //       pitch = "D9";
  //       break;
  //     case 123:
  //       pitch = "D#9/Eb9";
  //       break;
  //     case 124:
  //       pitch = "E9";
  //       break;
  //     case 125:
  //       pitch = "F9";
  //       break;
  //     case 126:
  //       pitch = "F#9/Gb9";
  //       break;
  //     case 127:
  //       pitch = "G9";
  //       break;
  //   }
  //   return pitch;
  // }


}
