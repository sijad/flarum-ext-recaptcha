'use strict';

System.register('sijad/recaptcha/main', ['flarum/app', 'flarum/extend', 'flarum/components/SignUpModal'], function (_export, _context) {
  "use strict";

  var app, extend, override, SignUpModal;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumExtend) {
      extend = _flarumExtend.extend;
      override = _flarumExtend.override;
    }, function (_flarumComponentsSignUpModal) {
      SignUpModal = _flarumComponentsSignUpModal.default;
    }],
    execute: function () {
      // import LogInModal from 'flarum/components/LogInModal';

      app.initializers.add('sijad-recaptcha', function () {
        var isAvail = function isAvail() {
          return typeof grecaptcha !== 'undefined';
        };
        var recaptchaValue = void 0;
        var recaptchaID = void 0;
        var submitCallback = void 0;

        function submit(token) {
          recaptchaValue = token;
          submitCallback && submitCallback();
        }

        function clean() {
          this.$('.g-recaptcha').remove();
        }

        function load() {
          var _this = this;

          var key = app.forum.attribute('recaptchaPublic');

          if (!key) return;

          var render = function render() {
            if (_this.$('.g-recaptcha').length) return;

            var el = $('<div class="Form-group g-recaptcha">').insertBefore(_this.$('[type="submit"]').parent())[0];

            if (el && !$(el).data('g-rendred')) {
              recaptchaID = grecaptcha.render(el, {
                sitekey: key,
                theme: app.forum.attribute('darkMode') ? 'dark' : 'light',
                callback: submit,
                size: 'invisible'
              });
              $(el).data('g-rendred', true);
            }
          };

          if (isAvail()) {
            render();
          } else {
            $.getScript('https://www.google.com/recaptcha/api.js?hl=' + app.locale + '&render=explicit', function () {
              var attemps = 0;
              var interval = setInterval(function () {
                ++attemps;
                if (isAvail()) {
                  clearInterval(interval);
                  render();
                }
                if (attemps > 100) {
                  clearInterval(interval);
                }
              }, 100);
            });
          }
        }
        extend(SignUpModal.prototype, 'config', load);
        // extend(LogInModal.prototype, 'config', load);

        extend(SignUpModal.prototype, 'logIn', clean);
        // extend(LogInModal.prototype, 'signUp', clean);

        extend(SignUpModal.prototype, 'submitData', function (data) {
          data['g-recaptcha-response'] = recaptchaValue;
          return data;
        });

        extend(SignUpModal.prototype, 'onerror', function () {
          if (isAvail()) {
            grecaptcha.reset(recaptchaID);
          }
        });

        override(SignUpModal.prototype, 'onsubmit', function (original, e) {
          e.preventDefault();
          submitCallback = function submitCallback() {
            return original(e);
          };
          grecaptcha.execute(recaptchaID);
        });
      }); /* global $ */
      /* global m */
      /* global grecaptcha */
    }
  };
});