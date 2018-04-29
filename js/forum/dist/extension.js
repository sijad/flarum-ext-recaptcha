'use strict';

System.register('sijad/recaptcha/main', ['flarum/app', 'flarum/extend', 'flarum/components/SignUpModal'], function (_export, _context) {
  "use strict";

  var app, extend, override, SignUpModal, invisible;
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
      invisible = true;


      app.initializers.add('sijad-recaptcha', function () {
        var isAvail = false;
        var isLoading = false;
        var recaptchaID = void 0;
        var submitCallback = void 0;

        function submit(token) {
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

            var version = invisible ? 'invisible' : 'v2';
            var $el = $('<div class="Form-group g-recaptcha g-recaptcha-' + version + '">');
            var $parent = _this.$('[type="submit"]').parent();
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
                badge: 'inline'
              });
              $el.data('g-rendred', true);
            }
          };

          if (isAvail) {
            render();
          } else if (!isLoading) {
            isLoading = true;
            window.grecaptchaOnLoad = function () {
              isAvail = true;
              render();
            };
            $.getScript('https://www.google.com/recaptcha/api.js?hl=' + app.data.locale + '&render=explicit&onload=grecaptchaOnLoad').fail(function (jqxhr, settings, exception) {
              throw exception;
            });
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
          grecaptcha.reset(recaptchaID);
        });

        override(SignUpModal.prototype, 'onsubmit', function (original, e) {
          if (invisible) {
            e.preventDefault();
            submitCallback = function submitCallback() {
              return original(e);
            };
            grecaptcha.execute(recaptchaID);
          } else {
            original(e);
          }
        });
      });
    }
  };
});