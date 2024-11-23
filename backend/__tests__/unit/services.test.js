const { describe, it } = require('mocha');
const { createSandbox } = require('sinon');
const CreateServicesService = require('../../src/services/services/Create');
const assert = require('assert');
const ApiError = require('../../src/errors/ApiError');
const FindServicesService = require('../../src/services/services/Find');
const DeleteServicesService = require('../../src/services/services/Delete');
const UpdateServicesService = require('../../src/services/services/Update');

describe('Service Test Suites', () => {
  const sinon = createSandbox();

  beforeEach(() => {
    sinon.restore();
  });

  describe('Create Services', () => {
    const createServices = new CreateServicesService();
    const client = {
      id: 1,
      name: 'Client',
      email: 'client@email.com',
      password: '123456',
      access: 1,
    };
    const barber = {
      id: 2,
      name: 'Barber',
      email: 'barber@email.com',
      password: '123456',
      access: 2,
    };

    it('should not be able to create services by clients', async () => {
      const createServiceData = {
        name: 'My Service',
        price: 15.99,
      };

      await assert.rejects(
        async () => createServices.execute(client, createServiceData),
        err => {
          assert.strictEqual(err instanceof ApiError, true);
          assert.strictEqual(err.message, 'Apenas barbeiros podem criar serviços!');

          return true;
        }
      );
    });

    it('should be able to create services', async () => {
      const data = { name: 'My Service', price: 15.99 };

      sinon.replace(
        createServices._servicesRepository,
        createServices._servicesRepository.create.name,
        async () => ({ id: 1, ...data }),
      );

      const service = await createServices.execute(barber, data);

      assert.strictEqual(service.id, 1);
      assert.strictEqual(service.name, data.name);
      assert.strictEqual(service.price, data.price);
    });
  });

  describe('Find Services', () => {
    const findServices = new FindServicesService();

    it('should not be able to find non-existing services', async () => {
      sinon.replace(
        findServices._servicesRepository,
        findServices._servicesRepository.findOne.name,
        async () => undefined,
      );

      await assert.rejects(
        async () => findServices.execute({ id: 'non-existing-id' }),
        err => {
          assert.strictEqual(err instanceof ApiError, true);
          assert.strictEqual(err.message, 'Não foi possível encontrar o servido informado!');

          return true;
        }
      );
    });

    it('should be able to find services', async () => {
      const stub = sinon.stub(
        findServices._servicesRepository,
        findServices._servicesRepository.findOne.name,
      );

      const service = {
        id: 2,
        name: 'My Second Service',
        price: 1.99,
      };

      stub.withArgs({ where: { id: service.id } }).resolves(service);

      const desiredService = await findServices.execute({
        id: service.id,
      });

      assert.strictEqual(desiredService.id, service.id);
    });
  });

  describe('Delete Services', () => {
    const deleteServices = new DeleteServicesService();
    const client = {
      id: 1,
      name: 'Client',
      email: 'client@email.com',
      password: '123456',
      access: 1,
    };
    const barber = {
      id: 2,
      name: 'Barber',
      email: 'barber@email.com',
      password: '123456',
      access: 2,
    };

    it('should not be able to delete non-existing services', async () => {
      const stub = sinon.stub(
        deleteServices._servicesRepository,
        deleteServices._servicesRepository.findOne.name,
      );

      stub.withArgs({ where: { id: 'non-existing-id' } }).resolves(undefined);

      await assert.rejects(
        async () => deleteServices.execute(barber, 'non-existing-id'),
        err => {
          assert.strictEqual(err instanceof ApiError, true);
          assert.strictEqual(err.message, 'Não foi possível encontrar o servido informado para deletar!');

          return true;
        }
      );
    });

    it(`should not be able to delete services that logged user did not create`, async () => {
      const stub = sinon.stub(
        deleteServices._servicesRepository,
        deleteServices._servicesRepository.findOne.name,
      );
      const serviceToDelete = {
        id: 67,
        name: 'My Service',
        price: 15.99,
        user_id: barber.id,
      };

      stub
        .withArgs({ where: { id: serviceToDelete.id } })
        .resolves(serviceToDelete);

      await assert.rejects(
        async () => deleteServices.execute(client, serviceToDelete.id),
        err => {
          assert.strictEqual(err instanceof ApiError, true);
          assert.strictEqual(err.message, 'Você não tem autorização para deletar esse serviço!');

          return true;
        }
      );
    });

    it('should be able to delete services', async () => {
      const stub = sinon.stub(
        deleteServices._servicesRepository,
        deleteServices._servicesRepository.findOne.name,
      );
      const spy = sinon.spy(
        deleteServices._servicesRepository,
        deleteServices._servicesRepository.destroy.name,
      );
      const serviceToDelete = {
        id: 67,
        name: 'My Service',
        price: 15.99,
        user_id: barber.id,
      };

      stub
        .withArgs({ where: { id: serviceToDelete.id } })
        .resolves(serviceToDelete);

      await deleteServices.execute(barber, serviceToDelete.id);

      const call = spy.getCall(0);
      const paramsUsedOnCall = call.args[0];

      assert.strictEqual(spy.callCount, 1);
      assert.deepStrictEqual(paramsUsedOnCall, { where: { id: serviceToDelete.id } })
    });
  });

  describe('Update Services', () => {
    const updateServices = new UpdateServicesService();
    const client = {
      id: 1,
      name: 'Client',
      email: 'client@email.com',
      password: '123456',
      access: 1,
    };
    const barber = {
      id: 2,
      name: 'Barber',
      email: 'barber@email.com',
      password: '123456',
      access: 2,
    };

    it('should not be able to update non-existing services', async () => {
      const stub = sinon.stub(
        updateServices._servicesRepository,
        updateServices._servicesRepository.findOne.name,
      );

      stub.withArgs({ where: { id: 'non-existing-id' } }).resolves(undefined);

      await assert.rejects(
        async () => updateServices.execute(barber, 'non-existing-id'),
        err => {
          assert.strictEqual(err instanceof ApiError, true);
          assert.strictEqual(err.message, 'Não foi possível encontrar o servido informado para atualizar!');

          return true;
        }
      );
    });

    it('should not be able to update services that logged user did not create', async () => {
      const stub = sinon.stub(
        updateServices._servicesRepository,
        updateServices._servicesRepository.findOne.name,
      );
      const serviceToUpdate = {
        id: 67,
        name: 'My Service',
        price: 15.99,
        user_id: barber.id,
      };

      stub
        .withArgs({ where: { id: serviceToUpdate.id } })
        .resolves(serviceToUpdate);

      await assert.rejects(
        async () => updateServices.execute(client, { id: serviceToUpdate.id }),
        err => {
          assert.strictEqual(err instanceof ApiError, true);
          assert.strictEqual(err.message, 'Você não tem autorização para atualizar esse serviço!');

          return true;
        }
      );
    });

    it('should be able to update services', async () => {
      const stub = sinon.stub(
        updateServices._servicesRepository,
        updateServices._servicesRepository.findOne.name,
      );
      const serviceToUpdate = {
        id: 67,
        name: 'My Service',
        price: 15.99,
        user_id: barber.id,
      };
      const spy = sinon.spy(
        updateServices._servicesRepository,
        updateServices._servicesRepository.update.name,
      );

      stub
        .withArgs({ where: { id: serviceToUpdate.id } })
        .resolves(serviceToUpdate);

      const dataToUpdateService = {
        id: serviceToUpdate.id,
        name: 'Updated Service',
        price: 8.99
      };

      await updateServices.execute(barber, dataToUpdateService);

      const call = spy.getCall(0);
      const args = call.args[0];

      assert.deepStrictEqual(args, {
        name: dataToUpdateService.name,
        price: dataToUpdateService.price,
      });
      assert.strictEqual(spy.callCount, 1);
    });
  });
});
