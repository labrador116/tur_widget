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
    
    self.host = 'amopresets.lm.ru';
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
            header: self.i18n('touristic_tutorial_1').header,    // header является необязательным параметром,
                                                  // если нужен кастомный html для заголовка
                                                  // просто можно не передавать его сюда

            caption: self.i18n('touristic_tutorial_1').caption,  // следующие два параметра можно не передавать тоже,
                                                  // тогда в правой панели не будет текстов
            description: self.i18n('touristic_tutorial_1').description,

            handler: _.bind(firstStep, self) // функция, которая выполнится при запуске шага
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