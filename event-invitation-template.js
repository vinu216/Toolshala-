document.addEventListener('DOMContentLoaded', () => {
  const invitationVersions = [
    {
      id: 'formal-event-invitation',
      label: 'Formal Event Invitation',
      values: {
        event: 'Event Name: [Annual Seminar / College Event Name]',
        date: 'Date: [Day, Date, Month, Year]',
        time: 'Time: [Start Time] to [End Time]',
        venue: 'Venue / Platform: [Auditorium Name / Zoom Link]',
        purpose: 'Purpose: We invite you to join this event focused on [topic/theme] to learn, network, and engage with experts.',
        agenda: 'Agenda / Highlights:\n- Welcome note\n- Key speaker session\n- Interactive discussion\n- Networking / Q&A',
        rsvp: 'RSVP: Please confirm your attendance by [Date] via [form/link/email].',
        contact: 'Contact Info: [Organizer Name], [Phone Number], [Email Address]'
      }
    },
    {
      id: 'casual-event-invitation',
      label: 'Casual Event Invitation',
      values: {
        event: 'Event Name: [Community Meetup / Club Celebration]',
        date: 'Date: [Date]',
        time: 'Time: [Time]',
        venue: 'Venue / Platform: [Location / Link]',
        purpose: 'Purpose: Come join us for a fun and meaningful gathering around [theme/activity].',
        agenda: 'Agenda / Highlights:\n- Icebreaker\n- Main activity\n- Open sharing\n- Closing note',
        rsvp: 'RSVP: Reply with "Yes" by [Date] or fill [link].',
        contact: 'Contact Info: [Name] | [Phone/WhatsApp]'
      }
    },
    {
      id: 'webinar-workshop-invitation',
      label: 'Webinar / Workshop Invitation',
      values: {
        event: 'Event Name: [Skill Workshop / Webinar Title]',
        date: 'Date: [Date]',
        time: 'Time: [Time + Time Zone]',
        venue: 'Venue / Platform: [Google Meet / Zoom / YouTube Live Link]',
        purpose: 'Purpose: This session will help participants learn practical strategies for [topic/outcome].',
        agenda: 'Agenda / Highlights:\n- Topic introduction\n- Live demo / framework\n- Practical takeaways\n- Q&A session',
        rsvp: 'RSVP: Register at [link] before [date]. Limited seats available.',
        contact: 'Contact Info: [Team Name], [Email], [Telegram/WhatsApp]'
      }
    }
  ];

  const fieldOrder = ['event', 'date', 'time', 'venue', 'purpose', 'agenda', 'rsvp', 'contact'];
  const fields = Array.from(document.querySelectorAll('[data-invite-field]'));
  const switcher = document.getElementById('invitationSwitcher');
  const feedbackNode = document.getElementById('invitationFeedback');
  const copyButton = document.getElementById('copyInvitationTemplate');
  const printButton = document.getElementById('printInvitationTemplate');
  const resetButton = document.getElementById('resetInvitationTemplate');
  let activeVersionId = invitationVersions[0].id;

  const getActiveVersion = () => invitationVersions.find((v) => v.id === activeVersionId) || invitationVersions[0];
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
      const key = field.getAttribute('data-invite-field');
      field.textContent = values[key] || '';
    });
  };

  const buildInvitationText = () => {
    const values = {};
    fields.forEach((field) => {
      const key = field.getAttribute('data-invite-field');
      values[key] = field.textContent.trim();
    });
    return fieldOrder.map((key) => values[key] || '').filter(Boolean).join('\n\n').trim();
  };

  const downloadInvitationText = () => {
    const slug = getActiveVersion().label.toLowerCase().replace(/\s+/g, '-');
    const blob = new Blob([buildInvitationText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `event-invitation-${slug}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const renderSwitcher = () => {
    if (!switcher) return;
    switcher.innerHTML = invitationVersions.map((version) => `<button type="button" class="filter-btn ${version.id === activeVersionId ? 'active' : ''}" data-invitation-version="${version.id}">${version.label}</button>`).join('');
    switcher.querySelectorAll('[data-invitation-version]').forEach((button) => {
      button.addEventListener('click', () => {
        const selectedVersion = invitationVersions.find((version) => version.id === button.getAttribute('data-invitation-version'));
        if (!selectedVersion) return;
        activeVersionId = selectedVersion.id;
        hydrateFields(selectedVersion.values);
        renderSwitcher();
      });
    });
  };

  const copyInvitationText = async () => {
    try {
      await navigator.clipboard.writeText(buildInvitationText());
      setFeedback('Invitation copied. Personalize and share.');
    } catch {
      setFeedback('Copy failed. Please copy manually from preview.', true);
    }
  };

  const resetActiveVersion = () => {
    hydrateFields(getActiveVersion().values);
    setFeedback('Invitation reset to selected version defaults.');
  };

  const setInvitationData = (payload) => {
    if (!payload || typeof payload !== 'object') return false;
    const targetVersion = getActiveVersion();
    let updated = false;
    fieldOrder.forEach((key) => {
      if (typeof payload[key] === 'string' && payload[key].trim()) {
        targetVersion.values[key] = payload[key].trim();
        updated = true;
      }
    });
    if (updated) hydrateFields(targetVersion.values);
    return updated;
  };

  window.ToolShalaEventInvitationTemplateAPI = { getActiveVersion, buildInvitationText, setInvitationData };

  renderSwitcher();
  hydrateFields(getActiveVersion().values);
  copyButton?.addEventListener('click', copyInvitationText);
  printButton?.addEventListener('click', () => {
    downloadInvitationText();
    window.print();
  });
  resetButton?.addEventListener('click', resetActiveVersion);
});
