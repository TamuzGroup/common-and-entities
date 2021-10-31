/* eslint-disable */
import { Db, ObjectId } from 'mongodb';
import { MigrationInterface } from 'mongo-migrate-ts';
import { data } from '../data/hcos.json';

const collectionName = 'healthcareOrganizations';

export class AddHealthcareOrganizations implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    const docs = data.map(({ _id, parent, ...rest }) => {
      return {
        _id: new ObjectId(_id),
        parent: new ObjectId(parent),
        ...rest,
      };
    });
    const specialitiesCollection = await db.createCollection(collectionName);
    await specialitiesCollection.insertMany(docs);
  }

  public async down(db: Db): Promise<any> {
    db.dropCollection(collectionName);
  }
}
