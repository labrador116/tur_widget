define([
  'underscore',
  './templates.js',
  './steps/first.js',
  './steps/second.js',
  'text!./templates/tutorial.md'
], function (_, createTemplatesRenderer, firstStep, secondStep, tutorial) {
  'use strict';

  return function () {
    var self = this;
    
    self.host = 'amopresets.lm.ru';
		self.url = 'https://' + self.host;

    createTemplatesRenderer(this);

    this.loaderShow = function(delay, msg) {
      var msg = msg || '',
        delay = parseInt(delay || 500);
      $('#lm_wizard_ecommerce_modal_loader .lm_wizard_ecommerce_ml_msg_wrap > span').html(msg);
      $('#lm_wizard_ecommerce_modal_loader').fadeIn(delay);
    };

    this.loaderMsg = function(msg)
    {
      var msg = msg || '';
      $('#lm_wizard_ecommerce_modal_loader .lm_wizard_ecommerce_ml_msg_wrap > span').html(msg);
    };

    this.loaderHide = function(delay) {
      var delay = parseInt(delay || 500);
      $('#lm_wizard_ecommerce_modal_loader').fadeOut(delay);
      $('#lm_wizard_ecommerce_modal_loader .lm_wizard_ecommerce_ml_msg_wrap > span').html('');
    };
  
    this.callbacks = {
      init: function () {
        if (!$('.lm_wizard_ecommerce_style').length) {
					$('head').append(
						`<link class="lm_wizard_ecommerce_style" href="${self.params.path}/styles.css?v=${self.get_version()}" rel="stylesheet">`
          );
          $('body').append(`
            <div class="lm_wizard_ecommerce_modal" id="lm_wizard_ecommerce_modal_loader" style="display:none;z-index:10001;"><div class="modal-scroller custom-scroll"><div class="default-overlay modal-overlay modal-overlay_white default-overlay-visible"><div class="lm_wizard_ecommerce_ml_msg_wrap"><span></span></div><span class="modal-overlay__spinner spinner-icon spinner-icon-abs-center"></span></div></div></div>
          `);
				}
        return true;
      },
      render: function () {
        return true;
      },
      bind_actions: function () {
        return true;
      },
      register_steps: function () {
        return [
          {
            description: self.i18n('tutorial').header,
            handler: _.bind(firstStep, self)
          },
          {
            description: self.i18n('second').description,
            handler: _.bind(secondStep, self)
          }
        ];
      },
      get_tutorial: function () {
        return tutorial;
      },
      finish_wizard: function (all_steps_data) {
        self.loaderShow(500, 'Настройка...');
        return new Promise(function (resolve, reject) {    
          if (AMOCRM.constant('user')) {
            all_steps_data.user_id = AMOCRM.constant('user').id;
            all_steps_data.user_login = AMOCRM.constant('user').login;
          }
          if (AMOCRM.constant('account')) {
            all_steps_data.account_id = AMOCRM.constant('account').id;
            all_steps_data.domain = AMOCRM.constant('account').subdomain;
            all_steps_data.zone = AMOCRM.constant('account').language != 'ru' ? 'com' : 'ru';
            all_steps_data.timezone = AMOCRM.constant('account').timezone;
          }
          $.ajax({ 
            type: 'POST',
            url: self.url+"/ecommerce/finish",
            data: all_steps_data,
            dataType: "json",
            complete: function() {
              setTimeout(() => {
                self.loaderMsg('Настройка завершена');
                self.loaderHide();
                resolve({
                  skip_tour: true
                });
              }, 7000);
            }
          });
        });
      }
    };

    return this;
  };
});