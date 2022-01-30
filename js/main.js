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
  function logger(container, label, data) {
    messages = label + " [channel: " + (data[0] & 0xf) + ", cmd: " + (data[0] >> 4) + ", type: " + (data[0] & 0xf0) + " , MIDI note: " + data[1] + ", note: " + midiNoteToPitch(data) + ", velocity: " + data[2] + "]";
    console.log(messages);
  }

  function midiNoteToPitch(data) {
    let midiNote = data[1];
    let pitch;
    switch (midiNote) {
      case 60:
        pitch = "C4 (middle C)";
        break;
      case 61:
        pitch = "C#4/Db4";
        break;
      case 62:
        pitch = "D4";
        break;
      case 63:
        pitch = "D#4/Eb4";
        break;
      case 64:
        pitch = "E4";
        break;
      case 65:
        pitch = "F4";
        break;
      case 66:
        pitch = "F#4/Gb4";
        break;
      case 67:
        pitch = "G4";
        break;
      case 68:
        pitch = "G#4/Ab4";
        break;
      case 69:
        pitch = "A4";
        break;
      case 70:
        pitch = "A#4/Bb4";
        break;
      case 71:
        pitch = "B4";
        break;
      case 72:
        pitch = "C5";
        break;
      case 73:
        pitch = "C#5/Db5";
        break;
      case 74:
        pitch = "D5";
        break;
      case 75:
        pitch = "D#5/Eb5";
        break;
      case 76:
        pitch = "E5";
        break;
      case 77:
        pitch = "F5";
        break;
      case 78:
        pitch = "F#5/Gb5";
        break;
      case 79:
        pitch = "G5";
        break;
      case 80:
        pitch = "G#5/Ab5";
        break;
      case 81:
        pitch = "A5";
        break;
      case 82:
        pitch = "A#5/Bb5";
        break;
      case 83:
        pitch = "B5";
        break;
      case 84:
        pitch = "C6";
        break;
      case 85:
        pitch = "C#6/Db6";
        break;
      case 86:
        pitch = "D6";
        break;
      case 87:
        pitch = "D#6/Eb6";
        break;
      case 88:
        pitch = "E6";
        break;
      case 89:
        pitch = "F6";
        break;
      case 90:
        pitch = "F#6/Gb6";
        break;
      case 91:
        pitch = "G6";
        break;
      case 92:
        pitch = "G#6/Ab6";
        break;
      case 93:
        pitch = "A6";
        break;
      case 94:
        pitch = "A#6/Bb6";
        break;
      case 95:
        pitch = "B6";
        break;
      case 96:
        pitch = "C7";
        break;
      case 97:
        pitch = "C#7/Db7";
        break;
      case 98:
        pitch = "D7";
        break;
      case 99:
        pitch = "D#7/Eb7";
        break;
      case 100:
        pitch = "E7";
        break;
      case 101:
        pitch = "F7";
        break;
      case 102:
        pitch = "F#7/Gb7";
        break;
      case 103:
        pitch = "G7";
        break;
      case 104:
        pitch = "G#7/Ab7";
        break;
      case 105:
        pitch = "A7";
        break;
      case 106:
        pitch = "A#7/Bb7";
        break;
      case 107:
        pitch = "B7";
        break;

    }
    return pitch;
  }


}
