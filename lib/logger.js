var _logger = null;

module.exports = {
  getLogger: function () {
    return _logger;
  },
  setLogger: function (logger) {
    _logger = logger;
  },
  trace: function (message) {
    _logger ? _logger.trace(message) : console.trace(message);
  },
  info: function (message) {
    _logger ? _logger.info(message) : console.info(message);
  },
  debug: function (message) {
    _logger ? _logger.debug(message) : console.debug(message);
  },
  error: function (message) {
    _logger ? _logger.error(message) : console.error(message);
  }
};
