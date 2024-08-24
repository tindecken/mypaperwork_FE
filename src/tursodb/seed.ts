import { db } from './index';
import { ulid } from 'ulid';
import { usersTable, InsertUser } from './schema';

const hashedPassword = await Bun.password.hash('rivaldo');
const user: InsertUser = {
  id: ulid(),
  name: 'Tindecken',
  userName: 'tindecken',
  email: 'tindecken@gmail.com',
  password: hashedPassword,
  systemRole: 'user',
  isDeleted: 0,
};

await db.insert(usersTable).values(user);
