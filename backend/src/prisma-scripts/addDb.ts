import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

const main = async () => {
  console.log('Starting data creation process...')

  // Create users
  console.log('Creating user1...')
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      username: 'user1',
      firstName: 'Michael',
      lastName: 'Scott',
      avatar: 'https://github.com/shadcn.png',
      clerkId: 'user_1',
    },
  })
  console.log('User1 created:', user1)

  console.log('Creating user2...')
  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      username: 'user2',
      firstName: 'Dwight',
      lastName: 'Schrute',
      avatar: '',
      clerkId: 'user_2',
    },
  })
  console.log('User2 created:', user2)

  console.log('Creating user3...')
  const user3 = await prisma.user.create({
    data: {
      email: 'faisal@example.com',
      username: 'Faisalowimer',
      firstName: 'Faisal',
      lastName: 'Owimer',
      avatar: 'https://github.com/faisalowimer.png',
      clerkId: 'user_2nxCrgCsPklrlkQ6Uu0NxvHXvE1',
    },
  })
  console.log('User3 created:', user3)

  // Create artworks
  console.log('Creating artwork1...')
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
  console.log('Artwork1 created:', artwork1)

  console.log('Creating artwork2...')
  const artwork2 = await prisma.artWork.create({
    data: {
      configuration: {
        colorA: { h: 120, s: 70, b: 65 },
        colorB: { h: 300, s: 80, b: 70 },
        stripeCount: 8,
        style: 'circle',
      },
      author: { connect: { id: user2.id } },
    },
  })
  console.log('Artwork2 created:', artwork2)

  console.log('Creating artwork3 for user3...')
  const artwork3 = await prisma.artWork.create({
    data: {
      configuration: {
        colorA: { h: 60, s: 90, b: 85 },
        colorB: { h: 330, s: 75, b: 75 },
        stripeCount: 12,
        style: 'line',
      },
      author: { connect: { id: user3.id } },
    },
  })
  console.log('Artwork3 created:', artwork3)

  // Create likes
  console.log('Creating like for user1 on artwork2...')
  const like1 = await prisma.like.create({
    data: {
      user: { connect: { id: user1.id } },
      artWorks: { connect: { id: artwork2.id } },
    },
  })
  console.log('Like1 created:', like1)

  console.log('Creating like for user2 on artwork1...')
  const like2 = await prisma.like.create({
    data: {
      user: { connect: { id: user2.id } },
      artWorks: { connect: { id: artwork1.id } },
    },
  })
  console.log('Like2 created:', like2)

  console.log('Data created successfully.')
}

main()
  .catch((err) => {
    console.error('Error occurred during data creation:', err)
    process.exit(1)
  })
  .finally(async () => {
    console.log('Disconnecting from Prisma...')
    await prisma.$disconnect()
    console.log('Disconnected from Prisma.')
  })
