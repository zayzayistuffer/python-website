(function () {
  const triggers = document.querySelectorAll('[data-open-request]');
  if (!triggers.length || document.querySelector('#lesson-modal')) return;

  triggers.forEach((trigger) => trigger.addEventListener('click', () => {
    const modal = document.createElement('dialog');
    modal.className = 'lesson-modal';
    modal.setAttribute('aria-labelledby', 'request-modal-title');
      modal.innerHTML = `<div class="lesson-dialog"><button class="lesson-close" type="button" aria-label="Close lesson request">×</button><p class="eyebrow"><span class="eyebrow-dot"></span> Personal guidance</p><h2 id="request-modal-title">Shape your<br><i>next lesson.</i></h2><form class="request-form" method="post" action="https://code.pip.abrdns.com/api/lesson-request"><div class="request-field"><label for="request-user">Discord username <span>*</span></label><input id="request-user" name="discord_username" required maxlength="100"></div><div class="request-field"><label for="request-level">Python experience <span>*</span></label><select id="request-level" name="experience" required><option value="">Choose your current level</option><option>Just starting</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Professional developer</option></select></div><div class="request-field"><label for="request-helper">Who would you like help from? <span>*</span></label><select id="request-helper" name="helper_type" required><option value="">Choose a helper</option><option>A professional trainer</option><option>A volunteer helper</option><option>The owner</option></select></div><div class="request-field"><label for="request-goals">What would you like to learn or build? <span>*</span></label><textarea id="request-goals" name="goals" rows="3" maxlength="1000" required></textarea></div><div class="request-field"><label for="request-availability">When are you available? <span>*</span></label><input id="request-availability" name="availability" maxlength="1000" required></div><div class="request-field"><label for="request-context">Anything else to share?</label><textarea id="request-context" name="context" rows="2" maxlength="1000"></textarea></div><button class="request-submit" type="submit">Send lesson request <span aria-hidden="true">↗</span></button></form></div>`;
    document.body.appendChild(modal);
    modal.showModal();
    modal.querySelector('.lesson-close').addEventListener('click', () => modal.close());
    modal.querySelector('.request-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const submitButton = form.querySelector('.request-submit');
      submitButton.disabled = true;
      let result;
      try {
        const formData = new FormData(form);
        const embed = {
          title: '📚 New Lesson Request, @Owner @Co Owner @Trainer @Voluntary Helper ',
          color: 3093151,
          fields: [
            { name: 'Discord Username', value: formData.get('discord_username'), inline: true },
            { name: 'Experience Level', value: formData.get('experience'), inline: true },
            { name: 'Helper Type', value: formData.get('helper_type'), inline: false },
            { name: 'Learning Goals', value: formData.get('goals'), inline: false },
            { name: 'Availability', value: formData.get('availability'), inline: true },
            { name: 'Additional Context', value: formData.get('context') || 'None provided', inline: false }
          ],
          timestamp: new Date().toISOString()
        };
        const response = await fetch('https://discord.com/api/webhooks/1543064103042555906/9xO8TnZyi19K5kbEChZMqlFoB57LfVbrvGEK8C_SyjSn4icI4UG2JiKAW6XHzSlAlti7', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ embeds: [embed] })
        });
        if (response.ok) {
          result = { ok: true, message: 'Your request has been sent to Discord!' };
        } else {
          result = { ok: false, error: 'Failed to send request. Please try again.' };
        }
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
    modal.addEventListener('close', () => modal.remove());
    modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });
  }));
})();
