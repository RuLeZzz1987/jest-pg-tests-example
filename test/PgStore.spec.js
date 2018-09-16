'use strict';

const pg = require('pg');

const PgStore = require('../src');

const opts = {
  host: 'localhost',
  port: '5432',
  user: 'dev',
  password: 'dev',
  database: 'dev',
};

let store;

describe('PgStore', () => {
  const userMock = {
    first_name: 'ave',
    last_name: 'inge',
    salary: 3000,
    create_at: new Date(),
  };

  beforeAll(async () => {
    store = new PgStore(opts);
    pg.__setMockUser(userMock);
  });

  afterAll(async () => {
    await store.teardown();
  });

  it('should get one user', async () => {
      const user = await store.getOne(1);
      expect(user).toBeDefined();
  });

  it('should update one user', async () => {
    const user = await store.updateOne({first_name: 'alex', last_name: 'ing', salary: 4000});
    expect(user).toBeDefined();
  });

  it('should add one user', async () => {
    const user = await store.addOne({first_name: 'alex', last_name: 'ing', salary: 4000});
    expect(user).toBeDefined();

  });

  it('should remove one user', async () => {
    const user = await store.removeOne({first_name: 'alex', last_name: 'ing', salary: 4000});
    expect(user).toBeDefined();
  });

  it('should fail to add user', async () => {
    pg.__setMockQueryThrow(true);
    await expect(store.addOne({first_name: 'alex', last_name: 'ing', salary: 4000})).rejects.toThrow('mock throw');
    pg.__setMockQueryThrow(false);
  })

});
