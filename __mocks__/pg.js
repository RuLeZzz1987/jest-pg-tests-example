'use strict';

const pg = jest.genMockFromModule('pg');

let mockUser;
let shouldThrow = false;

const client = new pg.Client();

client.release = jest.fn().mockResolvedValue({});
client.query = jest.fn().mockImplementation(async (query) => {
  switch (query.toLowerCase()) {
    case 'begin':
      return;
    case 'rollback':
      return;
    case 'commit':
      return;
  }

  if (shouldThrow) {
    throw new Error('mock throw');
  }

  return { rows: [mockUser] };
});

pg.Pool.prototype.connect = jest.fn().mockResolvedValue(client);

function __setMockUser(user) {
  mockUser = user;
}

function __setMockQueryThrow(val) {
  shouldThrow = val;
}

pg.__setMockUser = __setMockUser;
pg.__setMockQueryThrow = __setMockQueryThrow;

module.exports = pg;