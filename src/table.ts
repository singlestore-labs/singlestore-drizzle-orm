import {
	BuildColumns,
	TableConfig,
	entityKind,
	Table,
} from 'drizzle-orm';

import {
	MySqlColumnBuilderBase,
	MySqlTableWithColumns,
	MySqlTable,
	MySqlColumnBuilder,
	MySqlTableExtraConfig,
	MySqlColumn,
} from 'drizzle-orm/mysql-core';

import {
	SinglestoreColumnBuilder
} from './columns/common';

export class SinglestoreTable<T extends TableConfig = TableConfig> extends Table<T> {
	static readonly [entityKind]: string = 'MySqlTable';

	declare protected $columns: T['columns'];

	/** @internal */
	static readonly Symbol = Object.assign({}, Table.Symbol, {});

	/** @internal */
	override [Table.Symbol.Columns]!: NonNullable<T['columns']>;

	/** @internal */
	override [Table.Symbol.ExtraConfigBuilder]:
		| ((self: Record<string, MySqlColumn>) => MySqlTableExtraConfig)
		| undefined = undefined;
}

export function singlestoreTableWithSchema<
	TTableName extends string,
	TSchemaName extends string | undefined,
	TColumnsMap extends Record<string, MySqlColumnBuilderBase>,
>(
	name: TTableName,
	columns: TColumnsMap,
	extraConfig: ((self: BuildColumns<TTableName, TColumnsMap, 'mysql'>) => MySqlTableExtraConfig) | undefined,
	schema: TSchemaName,
	baseName = name,
): MySqlTableWithColumns<{
	name: TTableName;
	schema: TSchemaName;
	columns: BuildColumns<TTableName, TColumnsMap, 'mysql'>;
	dialect: 'mysql';
}> {
	const rawTable = new MySqlTable<{
		name: TTableName;
		schema: TSchemaName;
		columns: BuildColumns<TTableName, TColumnsMap, 'mysql'>;
		dialect: 'mysql';
	}>(name, schema, baseName);

	const builtColumns = Object.fromEntries(
		Object.entries(columns).map(([name, colBuilderBase]) => {
			const colBuilder = colBuilderBase as SinglestoreColumnBuilder;
			const column = colBuilder.build(rawTable);
			return [name, column];
		}),
	) as unknown as BuildColumns<TTableName, TColumnsMap, 'mysql'>;

	const table = Object.assign(rawTable, builtColumns);

	table[Table.Symbol.Columns] = builtColumns;
	table[Table.Symbol.ExtraConfigColumns] = builtColumns as unknown as BuildExtraConfigColumns<
		TTableName,
		TColumnsMap,
		'mysql'
	>;

	if (extraConfig) {
		table[MySqlTable.Symbol.ExtraConfigBuilder] = extraConfig as unknown as (
			self: Record<string, MySqlColumn>,
		) => MySqlTableExtraConfig;
	}

	return table;
}

export interface SinglestoreTableFn<TSchemaName extends string | undefined = undefined> {
	<
		TTableName extends string,
		TColumnsMap extends Record<string, MySqlColumnBuilderBase>,
	>(
		name: TTableName,
		columns: TColumnsMap,
		extraConfig?: (self: BuildColumns<TTableName, TColumnsMap, 'mysql'>) => MySqlTableExtraConfig,
	): MySqlTableWithColumns<{
		name: TTableName;
		schema: TSchemaName;
		columns: BuildColumns<TTableName, TColumnsMap, 'mysql'>;
		dialect: 'mysql';
	}>;
}

export const singlestoreTable: SinglestoreTableFn = (name, columns, extraConfig) => {
	return singlestoreTableWithSchema(name, columns, extraConfig, undefined, name);
};
