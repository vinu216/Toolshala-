document.addEventListener('DOMContentLoaded', () => {
  const leaveVersions = [
    {
      id: 'school-leave-application',
      label: 'School Leave Application',
      values: {
        sender: '[Student Name]\nClass [Class/Section], Roll No. [Roll Number]\n[School Name]',
        date: '[Date]',
        recipient: 'The Principal\n[School Name]\n[City]',
        subject: 'Subject: Application for Leave from [Start Date] to [End Date]',
        salutation: 'Respected Sir/Madam,',
        reason: 'I am [Student Name], a student of Class [Class/Section]. I am unable to attend school due to [reason].',
        duration: 'I kindly request leave from [Start Date] to [End Date].',
        approval: 'Please grant me leave for the mentioned duration. I will complete all pending classwork after returning.',
        closing: 'Thank you for your consideration.\n\nYours obediently,\n[Student Name]\n[Parent/Guardian Signature if required]'
      }
    },
    {
      id: 'college-leave-application',
      label: 'College Leave Application',
      values: {
        sender: '[Your Name]\n[Year / Department]\n[College Name]\n[Enrollment Number]',
        date: '[Date]',
        recipient: 'The Head of Department\n[Department Name]\n[College Name]',
        subject: 'Subject: Request for Leave from [Start Date] to [End Date]',
        salutation: 'Respected Sir/Madam,',
        reason: 'I am writing to request leave due to [reason]. I am currently pursuing [Course Name] in [Year/Semester].',
        duration: 'I request leave for the period from [Start Date] to [End Date].',
        approval: 'Kindly approve my leave request. I will cover all missed lectures and submissions immediately after rejoining.',
        closing: 'Thank you for your support.\n\nSincerely,\n[Your Name]\n[Contact Number]'
      }
    },
    {
      id: 'office-leave-application',
      label: 'Office Leave Application',
      values: {
        sender: '[Your Name]\n[Job Title / Department]\n[Company Name]',
        date: '[Date]',
        recipient: '[Manager Name]\n[Manager Designation]\n[Company Name]',
        subject: 'Subject: Leave Application from [Start Date] to [End Date]',
        salutation: 'Dear [Manager Name],',
        reason: 'I am writing to request leave due to [reason]. I have planned my current tasks to ensure smooth handover.',
        duration: 'I request leave from [Start Date] to [End Date] and will be available for urgent clarification if needed.',
        approval: 'Kindly consider and approve my leave request. I will resume work on [Return Date] and ensure continuity of pending tasks.',
        closing: 'Thank you for your understanding.\n\nRegards,\n[Your Name]\n[Employee ID]'
      }
    }
  ];

  const fields = Array.from(document.querySelectorAll('[data-leave-field]'));
  const switcher = document.getElementById('leaveVersionSwitcher');
  const feedbackNode = document.getElementById('leaveTemplateFeedback');
  const copyButton = document.getElementById('copyLeaveTemplate');
  const printButton = document.getElementById('printLeaveTemplate');
  const resetButton = document.getElementById('resetLeaveTemplate');
  let activeVersionId = leaveVersions[0].id;

  const fieldOrder = ['sender', 'date', 'recipient', 'subject', 'salutation', 'reason', 'duration', 'approval', 'closing'];

  const getActiveVersion = () => leaveVersions.find((version) => version.id === activeVersionId) || leaveVersions[0];

  const setFeedback = (message, isError = false) => {
    if (!feedbackNode) return;
    feedbackNode.textContent = message;
    feedbackNode.classList.remove('hidden');
    feedbackNode.classList.toggle('text-emerald-700', !isError);
    feedbackNode.classList.toggle('text-rose-700', isError);
    window.setTimeout(() => feedbackNode.classList.add('hidden'), 2600);
  };

  const hydrateFields = (values) => {
    fields.forEach((field) => {
      const key = field.getAttribute('data-leave-field');
      field.textContent = values[key] || '';
    });
  };

  const renderSwitcher = () => {
    if (!switcher) return;

    switcher.innerHTML = leaveVersions
      .map((version) => {
        const activeClass = version.id === activeVersionId ? 'active' : '';
        return `<button type="button" class="filter-btn ${activeClass}" data-leave-version="${version.id}">${version.label}</button>`;
      })
      .join('');

    switcher.querySelectorAll('[data-leave-version]').forEach((button) => {
      button.addEventListener('click', () => {
        const versionId = button.getAttribute('data-leave-version');
        const selectedVersion = leaveVersions.find((version) => version.id === versionId);
        if (!selectedVersion) return;
        activeVersionId = selectedVersion.id;
        hydrateFields(selectedVersion.values);
        renderSwitcher();
      });
    });
  };

  const buildLeaveText = () => {
    const values = {};
    fields.forEach((field) => {
      const key = field.getAttribute('data-leave-field');
      values[key] = field.textContent.trim();
    });

    return fieldOrder
      .map((key, index) => {
        const value = values[key] || '';
        if (!value) return '';
        return index >= 4 ? value : `${value}`;
      })
      .filter(Boolean)
      .join('\n\n')
      .trim();
  };

  const copyLeaveText = async () => {
    try {
      await navigator.clipboard.writeText(buildLeaveText());
      setFeedback('Leave application copied. Personalize and submit.');
    } catch (error) {
      setFeedback('Copy failed. Please copy manually from the preview.', true);
    }
  };

  const resetActiveVersion = () => {
    hydrateFields(getActiveVersion().values);
    setFeedback('Template reset to selected version defaults.');
  };

  const setApplicationData = (payload) => {
    if (!payload || typeof payload !== 'object') return false;
    const targetVersion = leaveVersions.find((version) => version.id === activeVersionId);
    if (!targetVersion) return false;

    fieldOrder.forEach((key) => {
      if (typeof payload[key] === 'string' && payload[key].trim()) {
        targetVersion.values[key] = payload[key].trim();
      }
    });

    hydrateFields(targetVersion.values);
    return true;
  };

  window.ToolShalaLeaveApplicationTemplateAPI = {
    getActiveVersion,
    setApplicationData
  };

  renderSwitcher();
  hydrateFields(getActiveVersion().values);

  copyButton?.addEventListener('click', copyLeaveText);
  printButton?.addEventListener('click', () => window.print());
  resetButton?.addEventListener('click', resetActiveVersion);
});
