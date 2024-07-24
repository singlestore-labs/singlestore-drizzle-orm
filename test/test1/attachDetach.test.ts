import { expect, test, describe } from 'vitest'

import { dbNoDatabase } from '../dbNoDatabase';

describe('attach and detach', async () => {
	test('should detach and attach database', async () => {
		var result

		if (!process.env.UNITTEST_DATABASE) {
			throw new Error('UNITTEST_DATABASE is not defined');
		}

		result = await dbNoDatabase.detach(process.env.UNITTEST_DATABASE);

		console.log(result); // TODO: format this response in a pretty way, so we can get `result.milestone_name`

		result = await dbNoDatabase.attach(process.env.UNITTEST_DATABASE);

		console.log(result);
	}, 30 * 1000);
});
