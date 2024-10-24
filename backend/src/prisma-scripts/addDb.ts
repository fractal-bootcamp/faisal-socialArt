import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

const main = async () => {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      username: 'user1',
      firstName: 'Michael',
      lastName: 'Scott',
      avatar: 'https://github.com/shadcn.png',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      username: 'user2',
      firstName: 'Dwight',
      lastName: 'Schrute',
      avatar: '',
    },
  })

  // Create artworks
  const artwork1 = await prisma.artWork.create({
    data: {
      configuration: {
        colorA: { h: 180, s: 50, b: 75 },
        colorB: { h: 240, s: 60, b: 80 },
        stripeCount: 10,
        style: 'line',
      },
      author: { connect: { id: user1.id } },
    },
  })

  const artwork2 = await prisma.artWork.create({
    data: {
      configuration: {
        colorA: { h: 120, s: 70, b: 65 },
        colorB: { h: 300, s: 80, b: 70 },
        stripeCount: 15,
        style: 'circle',
      },
      author: { connect: { id: user2.id } },
    },
  })

  // Create likes
  await prisma.like.create({
    data: {
      user: { connect: { id: user1.id } },
      artWorks: { connect: { id: artwork2.id } },
    },
  })

  await prisma.like.create({
    data: {
      user: { connect: { id: user2.id } },
      artWorks: { connect: { id: artwork1.id } },
    },
  })

  console.log('Data created successfully.')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

