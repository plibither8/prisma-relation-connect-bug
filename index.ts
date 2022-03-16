import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const home = await prisma.home.create({ data: {} });
  const user = await prisma.user.create({ data: {} });

  // OK: When creating relations by supplying foreign keys
  const membershipFk = await prisma.membership.create({
    data: {
      homeId: home.id,
      userId: user.id,
    },
  });

  // OK: When creating relations by explicitly connecting
  const membershipConnect = await prisma.membership.create({
    data: {
      home: { connect: { id: home.id } },
      user: { connect: { id: user.id } },
    },
  });

  // NOT OK: Mixing the above two
  // we want to ideally XOR<{userId}, {user}>, not the entire object
  const membershipMixed = await prisma.membership.create({
    data: {
      homeId: home.id,
      user: { connect: { id: user.id } },
    },
  });
}

main();
