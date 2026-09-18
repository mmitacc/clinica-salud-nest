import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated-client/client.js';

// 1.- Extendemos un nuevo tipo para el autocompletado en prisma
type ExtendedPrismaCheck = ReturnType<typeof getExtendedCheck>;

// 2.- Creamos una función auxiliar para inferir correctamente el tipo estricto de la extensión
const getExtendedCheck = (check: PrismaClient) => {
  return check.$extends({
    query: {
      $allModels: {
        async create({ args, query }) {
          args.omit = { deleted: true, deletedate: true, ...args.omit };
          return query(args);
        },
        async findMany({ args, query }) {
          args.where = { deleted: false, ...args.where };
          args.omit = { deleted: true, deletedate: true, ...args.omit };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { deleted: false, ...args.where };
          args.omit = { deleted: true, deletedate: true, ...args.omit };
          const result = await query(args);
          if (!result) throw new NotFoundException('Registro no encontrado');
          return result;
        },
        async findFirstOrThrow({ args, query }) {
          args.where = { deleted: false, ...args.where };
          args.omit = { deleted: true, deletedate: true, ...args.omit };
          return query(args);
        },
        async findUnique({ model, args }) {
          args.where = { deleted: false, ...args.where };
          args.omit = { deleted: true, deletedate: true, ...args.omit };
          return (check as any)[model].findFirst(args);
        },
        async findUniqueOrThrow({ model, args }) {
          args.where = { deleted: false, ...args.where };
          args.omit = { deleted: true, deletedate: true, ...args.omit };
          return (check as any)[model].findFirstOrThrow(args);
        },
        async update({ args, query }) {
          args.where = { deleted: false, ...args.where };
          args.omit = { deleted: true, deletedate: true, ...args.omit };
          const result = await query(args);
          if (!result) throw new NotFoundException('Registro no encontrado');
          return result;
        },
      },
    },
  });
};

@Injectable()
// 3. Agregamos 'implements OnModuleInit' para que herede la clase PrismaClient
export class PrismaService extends PrismaClient implements OnModuleInit {
  // 4. Creamos una nueva propiedad 'check' con un tipado estricto
  public check!: ExtendedPrismaCheck;

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({ adapter });
  }

  // 5. Activamos la extensión hija de PrismaClient
  async onModuleInit() {
    await this.$connect();

    // 6. Extendemos la instancia actual usando Prisma Extensions
    this.check = getExtendedCheck(this);
  }
}
