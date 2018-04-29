/* global $ */
/* global m */
/* global grecaptcha */
import app from 'flarum/app';
import { extend, override } from 'flarum/extend';
import SignUpModal from 'flarum/components/SignUpModal';
// import LogInModal from 'flarum/components/LogInModal';

const invisible = true;

app.initializers.add('sijad-recaptcha', () => {
  const isAvail = () => typeof grecaptcha !== 'undefined';
  let recaptchaID;
  let submitCallback;

  function submit(token) {
    submitCallback && submitCallback();
  }

  function clean() {
    this.$('.g-recaptcha').remove();
  }

  function load() {
    const key = app.forum.attribute('recaptchaPublic');

    if (!key) return;

    const render = () => {
      if (this.$('.g-recaptcha').length) return;

      const version = invisible ? 'invisible' : 'v2';
      const $el = $(`<div class="Form-group g-recaptcha g-recaptcha-${version}">`);
      const $parent = this.$('[type="submit"]').parent();
      if (invisible) {
        $parent.after($el);
      } else {
        $parent.before($el);
      }

      if (!$el.data('g-rendred')) {
        recaptchaID = grecaptcha.render($el.get(0), {
          sitekey: key,
          theme: app.forum.attribute('darkMode') ? 'dark' : 'light',
          callback: submit,
          size: invisible && 'invisible',
          badge: invisible && 'inline',
        });
        $el.data('g-rendred', true);
      }
    }

    if (isAvail()) {
      render();
    } else {
      $.getScript(
        `https://www.google.com/recaptcha/api.js?hl=${app.locale}&render=explicit`,
        () => {
          let attemps = 0;
          const interval = setInterval(() => {
            ++attemps;
            if (isAvail()) {
              clearInterval(interval);
              render();
            }
            if (attemps > 100) {
              clearInterval(interval);
            }
          }, 100);
        }
      );
    }
  }
  extend(SignUpModal.prototype, 'config', load);
  // extend(LogInModal.prototype, 'config', load);

  extend(SignUpModal.prototype, 'logIn', clean);
  // extend(LogInModal.prototype, 'signUp', clean);

  extend(SignUpModal.prototype, 'submitData', function (data) {
    data['g-recaptcha-response'] = grecaptcha.getResponse(recaptchaID);
    return data;
  });

  extend(SignUpModal.prototype, 'onerror', function () {
    if (isAvail()) {
      grecaptcha.reset(recaptchaID);
    }
  });

  override(SignUpModal.prototype, 'onsubmit', function(original, e) {
    if (invisible) {
      e.preventDefault();
      submitCallback = () => original(e);
      grecaptcha.execute(recaptchaID);
    } else {
      original(e);
    }
  });
});
