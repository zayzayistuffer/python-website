(function () {
  const existingModal = document.getElementById('request-lesson-modal') || document.getElementById('lesson-modal');
  const modal = existingModal || document.createElement('dialog');

  if (!existingModal) {
    modal.id = 'request-lesson-modal';
    modal.className = 'lesson-modal';
    modal.setAttribute('aria-labelledby', 'request-modal-title');
    modal.innerHTML = `<div class="lesson-dialog"><button class="lesson-close" type="button" aria-label="Close lesson request">×</button><p class="eyebrow"><span class="eyebrow-dot"></span> Personal guidance</p><h2 id="request-modal-title">Shape your<br><i>next lesson.</i></h2><form class="request-form" method="post" action="/api/lesson-request"><div class="request-field"><label for="request-user">Discord username <span>*</span></label><input id="request-user" name="discord_username" required maxlength="100"></div><div class="request-field"><label for="request-level">Python experience <span>*</span></label><select id="request-level" name="experience" required><option value="">Choose your current level</option><option>Just starting</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Professional developer</option></select></div><div class="request-field"><label for="request-helper">Who would you like help from? <span>*</span></label><select id="request-helper" name="helper_type" required><option value="">Choose a helper</option><option>A professional trainer</option><option>A volunteer helper</option><option>The owner</option></select></div><div class="request-field"><label for="request-goals">What would you like to learn or build? <span>*</span></label><textarea id="request-goals" name="goals" rows="3" maxlength="1000" required></textarea></div><div class="request-field"><label for="request-availability">When are you available? <span>*</span></label><input id="request-availability" name="availability" maxlength="1000" required></div><div class="request-field"><label for="request-context">Anything else to share?</label><textarea id="request-context" name="context" rows="2" maxlength="1000"></textarea></div><button class="request-submit" type="submit">Send lesson request <span aria-hidden="true">↗</span></button></form></div>`;
    document.body.appendChild(modal);
  }

  const openRequestModal = () => {
    if (modal && !modal.open) modal.showModal();
  };

  const closeRequestModal = () => {
    if (modal && modal.open) modal.close();
  };

  modal.querySelector('.lesson-close')?.addEventListener('click', closeRequestModal);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeRequestModal(); });
  modal.addEventListener('close', () => {
    if (!existingModal && modal.parentNode) modal.remove();
  });

  modal.querySelector('.request-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submitButton = form.querySelector('.request-submit');
    submitButton.disabled = true;
    let result;
    try {
      const formData = new FormData(form);
      const payload = {
        discord_username: formData.get('discord_username'),
        experience: formData.get('experience'),
        helper_type: formData.get('helper_type'),
        goals: formData.get('goals'),
        availability: formData.get('availability'),
        context: formData.get('context') || '',
      };

      const response = await fetch('/api/lesson-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      result = response.ok
        ? { ok: true, message: 'Your request is on its way. A helper will reach out in Discord.' }
        : { ok: false, error: data.error || 'We could not send your request right now.' };
    } catch (error) {
      result = { ok: false, error: 'We could not reach the service. Please try again.' };
    } finally {
      submitButton.disabled = false;
    }

    const notice = document.createElement('div');
    notice.className = `request-notice ${result.ok ? 'request-success' : 'request-error'}`;
    notice.setAttribute('role', result.ok ? 'status' : 'alert');
    notice.textContent = result.ok ? result.message : result.error;
    form.prepend(notice);
    if (result.ok) form.reset();
  });

  const triggerSelectors = [
    '[data-open-request]',
    '#open-lesson-modal',
    '#open-lesson-modal-hero',
    '#open-request-modal',
  ];

  triggerSelectors.forEach((selector) => {
    const nodes = document.querySelectorAll(selector);
    nodes.forEach((trigger) => trigger.addEventListener('click', openRequestModal));
  });
})();
