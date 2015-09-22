function robots () {
  return function (files, metalsmith) {
    var env = metalsmith.metadata().env

    for (var file in files) {
      var matches = file.match(/^robots\.(.+)\.txt$/)

      if (matches) {
        if (matches[1] === env) {
          files['robots.txt'] = files[file]
        }

        delete files[file]
      }
    }
  }
}

module.exports = robots
