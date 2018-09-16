'use strict';

const { Pool } = require('pg');

class PgStore {

  constructor(opts) {
    this.db = new Pool(opts);
  }

  async getOne(id) {
    const {rows} = await this.makeQuery(
      'select * from jest_test.user where id = $1',
      [id]
    );
    return rows[0];
  }

  async updateOne({id, first_name, last_name, salary}) {
    const {rows} = await this.makeQuery(
      `update jest_test.user set first_name = $1, last_name = $2, salary = $3 where id = $4 returning *;`,
      [first_name, last_name, salary, id]
      );
    return rows[0];
  }

  async addOne({first_name, last_name, salary}) {
    const {rows} = await this.makeQuery(
      `insert into jest_test.user (first_name, last_name, salary) values ($1, $2, $3) returning *;`,
      [first_name, last_name, salary]
    );
    return rows[0];
  }

  async removeOne(id) {
    const {rows} = await this.makeQuery(
      `delete from jest_test.user where id = $1 returning *;`,
      [id]
    );
    return rows[0];
  }

  async makeQuery(query, params) {
    const client = await this.db.connect();
    try {
      await client.query('begin');
      return await client.query(query, params);
    } catch (e) {
      await client.query('rollback');
      console.log('here');
      throw e;
    } finally {
      await client.release();
    }
  }

  teardown() {
    return this.db.end();
  }



}

module.exports = PgStore;