'use strict';

System.register('sijad/recaptcha/components/ReCaptchaSettingsModal', ['flarum/app', 'flarum/components/SettingsModal', 'flarum/components/Switch'], function (_export, _context) {
  "use strict";

  var app, SettingsModal, Switch, ReCaptchaSettingsModal;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumComponentsSettingsModal) {
      SettingsModal = _flarumComponentsSettingsModal.default;
    }, function (_flarumComponentsSwitch) {
      Switch = _flarumComponentsSwitch.default;
    }],
    execute: function () {
      ReCaptchaSettingsModal = function (_SettingsModal) {
        babelHelpers.inherits(ReCaptchaSettingsModal, _SettingsModal);

        function ReCaptchaSettingsModal() {
          babelHelpers.classCallCheck(this, ReCaptchaSettingsModal);
          return babelHelpers.possibleConstructorReturn(this, (ReCaptchaSettingsModal.__proto__ || Object.getPrototypeOf(ReCaptchaSettingsModal)).apply(this, arguments));
        }

        babelHelpers.createClass(ReCaptchaSettingsModal, [{
          key: 'className',
          value: function className() {
            return 'ReCaptchaSettingsModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.translator.trans('sijad-recaptcha.admin.recaptcha_settings.title');
          }
        }, {
          key: 'form',
          value: function form() {
            return [m(
              'div',
              { className: 'Form-group' },
              m(
                'label',
                null,
                app.translator.trans('sijad-recaptcha.admin.recaptcha_settings.sitekey_label')
              ),
              m('input', { className: 'FormControl', bidi: this.setting('sijad-recaptcha.sitekey') })
            ), m(
              'div',
              { className: 'Form-group' },
              m(
                'label',
                null,
                app.translator.trans('sijad-recaptcha.admin.recaptcha_settings.secret_label')
              ),
              m('input', { className: 'FormControl', bidi: this.setting('sijad-recaptcha.secret') })
            ), m(
              'div',
              { className: 'Form-group' },
              m(
                'label',
                null,
                m('input', { type: 'checkbox', bidi: this.setting('sijad-recaptcha.invisible') }),
                ' ',
                app.translator.trans('sijad-recaptcha.admin.recaptcha_settings.invisible_label')
              )
            )];
          }
        }]);
        return ReCaptchaSettingsModal;
      }(SettingsModal);

      _export('default', ReCaptchaSettingsModal);
    }
  };
});;
'use strict';

System.register('sijad/recaptcha/main', ['flarum/app', 'sijad/recaptcha/components/ReCaptchaSettingsModal'], function (_export, _context) {
  "use strict";

  var app, ReCaptchaSettingsModal;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_sijadRecaptchaComponentsReCaptchaSettingsModal) {
      ReCaptchaSettingsModal = _sijadRecaptchaComponentsReCaptchaSettingsModal.default;
    }],
    execute: function () {

      app.initializers.add('sijad-recaptcha', function () {
        app.extensionSettings['sijad-recaptcha'] = function () {
          return app.modal.show(new ReCaptchaSettingsModal());
        };
      });
    }
  };
});