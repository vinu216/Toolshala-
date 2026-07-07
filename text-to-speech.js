(function setupTextToSpeechTool() {
  const textInput = document.getElementById('ttsText');
  const voiceSelect = document.getElementById('ttsVoice');
  const rateInput = document.getElementById('ttsRate');
  const pitchInput = document.getElementById('ttsPitch');
  const rateValue = document.getElementById('ttsRateValue');
  const pitchValue = document.getElementById('ttsPitchValue');
  const message = document.getElementById('ttsMessage');
  const warning = document.getElementById('ttsSupportWarning');
  const languageNode = document.getElementById('ttsLanguage');
  const chunksNode = document.getElementById('ttsChunks');
  const statusNode = document.getElementById('ttsStatus');
  const playButton = document.getElementById('ttsPlay');
  const pauseButton = document.getElementById('ttsPause');
  const resumeButton = document.getElementById('ttsResume');
  const stopButton = document.getElementById('ttsStop');

  if (!textInput || !voiceSelect || !rateInput || !pitchInput || !playButton || !pauseButton || !resumeButton || !stopButton) return;

  const synth = window.speechSynthesis;
  let voices = [];
  let chunks = [];
  let chunkIndex = 0;
  let activeVoice = null;

  const setStatus = (value) => { if (statusNode) statusNode.textContent = value; };
  const setMessage = (value) => { if (message) message.textContent = value; };
  const hasHindiText = (text) => /[\u0900-\u097F]/.test(text);
  const getDetectedLang = (text) => (hasHindiText(text) ? 'hi-IN' : 'en-IN');

  const splitTextIntoChunks = (text, maxLength = 200) => {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (!normalized) return [];
    const sentences = normalized.match(/[^।.!?\n]+[।.!?]?/g) || [normalized];
    const result = [];
    let current = '';

    sentences.forEach((sentence) => {
      const part = sentence.trim();
      if (!part) return;
      if ((current + ' ' + part).trim().length <= maxLength) {
        current = (current + ' ' + part).trim();
        return;
      }
      if (current) result.push(current);
      if (part.length <= maxLength) {
        current = part;
        return;
      }
      for (let start = 0; start < part.length; start += maxLength) {
        result.push(part.slice(start, start + maxLength).trim());
      }
      current = '';
    });

    if (current) result.push(current);
    return result;
  };

  const scoreVoice = (voice, detectedLang) => {
    const name = `${voice.name || ''} ${voice.lang || ''}`.toLowerCase();
    const lang = (voice.lang || '').toLowerCase();
    let score = 0;
    if (detectedLang === 'hi-IN' && lang === 'hi-in') score += 100;
    if (detectedLang !== 'hi-IN' && lang === 'en-in') score += 95;
    if (lang === 'hi-in') score += 85;
    if (lang === 'en-in') score += 80;
    if (name.includes('hindi')) score += 75;
    if (name.includes('indian')) score += 60;
    if (lang.startsWith('hi')) score += 50;
    if (lang.startsWith('en')) score += 35;
    if (lang === 'en-us') score += 25;
    return score;
  };

  const choosePreferredVoice = (detectedLang) => voices.slice().sort((a, b) => scoreVoice(b, detectedLang) - scoreVoice(a, detectedLang))[0] || null;

  const populateVoices = () => {
    voices = synth ? synth.getVoices() : [];
    const previousValue = voiceSelect.value;
    voiceSelect.innerHTML = '';

    if (!voices.length) {
      voiceSelect.innerHTML = '<option value="">Voices are loading...</option>';
      return;
    }

    voices.forEach((voice, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = `${voice.name} (${voice.lang || 'default'})`;
      voiceSelect.appendChild(option);
    });

    const preferred = previousValue && voices[Number(previousValue)] ? Number(previousValue) : voices.indexOf(choosePreferredVoice(getDetectedLang(textInput.value)));
    voiceSelect.value = String(preferred >= 0 ? preferred : 0);
    activeVoice = voices[Number(voiceSelect.value)] || null;
  };

  const speakNextChunk = () => {
    if (!synth || chunkIndex >= chunks.length) {
      setStatus('Finished');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
    utterance.lang = getDetectedLang(textInput.value);
    utterance.rate = Number(rateInput.value) || 1;
    utterance.pitch = Number(pitchInput.value) || 1;
    if (activeVoice) utterance.voice = activeVoice;
    utterance.onend = () => {
      chunkIndex += 1;
      if (chunkIndex < chunks.length) speakNextChunk();
      else setStatus('Finished');
    };
    utterance.onerror = () => setStatus('Playback error. Please try another browser voice.');
    setStatus(`Speaking chunk ${chunkIndex + 1} of ${chunks.length}`);
    synth.speak(utterance);
  };

  const refreshDetectedInfo = () => {
    const detected = getDetectedLang(textInput.value);
    if (languageNode) languageNode.textContent = detected === 'hi-IN' ? 'Hindi (hi-IN)' : 'English / default (en-IN)';
    if (chunksNode) chunksNode.textContent = String(splitTextIntoChunks(textInput.value).length);
  };

  if (!synth) {
    if (warning) {
      warning.classList.remove('hidden');
      warning.textContent = 'Your browser does not support SpeechSynthesis. Please try the latest Chrome, Edge, or Safari browser.';
    }
    [playButton, pauseButton, resumeButton, stopButton, voiceSelect, rateInput, pitchInput].forEach((element) => { element.disabled = true; });
    return;
  }

  populateVoices();
  if ('onvoiceschanged' in synth) synth.addEventListener('voiceschanged', populateVoices);

  textInput.addEventListener('input', () => {
    refreshDetectedInfo();
    const preferred = choosePreferredVoice(getDetectedLang(textInput.value));
    if (preferred) voiceSelect.value = String(voices.indexOf(preferred));
  });
  voiceSelect.addEventListener('change', () => { activeVoice = voices[Number(voiceSelect.value)] || null; });
  rateInput.addEventListener('input', () => { if (rateValue) rateValue.textContent = Number(rateInput.value).toFixed(1); });
  pitchInput.addEventListener('input', () => { if (pitchValue) pitchValue.textContent = Number(pitchInput.value).toFixed(1); });

  playButton.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (!text) {
      setMessage('Please enter Hindi or English text first.');
      setStatus('Waiting for text');
      textInput.focus();
      return;
    }
    synth.cancel();
    chunks = splitTextIntoChunks(text);
    chunkIndex = 0;
    activeVoice = voices[Number(voiceSelect.value)] || choosePreferredVoice(getDetectedLang(text));
    refreshDetectedInfo();
    setMessage('Playing with your selected browser voice.');
    speakNextChunk();
  });

  pauseButton.addEventListener('click', () => { synth.pause(); setStatus('Paused'); });
  resumeButton.addEventListener('click', () => { synth.resume(); setStatus('Speaking'); });
  stopButton.addEventListener('click', () => { synth.cancel(); setStatus('Stopped'); });
  window.addEventListener('beforeunload', () => synth.cancel());
  refreshDetectedInfo();
})();
