import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import AppError from '@shared/errors/AppError';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return product;
  }

  public async findById(id: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne(id);

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productList = await this.ormRepository.find({
      where: {
        id: In(products),
      },
    });

    return productList;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const product_list: Product[] = [];

    products.forEach(async product => {
      const { id, quantity } = product;
      const prod = await this.ormRepository.findOne(id);

      if (!prod) {
        throw new AppError(`Product with ID ${id} not found`, 400);
      }

      prod.quantity -= quantity;

      const new_product = await this.ormRepository.save(prod);

      product_list.push(new_product);
    });

    return product_list;
  }
}

export default ProductsRepository;
