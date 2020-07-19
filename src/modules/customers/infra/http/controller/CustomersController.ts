import { Request, Response } from 'express';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';

import { container } from 'tsyringe';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const customerService = container.resolve(CreateCustomerService);

    const { name, email } = request.body;

    const customer = await customerService.execute({
      name,
      email,
    });

    return response.json(customer);
  }
}
