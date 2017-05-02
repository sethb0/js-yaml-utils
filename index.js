const Promise = require('bluebird');
const fs = require('fs');
const yaml = require('js-yaml');

const SCHEMA = yaml.Schema.create([yaml.DEFAULT_SAFE_SCHEMA], [
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
module.exports.SCHEMA = SCHEMA;

module.exports.loadSync = function loadSync (path) {
  return yaml.safeLoad(fs.readFileSync(path, { encoding: 'utf8' }),
                       { schema: SCHEMA, filename: path });
};

module.exports.dumpSync = function dumpSync (path, data) {
  fs.writeFileSync(path,
                   yaml.safeDump(data, { schema: SCHEMA, styles: { '!!null': 'canonical' } }),
                   'utf8');
};

const writeFile = Promise.promisify(fs.writeFile);

module.exports.dump = function dump (path, data) {
  return writeFile(path,
                   yaml.safeDump(data, { schema: SCHEMA, styles: { '!!null': 'canonical' } }),
                   'utf8');
};
