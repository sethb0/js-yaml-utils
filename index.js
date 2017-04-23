const yaml = require('js-yaml');

module.exports = yaml.Schema.create([yaml.DEFAULT_SAFE_SCHEMA], [
  new yaml.Type('tag:yaml.org,2002:set', {
    kind: 'mapping',
    construct: (data) => new Set(Object.keys(data || {})),
    instanceOf: Set,
    represent (set) {
      const map = {};
      set.forEach((v) => {
        map[v] = null;
      });
      return map;
    },
  }),
]);
