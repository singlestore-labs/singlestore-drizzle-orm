// src/index.ts
import { connection, db } from '../db';
import { NewUser, users } from '../schema';
import { SinglestoreRawQueryResult } from '../../src/singlestore-core';

async function insertUser(user: NewUser): Promise<SinglestoreRawQueryResult> {
  return db.insert(users).values(user);
}

await insertUser({ fullName: 'Morty' });

const result = await db.select().from(users)

console.log(result);

connection.end();
