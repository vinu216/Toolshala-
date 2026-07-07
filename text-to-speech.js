(function setupTextToSpeechTool() {
  const textInput = document.getElementById('ttsText');
  const languageModeSelect = document.getElementById('ttsLanguageMode');
  const voiceSelect = document.getElementById('ttsVoice');
  const rateInput = document.getElementById('ttsRate');
  const pitchInput = document.getElementById('ttsPitch');
  const rateValue = document.getElementById('ttsRateValue');
  const pitchValue = document.getElementById('ttsPitchValue');
  const message = document.getElementById('ttsMessage');
  const warning = document.getElementById('ttsSupportWarning');
  const hindiWarning = document.getElementById('ttsHindiWarning');
  const languageNode = document.getElementById('ttsLanguage');
  const selectedLanguageNode = document.getElementById('ttsSelectedLanguage');
  const chunksNode = document.getElementById('ttsChunks');
  const statusNode = document.getElementById('ttsStatus');
  const playButton = document.getElementById('ttsPlay');
  const pauseButton = document.getElementById('ttsPause');
  const resumeButton = document.getElementById('ttsResume');
  const stopButton = document.getElementById('ttsStop');

  if (!textInput || !languageModeSelect || !voiceSelect || !rateInput || !pitchInput || !playButton || !pauseButton || !resumeButton || !stopButton) return;

  const synth = window.speechSynthesis;
  const SpeechUtterance = window.SpeechSynthesisUtterance;
  const HINDI_VOICE_WARNING = 'Your browser/device does not have a Hindi voice installed. Please try Chrome on Android, Microsoft Edge, or install Hindi language/voice support in your device settings.';
  let voices = [];
  let speechQueue = [];
  let queueIndex = 0;
  let activeVoice = null;
  let activeLanguage = 'en-IN';
  let isStopped = true;

  const setStatus = (value) => { if (statusNode) statusNode.textContent = value; };
  const setMessage = (value) => { if (message) message.textContent = value; };
  const setHindiWarning = (value) => {
    if (!hindiWarning) return;
    hindiWarning.textContent = value || '';
    hindiWarning.classList.toggle('hidden', !value);
  };

  const containsDevanagari = (text) => /[\u0900-\u097F]/.test(text);
  const detectLanguage = (text) => (containsDevanagari(text) ? 'hi-IN' : 'en-IN');

  const hasHindiVoice = () => voices.some((voice) => {
    const lang = (voice.lang || '').toLowerCase();
    const name = (voice.name || '').toLowerCase();
    return lang === 'hi-in' || lang.startsWith('hi') || name.includes('hindi') || (voice.name || '').includes('हिन्दी');
  });

  const resolveLanguage = (text) => {
    if (languageModeSelect.value === 'hi-IN') return 'hi-IN';
    if (languageModeSelect.value === 'en-IN') return 'en-IN';
    return detectLanguage(text);
  };

  const getLanguageLabel = (language) => (language === 'hi-IN' ? 'Hindi' : 'English');

  const splitLongPart = (part, maxLength) => {
    const pieces = [];
    let remaining = part.trim();
    while (remaining.length > maxLength) {
      const searchWindow = remaining.slice(0, maxLength + 1);
      const commaIndex = Math.max(searchWindow.lastIndexOf(','), searchWindow.lastIndexOf('،'));
      const spaceIndex = searchWindow.lastIndexOf(' ');
      const splitIndex = commaIndex > 80 ? commaIndex + 1 : (spaceIndex > 80 ? spaceIndex : maxLength);
      pieces.push(remaining.slice(0, splitIndex).trim());
      remaining = remaining.slice(splitIndex).trim();
    }
    if (remaining) pieces.push(remaining);
    return pieces;
  };

  const splitTextIntoChunks = (text, maxLength = 200) => {
    const normalized = text.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').trim();
    if (!normalized) return [];
    const sentenceParts = normalized
      .split(/(?<=[।.!?])\s+|\n+/g)
      .flatMap((part) => splitLongPart(part, maxLength));
    const chunks = [];
    let current = '';
    sentenceParts.forEach((part) => {
      const cleanPart = part.trim();
      if (!cleanPart) return;
      const candidate = current ? `${current} ${cleanPart}` : cleanPart;
      if (candidate.length <= maxLength) {
        current = candidate;
        return;
      }
      if (current) chunks.push(current);
      if (cleanPart.length > maxLength) chunks.push(...splitLongPart(cleanPart, maxLength));
      else current = cleanPart;
    });
    if (current) chunks.push(current);
    return chunks.filter(Boolean);
  };

  const getBestVoiceForLanguage = (availableVoices, language) => {
    if (!availableVoices.length) return null;
    const normalized = availableVoices.map((voice) => ({
      voice,
      lang: (voice.lang || '').toLowerCase(),
      name: (voice.name || '').toLowerCase(),
      originalName: voice.name || ''
    }));
    if (language === 'hi-IN') {
      return normalized.find((item) => item.lang === 'hi-in')?.voice
        || normalized.find((item) => item.lang.startsWith('hi'))?.voice
        || normalized.find((item) => item.name.includes('hindi'))?.voice
        || normalized.find((item) => item.originalName.includes('हिन्दी'))?.voice
        || normalized.find((item) => item.name.includes('india') && item.lang.startsWith('en'))?.voice
        || availableVoices[0];
    }
    return normalized.find((item) => item.lang === 'en-in')?.voice
      || normalized.find((item) => item.name.includes('india'))?.voice
      || normalized.find((item) => item.lang === 'en-us')?.voice
      || normalized.find((item) => item.lang.startsWith('en'))?.voice
      || availableVoices[0];
  };

  const populateVoiceDropdown = (preferredVoice) => {
    const previousVoiceUri = activeVoice?.voiceURI || voiceSelect.selectedOptions[0]?.dataset.voiceUri || '';
    voiceSelect.innerHTML = '';
    if (!voices.length) {
      voiceSelect.innerHTML = '<option value="">Voices are loading...</option>';
      return;
    }
    voices.forEach((voice, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.dataset.voiceUri = voice.voiceURI || '';
      option.textContent = `${voice.name || 'Browser voice'} — ${voice.lang || 'default'}`;
      voiceSelect.appendChild(option);
    });
    const preferredIndex = voices.indexOf(preferredVoice);
    const previousIndex = voices.findIndex((voice) => voice.voiceURI && voice.voiceURI === previousVoiceUri);
    voiceSelect.value = String(preferredIndex >= 0 ? preferredIndex : (previousIndex >= 0 ? previousIndex : 0));
    activeVoice = voices[Number(voiceSelect.value)] || null;
  };

  const updateLanguageUi = () => {
    activeLanguage = resolveLanguage(textInput.value);
    const bestVoice = getBestVoiceForLanguage(voices, activeLanguage);
    populateVoiceDropdown(bestVoice);
    const label = getLanguageLabel(activeLanguage);
    if (languageNode) languageNode.textContent = `${label} (${activeLanguage})`;
    if (selectedLanguageNode) selectedLanguageNode.textContent = label;
    if (chunksNode) chunksNode.textContent = String(splitTextIntoChunks(textInput.value).length);
    if (activeLanguage === 'hi-IN' && voices.length && !hasHindiVoice()) {
      setHindiWarning(HINDI_VOICE_WARNING);
      setStatus('Hindi voice not available');
    } else {
      setHindiWarning('');
      if (!synth.speaking && !synth.paused) setStatus('Ready');
    }
  };

  const loadVoices = () => {
    voices = synth ? synth.getVoices() : [];
    updateLanguageUi();
    return voices;
  };

  const speakQueue = () => {
    if (!synth || isStopped) return;
    if (queueIndex >= speechQueue.length) {
      setStatus('Ready');
      setMessage('Playback finished.');
      return;
    }
    const utterance = new SpeechUtterance(speechQueue[queueIndex]);
    utterance.lang = activeLanguage === 'en-IN' && activeVoice?.lang === 'en-US' ? 'en-US' : activeLanguage;
    utterance.rate = Number(rateInput.value) || 1;
    utterance.pitch = Number(pitchInput.value) || 1;
    if (activeVoice) utterance.voice = activeVoice;
    utterance.onend = () => {
      if (isStopped) return;
      queueIndex += 1;
      speakQueue();
    };
    utterance.onerror = () => {
      if (isStopped) return;
      setStatus('Stopped');
      setMessage('Playback stopped because this browser voice could not read the text. Please try another voice.');
    };
    setStatus('Speaking...');
    setMessage(`Speaking chunk ${queueIndex + 1} of ${speechQueue.length}.`);
    synth.speak(utterance);
  };

  const handlePlay = () => {
    const text = textInput.value.trim();
    if (!text) {
      setMessage('Please enter Hindi or English text first.');
      setStatus('Ready');
      textInput.focus();
      return;
    }
    synth.cancel();
    loadVoices();
    activeLanguage = resolveLanguage(text);
    activeVoice = voices[Number(voiceSelect.value)] || getBestVoiceForLanguage(voices, activeLanguage);
    speechQueue = splitTextIntoChunks(text);
    queueIndex = 0;
    isStopped = false;
    updateLanguageUi();
    if (activeLanguage === 'hi-IN' && voices.length && !hasHindiVoice()) {
      setHindiWarning(HINDI_VOICE_WARNING);
      setStatus('Hindi voice not available');
    }
    speakQueue();
  };

  const handlePause = () => {
    if (!synth.speaking) return;
    synth.pause();
    setStatus('Paused');
  };

  const handleResume = () => {
    if (!synth.paused) return;
    synth.resume();
    setStatus('Speaking...');
  };

  const handleStop = () => {
    isStopped = true;
    speechQueue = [];
    queueIndex = 0;
    synth.cancel();
    setStatus('Stopped');
    setMessage('Playback stopped.');
    if (chunksNode) chunksNode.textContent = String(splitTextIntoChunks(textInput.value).length);
  };

  if (!synth || !SpeechUtterance) {
    if (warning) {
      warning.classList.remove('hidden');
      warning.textContent = 'Your browser does not support Text to Speech. Please try Google Chrome, Microsoft Edge, or another modern browser.';
    }
    setStatus('Browser not supported');
    [playButton, pauseButton, resumeButton, stopButton, languageModeSelect, voiceSelect, rateInput, pitchInput].forEach((element) => { element.disabled = true; });
    return;
  }

  loadVoices();
  synth.onvoiceschanged = loadVoices;
  textInput.addEventListener('input', updateLanguageUi);
  languageModeSelect.addEventListener('change', updateLanguageUi);
  voiceSelect.addEventListener('change', () => { activeVoice = voices[Number(voiceSelect.value)] || null; });
  rateInput.addEventListener('input', () => { if (rateValue) rateValue.textContent = Number(rateInput.value).toFixed(1); });
  pitchInput.addEventListener('input', () => { if (pitchValue) pitchValue.textContent = Number(pitchInput.value).toFixed(1); });
  playButton.addEventListener('click', handlePlay);
  pauseButton.addEventListener('click', handlePause);
  resumeButton.addEventListener('click', handleResume);
  stopButton.addEventListener('click', handleStop);
  window.addEventListener('beforeunload', handleStop);
})();
