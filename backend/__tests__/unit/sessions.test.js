const { describe, it } = require('mocha');
const { createSandbox } = require('sinon');
const CreateSessionsService = require('../../src/services/sessions/Create');
const assert = require('assert');
const ApiError = require('../../src/errors/ApiError');
const authConfig = require('../../src/config/authConfig');

describe('Session Test Suites', () => {
  const sinon = createSandbox();

  afterEach(() => {
    sinon.restore();
  });

  describe('Create Session', () => {
    const service = new CreateSessionsService();
    const user = {
      id: 1,
      access: 1,
      email: 'johndoe@email.com',
      password: '123456',
    }

    it('should not be able to create session when provided email is wrong', async () => {
      const stub = sinon.stub(
        service._usersRepository,
        service._usersRepository.findOne.name,
      );

      stub.withArgs({ where: { email: 'wrong@email.com' } }).resolves(undefined);

      await assert
        .rejects(
          async () => service.execute({ email: 'wrong@email.com', password: '123456' }),
          err => {
            assert.strictEqual(err instanceof ApiError, true);
            assert.strictEqual(err.message, 'Email/senha incorreto(s)');

            return true;
          }
        );
    });

    it('should not be able to create session when provided password is wrong', async () => {
      const stub = sinon.stub(
        service._usersRepository,
        service._usersRepository.findOne.name,
      );

      stub.withArgs({ where: { email: user.email } }).resolves(user);

      await assert
        .rejects(
          async () => service.execute({ email: user.email, password: 'wrong-password' }),
          err => {
            assert.strictEqual(err instanceof ApiError, true);
            assert.strictEqual(err.message, 'Email/senha incorreto(s)');

            return true;
          }
        );
    });

    it('should be able to create sessions', async () => {
      const stub = sinon.stub(
        service._usersRepository,
        service._usersRepository.findOne.name,
      );

      stub.withArgs({ where: { email: user.email } }).resolves(user);

      const response = await service.execute({
        email: user.email,
        password: user.password,
      });

      const { token, user: authUser } = response;

      assert.strictEqual(typeof token === 'string', true);
      assert.deepStrictEqual(authUser, user);
    });
  });
});
