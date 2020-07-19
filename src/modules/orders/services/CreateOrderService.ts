import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IOrdersProduct {
  product_id: string;
  quantity: number;
  price: number;
}

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Invalid Customer ID', 400);
    }

    const productsList: IOrdersProduct[] = [];
    const productsToUpdate: IUpdateProductsQuantityDTO[] = [];

    const promises = products.map(async product => {
      const { id, quantity } = product;
      const prod = await this.productsRepository.findById(id);

      if (!prod) {
        throw new AppError('Invalid Product ID', 400);
      }

      if (prod.quantity < quantity) {
        throw new AppError(
          `Insufficient quantities for product ${prod.name}`,
          400,
        );
      }

      const product_to_add = {
        product_id: id,
        quantity,
        price: prod?.price || 0,
      };

      const product_to_update = {
        id,
        quantity,
      };

      productsList.push(product_to_add);
      productsToUpdate.push(product_to_update);
    });

    await Promise.all(promises);

    await this.productsRepository.updateQuantity(productsToUpdate);

    const order = await this.ordersRepository.create({
      customer,
      products: productsList,
    });

    return order;
  }
}

export default CreateOrderService;
