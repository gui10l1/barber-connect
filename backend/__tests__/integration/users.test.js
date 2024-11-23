const assert = require('assert');
const { createSandbox } = require('sinon');
const { describe } = require('mocha');
const supertest = require('supertest');
const User = require('../../src/models/User');
const server = require('../../src/server');

describe("User Integration Test Suites", () => {
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

  describe(`[POST] /users - Create Barbers`, async () => {
    it('should not be able to pass request when data is not provided correctly', async () => {
      const response = await supertest(api)
        .post(`/users`)
        .send({})
        .expect(400);

      assert.strictEqual(response.ok, false);
      assert.strictEqual(response.status, 400);
    });

    it('should not be able to create barbers with same email', async () => {
      const data = {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '123456',
      };

      const user = await User.create(data);

      databaseIds.push(user.id);

      const response = await supertest(api)
        .post('/users')
        .send(data)
        .expect(400);

      assert.strictEqual(response.body.type, 'error');
      assert.strictEqual(response.body.message, 'Uma conta já está utilizando este email!');
    });
  });

  describe(`[POST] /users/clients - Create Clients`, async () => {
    it('should not be able to pass request when data is not provided correctly', async () => {
      const response = await supertest(api)
        .post(`/users`)
        .send({})
        .expect(400);

      assert.strictEqual(response.ok, false);
      assert.strictEqual(response.status, 400);
    });

    it('should not be able to create clients with same email', async () => {
      const data = {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '123456',
      };

      const user = await User.create(data);

      databaseIds.push(user.id);

      const response = await supertest(api)
        .post('/users')
        .send(data)
        .expect(400);

      assert.strictEqual(response.body.type, 'error');
      assert.strictEqual(response.body.message, 'Uma conta já está utilizando este email!');
    });
  });
});
