var fs = require('fs');
var watchr = require('watchr');
var logger = require('./logger');

var TemplateManager = function() {
  var templates = {};

  var TemplateStruct = function(template) {
    this.template = template;
    this.content = null;
    this.watcher = null;
  };

  return {
    setLogger: function(log) {
      logger.setLogger(log);
    },
    addTemplate: function(template) {
      if (!fs.existsSync(template)) {
        logger.error('Template [' + template + '] doesn\'t exist.');
        throw new Error('Template [' + template + '] doesn\'t exist.');
      }

      if (!(template in templates)) {
        templates[template] = new TemplateStruct(template);
        templates[template].watcher =
            watchr.watch({
              path: template,
              listeners: {
                error: function(err, message) {
                  logger.info(
                      'an error occured: ' + message);
                },
                watching: function(err, watcherInstance, isWatching) {
                  if (err) {
                    logger.info(
                        'watching the path ' + watcherInstance.path +
                        ' failed with error', err);
                  }
                },
                change: function(changeType, filePath,
                                 fileCurrentStat, filePreviousStat) {
                  if (changeType === 'update') {
                    if (templates[filePath] != null) {
                      templates[filePath].content =
                          fs.readFileSync(filePath, 'UTF-8');
                    }
                  }
                }
              },
              next: function(err, watchers) {
                if (err) {
                  logger.info(
                      'watching everything failed with error' + err);
                }
              }
            });
      }
      return template;
    },
    removeTemplate: function(template) {
      if (template in templates) {
        templates[template].watcher.close();
        templates[template].content = null;
      }
    },
    resetTemplate: function(template) {
      if (template in templates) {
        templates[template].content = null;
      }
    },
    getTemplate: function(template) {
      if (template in templates) {
        if (templates[template].content == null) {
          templates[template].content = fs.readFileSync(template, 'UTF-8');
        }
        return templates[template].content;
      } else {
        throw new Error(
            'Template [' + template + '] requested doesn\'t exist.');
      }
    }
  };
}();

module.exports = TemplateManager;
