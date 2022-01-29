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
    }
    return pitch;
  }


}
