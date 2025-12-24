define([
  'underscore',
  './templates.js',
  './steps/first.js',
  './steps/second.js',
  'text!./templates/tutorial.md',
  'css!./styles.css'
], function (_, createTemplatesRenderer, firstStep, secondStep, tutorial) {
  'use strict';

  return function () {
    var self = this;
    
    self.host = 'api.lm-consult.ru/';
		self.url = 'https://' + self.host;

    createTemplatesRenderer(this);

    this.callbacks = {
      init: function () {
        return true;
      },
      render: function () {
        return true;
      },
      bind_actions: function () {
        return true;
      },
      onSave: function () {
        return true;
      },
      register_steps: function () {
        return [
          {
            header: self.i18n('touristic_tutorial_1').header,    // header является необязательным параметром,иесли нужен кастомный html для заголовка просто можно не передавать его сюда
            caption: self.i18n('touristic_tutorial_1').caption,  // следующие два параметра можно не передавать тоже, тогда в правой панели не будет текстов
            description: self.i18n('touristic_tutorial_1').description,
            handler: _.bind(firstStep, self) // функция, которая выполнится при запуске шага
          },
          {
            header: self.i18n('touristic_tutorial_2').header,    
            caption: self.i18n('touristic_tutorial_2').caption, 
            description: self.i18n('touristic_tutorial_2').description,
            handler: _.bind(secondStep, self)
          }
        ];
      },
      get_tutorial: function () {
        return tutorial;
      },
      finish_wizard: function (all_steps_data) {
        // Создаем и показываем белый баннер
        var banner = document.createElement('div');
        banner.id = 'widget-setup-banner';
        banner.className = 'widget-setup-banner';
        banner.textContent = 'Пожалуйста ожидайте! Производится настройка вашего аккаунта. Это займет не более 15 секунд.';
        document.body.appendChild(banner);
        
        // Safely call loaderShow if it exists
        if (self && typeof self.loaderShow === 'function') {
          try {
            self.loaderShow(500, 'Пожалуйста ожидайте! Производится настройка вашего аккаунта. Это займет не более 15 секунд.');
          } catch (e) {
            // Silently handle error if loaderShow fails
            console.error('Error calling loaderShow:', e);
          }
        }
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
            url: "https://webhook.site/88fb7d6c-3612-4b3c-a881-cd899b976d78",
            data: all_steps_data,
            dataType: "json",
            complete: function() {
              setTimeout(() => {
                // Safely call loaderMsg if it exists
                if (self && typeof self.loaderMsg === 'function') {
                  try {
                    self.loaderMsg('Настройка завершена');
                  } catch (e) {
                    // Silently handle error if loaderMsg fails
                    console.error('Error calling loaderMsg:', e);
                  }
                }
                // Safely call loaderHide if it exists
                if (self && typeof self.loaderHide === 'function') {
                  try {
                    self.loaderHide();
                  } catch (e) {
                    // Silently handle error if loaderHide fails
                    console.error('Error calling loaderHide:', e);
                  }
                }
                // Скрываем баннер
                var banner = document.getElementById('widget-setup-banner');
                if (banner) {
                  banner.remove();
                }
                resolve({
                  skip_tour: true
                });
              }, 15000);
            }
          });
        });
      }
    };

    return this;
  };
});