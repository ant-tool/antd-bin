'use strict';

module.exports = function(stats) {
  stats = stats.toJson();

  if (stats.errors && stats.errors.length) {
    var hasChildError = false;
    stats.children.forEach(function(item) {
      if (item.errors) {
        hasChildError = true;
        item.errors.forEach(function(err) {
          console.error('error', err);
        });
      }
    });
    if (!hasChildError) {
      stats.errors.forEach(function(err) {
        console.error('error', err);
      });
    }
    console.log();
  }
};
