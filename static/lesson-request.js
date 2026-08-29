(function () {
  const triggers = document.querySelectorAll('[data-lesson-request]');
  if (!triggers.length || document.querySelector('#lesson-modal')) return;

  const modal = document.createElement('dialog');
  modal.className = 'request-modal';
  modal.id = 'lesson-request-modal';
  modal.setAttribute('aria-labelledby', 'lesson-request-title');
  modal.innerHTML = `
    <div class="request-dialog">
      <button class="lesson-close" type="button" aria-label="Close lesson request">&times;</button>
      <p class="eyebrow"><span class="eyebrow-dot"></span> Personal guidance</p>
      <h2 id="lesson-request-title">Shape your<br><i>next lesson.</i></h2>
      <form class="request-form" method="post" action="https://code.pip.abrdns.com/templates/discord.html">
        <div class="request-field"><label for="request_discord_username">Discord username <span>*</span></label><input id="request_discord_username" name="discord_username" type="text" placeholder="yourname" maxlength="100" required></div>
        <div class="request-field"><label for="request_experience">How advanced are you in Python development? <span>*</span></label><select id="request_experience" name="experience" required><option value="">Choose your current level</option><option>Just starting</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Professional developer</option></select></div>
        <div class="request-field"><label for="request_helper_type">Who would you like help from? <span>*</span></label><select id="request_helper_type" name="helper_type" required><option value="">Choose a helper</option><option>A professional trainer</option><option>A volunteer helper</option><option>The owner</option></select></div>
        <div class="request-field"><label for="request_goals">What would you like to learn or build? <span>*</span></label><textarea id="request_goals" name="goals" rows="3" maxlength="1000" required></textarea></div>
        <div class="request-field"><label for="request_availability">When are you usually available? <span>*</span></label><input id="request_availability" name="availability" type="text" maxlength="1000" placeholder="Weekday evenings, UTC-5" required></div>
        <div class="request-field"><label for="request_context">Anything else that would help us prepare?</label><textarea id="request_context" name="context" rows="2" maxlength="1000"></textarea></div>
        <button class="request-submit" type="submit">Send lesson request <span aria-hidden="true">↗</span></button>
      </form>
    </div>`;
  document.body.appendChild(modal);

  const close = () => modal.close();
  triggers.forEach((trigger) => trigger.addEventListener('click', (event) => {
    event.preventDefault();
    modal.showModal();
  }));
  modal.querySelector('.lesson-close').addEventListener('click', close);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });
})();