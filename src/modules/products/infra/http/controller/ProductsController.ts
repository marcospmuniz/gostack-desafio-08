import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';
import CreateCustomerService from '@modules/customers/services/CreateCustomerService';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createProductService = container.resolve(CreateProductService);
    const createCustomerService = container.resolve(CreateCustomerService);

    const { name, price, quantity } = request.body;

    const product = await createProductService.execute({
      name,
      price,
      quantity,
    });

    return response.json(product);
  }
}
