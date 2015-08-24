import url from 'url';
import path from 'path';
import knex from 'knex';


export default async function (root, env, name, options) {
  env = extract(env, name);

  const config = {
    client: 'pg',
    connection: {
      multipleStatements: true,
      host: url.parse(env.PORT).hostname,
      user: env.ENV_POSTGRES_USER || env.USER,
      password: env.ENV_POSTGRES_PASSWORD || env.PASSWORD,
      port: parseInt(url.parse(env.PORT).port, 10),
      database: env.ENV_POSTGRES_DATABASE || env.DATABASE,
    },
    migrations: {
      directory: path.join(root, name, 'migrations'),
    },
    seeds: {
      directory: path.join(root, name, 'seeds'),
    },
    ...options,
  };

  return knex(config);
}


function extract (map, prefix) {
  prefix = prefix.toUpperCase();

  const result = {};
  Object.keys(map)
    .filter(k => k.split('_')[0] === prefix)
    .forEach(k => {
      let key = k.split('_');
      key.shift();
      key = key.join('_');
      result[key] = map[k];
    });

  return result;
}
