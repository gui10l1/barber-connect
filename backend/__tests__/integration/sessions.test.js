const { describe, it } = require('mocha');
const { createSandbox } = require('sinon');
const User = require('../../src/models/User');
const supertest = require('supertest');
const assert = require('assert');
const server = require('../../src/server');

describe('Session integration Test Suites', () => {
  const databaseIds = [];
  const sinon = createSandbox();

  let api;

  before(done => {
    api = server.listen(3333, done);
  });

  after(done => {
    api.close(done);
  });

  afterEach(async () => {
    await Promise.all(
      databaseIds.map(async id => User.destroy({ where: { id } })),
    );

    sinon.restore();
  });

  describe(`[POST] /users/session - Create Sessions`, () => {
    it('should not be able to pass the request when data is not provided correctly', async () => {
      const response = await supertest(api)
        .post(`/users/session`)
        .send({})
        .expect(400);

      assert.strictEqual(response.ok, false);
      assert.strictEqual(response.status, 400);
    });

    it('should be able to feedback user when credentials are wrong', async () => {
      const data = {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '123456',
      };

      const user = await User.create(data);

      databaseIds.push(user.id);

      const response = await supertest(api)
        .post('/users/session')
        .send({ email: data.email, password: 'wrong-password' });

      assert.strictEqual(response.body.message, 'Email/senha incorreto(s)');
    })
  });
});
