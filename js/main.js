let midi, data;

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

function onMIDIMessage(message) {
  data = message.data  // This gives us our [command/channel, note, velocity] data
  console.log('MIDI data', data); // MIDI data [144, 63, 73]
}
