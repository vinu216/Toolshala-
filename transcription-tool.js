(function () {
  const MAX_SIZE_BYTES = 25 * 1024 * 1024;
  const SUPPORTED_TYPES = new Set([
    'audio/mpeg', 'audio/mp3', 'audio/mpga', 'audio/wav', 'audio/x-wav', 'audio/webm', 'audio/mp4', 'audio/x-m4a', 'audio/m4a', 'audio/ogg', 'video/mp4', 'video/webm'
  ]);
  const RECORDER_TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/ogg'];
  const API_ROUTES = ['/api/transcribe', '/.netlify/functions/transcribe'];
  const el = {
    mediaInput: document.getElementById('mediaInput'), fileStatus: document.getElementById('fileStatus'), processState: document.getElementById('processState'),
    recordingStatus: document.getElementById('recordingStatus'), actionStatus: document.getElementById('actionStatus'), transcriptOutput: document.getElementById('transcriptOutput'),
    manualInput: document.getElementById('manualInput'), start: document.getElementById('startRecording'), pause: document.getElementById('pauseRecording'), stop: document.getElementById('stopRecording'),
    transcribe: document.getElementById('transcribeButton'), copy: document.getElementById('copyTranscript'), download: document.getElementById('downloadTranscript'), reset: document.getElementById('resetTranscript'),
    lang: document.getElementById('languageSelect'), ts: document.getElementById('timestampToggle'), punct: document.getElementById('punctuationToggle')
  };
  const state = { mode: 'idle', file: null, recorder: null, stream: null, chunks: [], recording: false, paused: false, discardRecording: false };
  const hasMediaRecorder = Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
  const isLocalhost = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
  const hasSecureMicContext = window.isSecureContext || isLocalhost;

  const setState = (mode, msg = '') => { state.mode = mode; el.processState.textContent = `Status: ${mode}${msg ? ` • ${msg}` : ''}`; };
  const size = (b) => `${(b / (1024 * 1024)).toFixed(2)} MB`;
  const stamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const append = (t) => { const text = el.punct.checked ? t.trim() : t.replace(/[.,!?;:]/g, '').trim(); if (!text) return; el.transcriptOutput.value += `${el.transcriptOutput.value ? '\n\n' : ''}${el.ts.checked ? `[${stamp()}] ` : ''}${text}`; el.transcriptOutput.scrollTop = el.transcriptOutput.scrollHeight; };

  const updateButtons = () => {
    const busy = ['uploading', 'processing'].includes(state.mode);
    [el.transcribe, el.copy, el.download].forEach((button) => { button.disabled = busy; });
    el.mediaInput.disabled = busy || state.recording;
    el.start.disabled = busy || state.recording || !hasMediaRecorder || !hasSecureMicContext;
    el.pause.disabled = busy || !state.recording || !state.recorder || typeof state.recorder.pause !== 'function' || typeof state.recorder.resume !== 'function';
    el.stop.disabled = busy || !state.recording;
  };

  const validateFile = (file) => {
    if (!file) return 'No file selected.';
    if (!SUPPORTED_TYPES.has(file.type)) return 'Unsupported file type. Use mp3, wav, m4a, mp4, ogg, or webm.';
    if (file.size > MAX_SIZE_BYTES) return 'File too large. Max 25MB.';
    return '';
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result || '').split(',')[1] || ''); reader.onerror = () => reject(new Error('Could not read the selected audio file.')); reader.readAsDataURL(file); });
  const getRecorderType = () => RECORDER_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) || '';
  const extensionForType = (mimeType = '') => (mimeType.includes('mp4') ? 'm4a' : mimeType.includes('ogg') ? 'ogg' : 'webm');
  const stopStream = () => { state.stream?.getTracks?.().forEach((track) => track.stop()); state.stream = null; };
  const getRecordingErrorMessage = (error) => {
    if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError') return 'Microphone permission denied. Allow microphone access and try again.';
    if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') return 'No microphone found. Connect a microphone and try again.';
    if (error?.name === 'NotReadableError') return 'Microphone is busy or unavailable. Close other apps using it and try again.';
    if (!hasSecureMicContext) return 'Microphone recording requires HTTPS or localhost.';
    return 'Recording failed. Please check microphone permissions and try again.';
  };

  async function callTranscribe(payload) {
    for (const route of API_ROUTES) {
      const res = await fetch(route, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.status === 404) continue;
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Transcription failed.');
      return data;
    }
    throw new Error('Server transcription route not available. Configure /api/transcribe or /.netlify/functions/transcribe on the server.');
  }

  el.mediaInput.addEventListener('change', () => {
    const file = el.mediaInput.files?.[0] || null; const err = validateFile(file);
    if (err) { state.file = null; el.fileStatus.textContent = err; setState('error', err); updateButtons(); return; }
    state.file = file; el.fileStatus.textContent = `${file.name} • ${size(file.size)} • Ready`; setState('completed', 'File ready'); updateButtons();
  });

  async function startRecording() {
    if (!hasMediaRecorder) { setState('error', 'This browser does not support microphone recording.'); el.recordingStatus.textContent = 'Microphone recording is not supported in this browser.'; updateButtons(); return; }
    if (!hasSecureMicContext) { setState('error', 'Microphone recording requires HTTPS or localhost.'); el.recordingStatus.textContent = 'Use HTTPS or localhost to record audio.'; updateButtons(); return; }
    if (state.recording) return;
    try {
      state.chunks = [];
      state.discardRecording = false;
      state.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getRecorderType();
      state.recorder = new MediaRecorder(state.stream, mimeType ? { mimeType } : undefined);
      state.recorder.ondataavailable = (event) => { if (event.data?.size) state.chunks.push(event.data); };
      state.recorder.onerror = (event) => {
        const message = getRecordingErrorMessage(event.error);
        setState('error', message);
        el.recordingStatus.textContent = message;
        state.recording = false;
        state.paused = false;
        stopStream();
        updateButtons();
      };
      state.recorder.onstop = () => {
        const type = state.recorder?.mimeType || mimeType || 'audio/webm';
        const shouldDiscard = state.discardRecording;
        state.discardRecording = false;
        const blob = new Blob(state.chunks, { type });
        state.recording = false;
        state.paused = false;
        stopStream();
        if (shouldDiscard) {
          state.file = null;
          state.chunks = [];
          el.recordingStatus.textContent = 'Microphone is idle.';
          setState('idle', 'Ready to transcribe');
        } else if (blob.size) {
          const name = `recording-${Date.now()}.${extensionForType(type)}`;
          state.file = typeof File === 'function' ? new File([blob], name, { type }) : Object.assign(blob, { name });
          el.fileStatus.textContent = `${name} • ${size(blob.size)} • Ready to transcribe`;
          el.recordingStatus.textContent = 'Recording saved. Click Transcribe to generate text.';
          setState('completed', 'Recording ready');
        } else {
          state.file = null;
          el.recordingStatus.textContent = 'No audio was captured. Try recording again.';
          setState('error', 'No audio was captured.');
        }
        el.pause.textContent = 'Pause';
        updateButtons();
      };
      state.recorder.start(1000);
      state.recording = true;
      state.paused = false;
      el.pause.textContent = 'Pause';
      el.recordingStatus.textContent = 'Recording started.';
      setState('recording', 'Listening...');
      updateButtons();
    } catch (error) {
      const message = getRecordingErrorMessage(error);
      state.recording = false;
      state.paused = false;
      stopStream();
      setState('error', message);
      el.recordingStatus.textContent = message;
      updateButtons();
    }
  }

  el.start.addEventListener('click', startRecording);
  el.pause.addEventListener('click', () => {
    if (!state.recorder || !state.recording) return;
    if (state.recorder.state === 'recording') { state.recorder.pause(); state.paused = true; el.pause.textContent = 'Resume'; el.recordingStatus.textContent = 'Recording paused.'; setState('recording', 'Paused'); }
    else if (state.recorder.state === 'paused') { state.recorder.resume(); state.paused = false; el.pause.textContent = 'Pause'; el.recordingStatus.textContent = 'Recording resumed.'; setState('recording', 'Listening...'); }
    updateButtons();
  });
  el.stop.addEventListener('click', () => { if (state.recorder && state.recording && state.recorder.state !== 'inactive') state.recorder.stop(); });

  el.transcribe.addEventListener('click', async () => {
    if (state.mode === 'processing') return;
    el.actionStatus.textContent = '';
    const manual = el.manualInput.value.trim();
    if (!state.file && !manual) { setState('error', 'Upload a file, record voice, or paste text first.'); return; }
    if (state.file) {
      const err = validateFile(state.file);
      if (err) { setState('error', err); el.fileStatus.textContent = err; updateButtons(); return; }
    }
    setState('processing', 'Transcribing...'); updateButtons();
    try {
      if (state.file) {
        const data = await callTranscribe({ fileName: state.file.name || 'recording.webm', mimeType: state.file.type || 'audio/webm', language: el.lang.value, addPunctuation: el.punct.checked, contentBase64: await fileToBase64(state.file) });
        append(String(data.text || ''));
      }
      if (manual) append(manual);
      setState('completed', 'Done');
      el.actionStatus.textContent = 'Transcript ready.';
    } catch (err) { setState('error', err.message || 'Failed'); el.actionStatus.textContent = err.message || 'Transcription failed.'; }
    updateButtons();
  });

  el.copy.addEventListener('click', async () => { if (!el.transcriptOutput.value.trim()) return; await navigator.clipboard.writeText(el.transcriptOutput.value); el.actionStatus.textContent = 'Transcript copied.'; });
  el.download.addEventListener('click', () => { const txt = el.transcriptOutput.value.trim(); if (!txt) return; const u = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' })); const a = document.createElement('a'); a.href = u; a.download = 'transcript.txt'; a.click(); URL.revokeObjectURL(u); el.actionStatus.textContent = 'Transcript downloaded.'; });
  el.reset.addEventListener('click', () => { if (state.recorder && state.recording && state.recorder.state !== 'inactive') { state.discardRecording = true; state.recorder.stop(); } stopStream(); state.file = null; state.chunks = []; state.recording = false; state.paused = false; el.mediaInput.value = ''; el.manualInput.value = ''; el.transcriptOutput.value = ''; el.fileStatus.textContent = 'No file selected.'; el.recordingStatus.textContent = hasMediaRecorder && hasSecureMicContext ? 'Microphone is idle.' : el.recordingStatus.textContent; setState('idle', 'Ready to transcribe'); updateButtons(); });

  if (!hasSecureMicContext) el.recordingStatus.textContent = 'Microphone recording requires HTTPS or localhost.';
  else if (!hasMediaRecorder) el.recordingStatus.textContent = 'This browser does not support microphone recording.';
  setState('idle', 'Ready to transcribe'); updateButtons();
})();
