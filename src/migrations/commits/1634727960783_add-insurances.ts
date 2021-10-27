/* eslint-disable */
import { Db, ObjectId } from 'mongodb';
import { MigrationInterface } from 'mongo-migrate-ts';
import { data } from '../data/insurances.json';

const collectionName = 'insurances';

export class AddInsurances implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    const docs = data.map(({ _id, ...rest }) => {
      return {
        _id: new ObjectId(_id),
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
