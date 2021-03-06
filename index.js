const fs = require('fs');
const { promisify } = require('util');
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

function dumpString (data) {
  return yaml.safeDump(data, { schema: SCHEMA, styles: { '!!null': 'canonical' } });
}
module.exports.dumpString = dumpString;

module.exports.loadSync = function loadSync (path) {
  return yaml.safeLoad(
    fs.readFileSync(path, { encoding: 'utf8' }),
    { schema: SCHEMA, filename: path },
  );
};

module.exports.dumpSync = function dumpSync (path, data) {
  fs.writeFileSync(path, dumpString(data), 'utf8');
};

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

module.exports.load = function load (path) {
  return readFile(path, { encoding: 'utf8' })
    .then((data) => yaml.safeLoad(data, { schema: SCHEMA, filename: path }));
};

module.exports.dump = function dump (path, data) {
  return writeFile(path, dumpString(data), 'utf8');
};

module.exports.dumpStream = promisify(
  function dumpStream (stream, data, cb) {
    stream.once('error', cb);
    stream.write(dumpString(data), 'utf8', (e) => {
      stream.removeListener('error', cb);
      return cb(e);
    });
  }
);
