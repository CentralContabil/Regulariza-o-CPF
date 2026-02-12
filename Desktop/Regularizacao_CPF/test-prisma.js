const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
})

async function main() {
  try {
    const content = await prisma.landingPageContent.findMany()
    console.log('SUCCESS: Table accessible')
    console.log('DATA:', content)
  } catch (e) {
    console.error('ERROR:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
