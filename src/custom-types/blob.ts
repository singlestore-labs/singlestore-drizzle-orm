import { customType } from 'drizzle-orm/mysql-core';
import fs from "fs";
import { Blob } from "buffer";

export const customBlob = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() {
      return 'blob';
    },
    toDriver(value: TData): string {
		// Convert value to Buffer
		// @ts-ignore
		const buffer = Buffer.from(value);
    
		// Convert Buffer to String
		const str = buffer.toString('utf-8'); // You can specify the encoding if needed
		
		return str;
    },

	fromDriver(value: string): TData {
		// Convert string to Buffer
		const buffer = Buffer.from(value, 'utf-8'); // Specify encoding if needed
    
		// @ts-ignore
		return buffer;
	}
})(name);
