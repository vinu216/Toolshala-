(function () {
  const mediaInput = document.getElementById('mediaInput');
  const uploadDropzone = document.getElementById('uploadDropzone');
  const fileStatus = document.getElementById('fileStatus');
  const processState = document.getElementById('processState');
  const recordingStatus = document.getElementById('recordingStatus');
  const actionStatus = document.getElementById('actionStatus');
  const transcriptOutput = document.getElementById('transcriptOutput');
  const manualInput = document.getElementById('manualInput');
  const startButton = document.getElementById('startRecording');
  const pauseButton = document.getElementById('pauseRecording');
  const stopButton = document.getElementById('stopRecording');
  const copyButton = document.getElementById('copyTranscript');
  const selectAllButton = document.getElementById('selectAllTranscript');
  const downloadButton = document.getElementById('downloadTranscript');
  const resetButton = document.getElementById('resetTranscript');
  const timestampToggle = document.getElementById('timestampToggle');
  const punctuationToggle = document.getElementById('punctuationToggle');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const allowedTypes = new Set(['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/ogg', 'video/mp4', 'video/webm', 'video/quicktime']);
  const state = { mode: 'idle', isRecording: false, isPaused: false, recognition: null };

  const setState = (mode, message) => {
    state.mode = mode;
    processState.textContent = `Status: ${mode}${message ? ` • ${message}` : ''}`;
  };

  const formatSize = (bytes) => `${Math.max(1, Math.round(bytes / 1024))} KB`;
  const getTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const getTranscriptText = () => transcriptOutput.value.trim() || manualInput.value.trim();

  const updateButtons = () => {
    const busy = state.mode === 'uploading' || state.mode === 'processing';
    startButton.disabled = busy || !SpeechRecognition || state.isRecording;
    pauseButton.disabled = busy || !SpeechRecognition || !state.isRecording;
    stopButton.disabled = busy || !SpeechRecognition || !state.isRecording;
    copyButton.disabled = busy;
    selectAllButton.disabled = busy;
    downloadButton.disabled = busy;
    mediaInput.disabled = busy || state.isRecording;
  };

  const appendTranscript = (text) => {
    const cleaned = punctuationToggle.checked ? text.trim() : text.replace(/[.,!?;:]/g, '').trim();
    if (!cleaned) return;
    const line = timestampToggle.checked ? `[${getTimestamp()}] ${cleaned}` : cleaned;
    transcriptOutput.value = `${transcriptOutput.value}${transcriptOutput.value ? '\n\n' : ''}${line}`;
    transcriptOutput.scrollTop = transcriptOutput.scrollHeight;
  };

  const handleFile = (file) => {
    if (!file) {
      setState('idle', 'No file selected');
      fileStatus.textContent = 'No file selected.';
      updateButtons();
      return;
    }
    if (!(file.type.startsWith('audio/') || file.type.startsWith('video/')) || (file.type && !allowedTypes.has(file.type))) {
      setState('error', 'Unsupported file type');
      fileStatus.textContent = 'Please upload a supported audio/video format.';
      return;
    }

    setState('uploading', 'Reading metadata...');
    updateButtons();
    fileStatus.textContent = `Selected: ${file.name} • ${formatSize(file.size)}`;

    const mediaEl = document.createElement(file.type.startsWith('video/') ? 'video' : 'audio');
    mediaEl.preload = 'metadata';
    const fileUrl = URL.createObjectURL(file);
    mediaEl.src = fileUrl;

    mediaEl.onloadedmetadata = () => {
      const duration = Number.isFinite(mediaEl.duration) ? `${Math.round(mediaEl.duration)}s` : 'Unknown duration';
      fileStatus.textContent = `Selected: ${file.name} • ${duration} • ${formatSize(file.size)} • Ready`;
      setState('processing', 'File metadata loaded. Live mic transcription available.');
      updateButtons();
      URL.revokeObjectURL(fileUrl);
      setState('completed', 'Ready for recording or manual editing.');
      updateButtons();
    };

    mediaEl.onerror = () => {
      setState('error', 'Could not read file metadata');
      fileStatus.textContent = 'Could not read this file. Try another supported format.';
      URL.revokeObjectURL(fileUrl);
      updateButtons();
    };
  };

  mediaInput?.addEventListener('change', () => handleFile(mediaInput.files?.[0]));

  uploadDropzone?.addEventListener('dragover', (event) => {
    event.preventDefault();
    uploadDropzone.classList.add('border-indigo-400', 'bg-indigo-50');
  });
  uploadDropzone?.addEventListener('dragleave', () => uploadDropzone.classList.remove('border-indigo-400', 'bg-indigo-50'));
  uploadDropzone?.addEventListener('drop', (event) => {
    event.preventDefault();
    uploadDropzone.classList.remove('border-indigo-400', 'bg-indigo-50');
    const droppedFile = event.dataTransfer?.files?.[0];
    if (!droppedFile) return;
    const transfer = new DataTransfer();
    transfer.items.add(droppedFile);
    mediaInput.files = transfer.files;
    handleFile(droppedFile);
  });

  if (SpeechRecognition) {
    state.recognition = new SpeechRecognition();
    state.recognition.continuous = true;
    state.recognition.interimResults = true;
    state.recognition.lang = 'en-US';

    state.recognition.onstart = () => {
      state.isRecording = true;
      state.isPaused = false;
      setState('recording', 'Listening...');
      recordingStatus.textContent = 'Recording started.';
      pauseButton.textContent = 'Pause';
      updateButtons();
    };

    state.recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) appendTranscript(text);
        else interim += text;
      }
      recordingStatus.textContent = interim ? `Live: ${interim.trim()}` : state.isPaused ? 'Recording paused.' : 'Recording in progress...';
    };

    state.recognition.onerror = (event) => {
      state.isRecording = false;
      state.isPaused = false;
      const errors = {
        'not-allowed': 'Microphone permission denied. Allow microphone access and retry.',
        'audio-capture': 'No microphone detected. Connect a microphone and retry.',
        network: 'Speech recognition network issue. Check connection and retry.'
      };
      setState('error', errors[event.error] || 'Speech recognition error');
      recordingStatus.textContent = errors[event.error] || 'Speech recognition failed.';
      updateButtons();
    };

    state.recognition.onend = () => {
      if (state.isRecording && !state.isPaused) {
        state.recognition.start();
        return;
      }
      state.isRecording = false;
      setState('completed', 'Transcript ready to review.');
      recordingStatus.textContent = state.isPaused ? 'Recording paused.' : 'Recording stopped.';
      updateButtons();
    };
  } else {
    setState('error', 'Browser does not support SpeechRecognition');
    recordingStatus.textContent = 'Live recording is unavailable in this browser. Use upload + manual input fallback.';
  }

  startButton?.addEventListener('click', () => {
    actionStatus.textContent = '';
    if (!state.recognition || state.isRecording) return;
    setState('processing', 'Preparing microphone...');
    updateButtons();
    state.recognition.start();
  });

  pauseButton?.addEventListener('click', () => {
    if (!state.recognition || !state.isRecording) return;
    if (state.isPaused) {
      state.isPaused = false;
      pauseButton.textContent = 'Pause';
      setState('recording', 'Listening...');
      state.recognition.start();
      return;
    }
    state.isPaused = true;
    pauseButton.textContent = 'Resume';
    setState('processing', 'Paused');
    state.recognition.stop();
  });

  stopButton?.addEventListener('click', () => {
    if (!state.recognition || !state.isRecording) return;
    state.isPaused = false;
    state.isRecording = false;
    pauseButton.textContent = 'Pause';
    setState('processing', 'Stopping...');
    state.recognition.stop();
  });

  copyButton?.addEventListener('click', async () => {
    const text = getTranscriptText();
    if (!text) return (actionStatus.textContent = 'No transcript text available to copy.');
    try {
      await navigator.clipboard.writeText(text);
      actionStatus.textContent = 'Transcript copied successfully.';
    } catch (_error) {
      actionStatus.textContent = 'Clipboard access failed. Please copy manually.';
    }
  });

  selectAllButton?.addEventListener('click', () => {
    transcriptOutput.focus();
    transcriptOutput.select();
    actionStatus.textContent = 'Transcript selected.';
  });

  downloadButton?.addEventListener('click', () => {
    const text = getTranscriptText();
    if (!text) return (actionStatus.textContent = 'No transcript text available to download.');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toolshala-transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    actionStatus.textContent = 'Transcript downloaded as .txt.';
  });

  resetButton?.addEventListener('click', () => {
    if (state.recognition && state.isRecording) {
      state.isRecording = false;
      state.isPaused = false;
      state.recognition.stop();
    }
    transcriptOutput.value = '';
    manualInput.value = '';
    mediaInput.value = '';
    fileStatus.textContent = 'No file selected.';
    recordingStatus.textContent = 'Microphone is idle.';
    pauseButton.textContent = 'Pause';
    actionStatus.textContent = 'Tool reset complete. Ready for a new transcription.';
    setState('idle', 'Ready to transcribe');
    updateButtons();
  });

  window.addEventListener('beforeunload', () => {
    if (state.recognition && state.isRecording) {
      state.isRecording = false;
      state.recognition.stop();
    }
  });

  setState('idle', 'Ready to transcribe');
  updateButtons();
})();
