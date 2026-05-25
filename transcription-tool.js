(function () {
  const MAX_SIZE_BYTES = 25 * 1024 * 1024;
  const SUPPORTED_TYPES = new Set(['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a', 'video/mp4', 'video/webm']);
  const API_ROUTES = ['/api/transcribe', '/.netlify/functions/transcribe'];
  const el = {
    mediaInput: document.getElementById('mediaInput'), fileStatus: document.getElementById('fileStatus'), processState: document.getElementById('processState'),
    recordingStatus: document.getElementById('recordingStatus'), actionStatus: document.getElementById('actionStatus'), transcriptOutput: document.getElementById('transcriptOutput'),
    manualInput: document.getElementById('manualInput'), start: document.getElementById('startRecording'), pause: document.getElementById('pauseRecording'), stop: document.getElementById('stopRecording'),
    transcribe: document.getElementById('transcribeButton'), copy: document.getElementById('copyTranscript'), download: document.getElementById('downloadTranscript'), reset: document.getElementById('resetTranscript'),
    lang: document.getElementById('languageSelect'), ts: document.getElementById('timestampToggle'), punct: document.getElementById('punctuationToggle')
  };
  const state = { mode: 'idle', file: null, rec: null, recording: false, paused: false };
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  const setState = (mode, msg = '') => { state.mode = mode; el.processState.textContent = `Status: ${mode}${msg ? ` • ${msg}` : ''}`; };
  const size = (b) => `${(b / (1024 * 1024)).toFixed(2)} MB`;
  const stamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const append = (t) => { const text = el.punct.checked ? t.trim() : t.replace(/[.,!?;:]/g, '').trim(); if (!text) return; el.transcriptOutput.value += `${el.transcriptOutput.value ? '\n\n' : ''}${el.ts.checked ? `[${stamp()}] ` : ''}${text}`; el.transcriptOutput.scrollTop = el.transcriptOutput.scrollHeight; };

  const updateButtons = () => { const busy = ['uploading', 'processing'].includes(state.mode); [el.transcribe, el.copy, el.download].forEach((b) => (b.disabled = busy)); el.mediaInput.disabled = busy || state.recording; el.start.disabled = busy || !SR || state.recording; el.pause.disabled = busy || !SR || !state.recording; el.stop.disabled = busy || !SR || !state.recording; };

  const validateFile = (f) => {
    if (!f) return 'No file selected.';
    if (!SUPPORTED_TYPES.has(f.type)) return 'Unsupported file type. Use mp3, wav, m4a, mp4, or webm.';
    if (f.size > MAX_SIZE_BYTES) return 'File too large. Max 25MB.';
    return '';
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result || '').split(',')[1] || ''); r.onerror = reject; r.readAsDataURL(file); });

  async function callTranscribe(payload) {
    for (const route of API_ROUTES) {
      const res = await fetch(route, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.status === 404) continue;
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Transcription failed.');
      return data;
    }
    throw new Error('Server transcription route not available in this environment.');
  }

  el.mediaInput.addEventListener('change', () => {
    const file = el.mediaInput.files?.[0] || null; const err = validateFile(file);
    if (err) { state.file = null; el.fileStatus.textContent = err; setState('error', err); updateButtons(); return; }
    state.file = file; el.fileStatus.textContent = `${file.name} • ${size(file.size)} • Ready`; setState('completed', 'File ready'); updateButtons();
  });

  if (SR) {
    state.rec = new SR(); state.rec.continuous = true; state.rec.interimResults = true;
    state.rec.onstart = () => { state.recording = true; state.paused = false; setState('recording', 'Listening...'); el.recordingStatus.textContent = 'Recording started.'; el.pause.textContent = 'Pause'; updateButtons(); };
    state.rec.onresult = (ev) => { for (let i = ev.resultIndex; i < ev.results.length; i += 1) if (ev.results[i].isFinal) append(ev.results[i][0].transcript); };
    state.rec.onerror = (e) => { setState('error', e.error === 'not-allowed' ? 'Microphone permission denied.' : 'Recording failed.'); el.recordingStatus.textContent = 'Recording error.'; state.recording = false; state.paused = false; updateButtons(); };
    state.rec.onend = () => { state.recording = false; if (!state.paused) el.recordingStatus.textContent = 'Recording stopped.'; setState('completed', 'Transcript ready'); updateButtons(); };
  } else { el.recordingStatus.textContent = 'This browser does not support microphone transcription.'; }

  el.start.addEventListener('click', () => { if (!state.rec) return; state.rec.lang = el.lang.value === 'hi' ? 'hi-IN' : el.lang.value === 'es' ? 'es-ES' : 'en-US'; state.rec.start(); });
  el.pause.addEventListener('click', () => { if (!state.rec || !state.recording) return; if (state.paused) { state.paused = false; el.pause.textContent = 'Pause'; state.rec.start(); } else { state.paused = true; el.pause.textContent = 'Resume'; state.rec.stop(); } });
  el.stop.addEventListener('click', () => { if (state.rec && state.recording) state.rec.stop(); });

  el.transcribe.addEventListener('click', async () => {
    if (state.mode === 'processing') return;
    el.actionStatus.textContent = '';
    const manual = el.manualInput.value.trim();
    if (!state.file && !manual) { setState('error', 'Upload a file, record voice, or paste text first.'); return; }
    setState('processing', 'Transcribing...'); updateButtons();
    try {
      if (state.file) {
        const data = await callTranscribe({ fileName: state.file.name, mimeType: state.file.type, language: el.lang.value, addPunctuation: el.punct.checked, contentBase64: await fileToBase64(state.file) });
        append(String(data.text || ''));
      }
      if (manual) append(manual);
      setState('completed', 'Done');
    } catch (err) { setState('error', err.message || 'Failed'); }
    updateButtons();
  });

  el.copy.addEventListener('click', async () => { if (!el.transcriptOutput.value.trim()) return; await navigator.clipboard.writeText(el.transcriptOutput.value); el.actionStatus.textContent = 'Transcript copied.'; });
  el.download.addEventListener('click', () => { const txt = el.transcriptOutput.value.trim(); if (!txt) return; const u = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' })); const a = document.createElement('a'); a.href = u; a.download = 'transcript.txt'; a.click(); URL.revokeObjectURL(u); el.actionStatus.textContent = 'Transcript downloaded.'; });
  el.reset.addEventListener('click', () => { if (state.rec && state.recording) state.rec.stop(); state.file = null; el.mediaInput.value = ''; el.manualInput.value = ''; el.transcriptOutput.value = ''; el.fileStatus.textContent = 'No file selected.'; el.recordingStatus.textContent = 'Microphone is idle.'; setState('idle', 'Ready to transcribe'); updateButtons(); });

  setState('idle', 'Ready to transcribe'); updateButtons();
})();
