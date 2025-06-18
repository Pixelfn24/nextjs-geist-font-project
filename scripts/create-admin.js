const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@recflix.com'
  const adminPassword = 'admin123'
  const adminName = 'Admin User'

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    // Create admin user
    const hashedPassword = await hash(adminPassword, 10)
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('Admin user created successfully:', {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    })
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
