define(['../templates.js'], function (getTemplateRenderer) {
    'use strict';
  
    var getTemplate = getTemplateRenderer();
  
    return function (params) {
      var self = this;
  
      return getTemplate('second')
        .then(function (template) {
          params.$el.append(template.render({
            langs: {
              button_text: self.i18n('second').button_text
            }
          }));
        });
    };
  });