import { eq } from 'drizzle-orm';
import { DB } from '@config/db';
import * as schema from '@db/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export class UserRepository {
    private db: NodePgDatabase<typeof schema>;

    constructor (){
        this.db = DB.getInstance().getConnection();
    }

    async createUser ( userData: schema.NewUser ) {
        const result = await this.db.insert(schema.usersTable).values(userData).returning();
        return result[0] || null;
    }

    async findById (id:string) {
        const result = await this.db.select().from(schema.usersTable).where(eq(schema.usersTable.id,id));
        return result[0] || null;
    }

    async findAll () {
        const result = await this.db.select().from(schema.usersTable);
        return result;
    }

    async updateUser(id: string, updates: Partial<schema.NewUser>){
    try {
      const result = await this.db
        .update(schema.usersTable)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(schema.usersTable.id, id))
        .returning();

      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to update user: ${error}`);
    }
  }

}