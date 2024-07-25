import { customType } from 'drizzle-orm/mysql-core';
import {BSON} from 'bson';

export const customBson = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() {
      return 'bson';
    },
    toDriver(value: TData): string {
		const jsonValue = JSON.stringify(value);
		const bsonValue = BSON.serialize(JSON.parse(jsonValue));
		return bsonValue.toString();
    },

	fromDriver(value: string): TData {
		const bsonValue = BSON.deserialize(Buffer.from(value, 'base64'));
		const jsonValue = JSON.stringify(bsonValue);
		return JSON.parse(jsonValue);
	}
  })(name);
