const { it, describe } = require('mocha');
const { createSandbox } = require('sinon');
const CreateBarbersService = require('../../src/services/users/CreateBarber');
const assert = require('assert');
const ApiError = require('../../src/errors/ApiError');
const CreateClientsService = require('../../src/services/users/CreateClient');
const UpdateUsersService = require('../../src/services/users/Update');

describe('User Test Suites', () => {
  const sinon = createSandbox();

  afterEach(() => {
    sinon.restore();
  });

  describe('Create Barbers', () => {
    const service = new CreateBarbersService();

    it('should not be able to create barbers with same email', async () => {
      const stub = sinon.stub(service, service._emailIsAvailable.name);
      const email = 'johndoe@email.com';

      stub.withArgs(email).resolves(false);

      const createUserData = {
        name: 'John Doe',
        email,
        password: '123456',
      };

      await assert
        .rejects(
          async () => await service.execute(createUserData),
          err => {
            assert.strictEqual(err instanceof ApiError, true);
            assert.strictEqual(err.message, 'Uma conta já está utilizando este email!');

            return true;
          }
        )
    });

    it('should be able to create barbers', async () => {
      const createUserData = {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '123456',
      };
      const expectedId = 1;
      const barberAccessLevel = 2;

      sinon.replace(
        service._usersRepository,
        service._usersRepository.create.name,
        async () => ({
          id: expectedId,
          access: barberAccessLevel,
          ...createUserData,
        })
      );

      const user = await service.execute(createUserData);

      assert.strictEqual(user.id, expectedId);
      assert.strictEqual(user.email, createUserData.email);
      assert.strictEqual(user.access, barberAccessLevel);
    });
  });

  describe('Create Clients', () => {
    const service = new CreateClientsService();

    it('should not be able to create barbers with same email', async () => {
      const stub = sinon.stub(service, service._emailIsAvailable.name);
      const email = 'johndoe@email.com';

      stub.withArgs(email).resolves(false);

      const createUserData = {
        name: 'John Doe',
        email,
        password: '123456',
      };

      await assert
        .rejects(
          async () => await service.execute(createUserData),
          err => {
            assert.strictEqual(err instanceof ApiError, true);
            assert.strictEqual(err.message, 'Uma conta já está utilizando este email!');

            return true;
          }
        )
    });

    it('should be able to create barbers', async () => {
      const createUserData = {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '123456',
      };
      const expectedId = 1;
      const barberAccessLevel = 2;

      sinon.replace(
        service._usersRepository,
        service._usersRepository.create.name,
        async () => ({
          id: expectedId,
          access: barberAccessLevel,
          ...createUserData,
        })
      );

      const user = await service.execute(createUserData);

      assert.strictEqual(user.id, expectedId);
      assert.strictEqual(user.email, createUserData.email);
      assert.strictEqual(user.access, barberAccessLevel);
    });
  });

  describe('Update Users', () => {
    const service = new UpdateUsersService();
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    };

    it('should not be able to update user email to an existing one', async () => {
      const stub = sinon.stub(
        service,
        service._emailIsAvailable.name,
      );
      const desiredEmail = 'johndoeupdated@email.com';

      stub.withArgs(desiredEmail).resolves(false);

      await assert
        .rejects(
          async () => service.execute(user, { email: desiredEmail }),
          err => {
            assert.strictEqual(err instanceof ApiError, true);
            assert.strictEqual(err.message, 'O email inserido está em uso por outra conta!');

            return true;
          }
        )
    });

    it('should not be able to update user password without providing the current one', async () => {
      const data = {
        password: '1234567',
      };

      await assert.rejects(
        async () => service.execute(user, data),
        err => {
          assert.strictEqual(err instanceof ApiError, true);
          assert.strictEqual(err.message, 'Para atualizar sua senha, forneça a atual!');

          return true;
        }
      );
    });

    it('should not be able to update user password when the current one is wrong', async () => {
      const data = { password: '1234567', currentPassword: 'wrong-password' };

      await assert.rejects(
        async () => service.execute(user, data),
        err => {
          assert.strictEqual(err instanceof ApiError, true);
          assert.strictEqual(err.message, 'A senha atual não está correta!');

          return true;
        }
      );
    });

    it('should be able to update user information', async () => {
      const stub = sinon.stub(
        service._usersRepository,
        service._usersRepository.findOne.name,
      );

      const data = {
        name: 'John Doe Updated',
        email: 'johndoeupdated@email.com',
        // password: 'updated-password',
        // currentPassword: '123456',
      };

      sinon.replace(
        service._usersRepository,
        service._usersRepository.update.name,
        async () => null,
      );

      stub.withArgs({ id: user.id }).resolves({
        id: user.id,
        ...data,
      });

      const updatedUser = await service.execute(user, data);

      assert.strictEqual(updatedUser.id, user.id);
      assert.strictEqual(updatedUser.name, data.name);
      assert.strictEqual(updatedUser.email, data.email);
      assert.strictEqual(updatedUser.password, data.password);
    });
  })
});
