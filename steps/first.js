define(['../templates.js'], function (getTemplateRenderer) {
    'use strict';
  
    var getTemplate = getTemplateRenderer();
  
    return function (params) {
      var self = this;
  
      return getTemplate('tutorial_first')
        .then(function (template) {
          params.$el.append(template.render({
            langs: self.i18n('touristic_tutorial_1')
          }));
        });
    };
  });