import {
	ColumnBuilderBaseConfig,
	ColumnBaseConfig,
	MakeColumnConfig,
	entityKind,
	ColumnBuilderRuntimeConfig,
} from "drizzle-orm";

import {
	SinglestoreColumnBuilderWithAutoIncrement,
	SinglestoreColumnWithAutoIncrement,
} from "./common";

import {
	MySqlBigInt53BuilderInitial,
	MySqlBigInt53Builder,
	AnyMySqlTable,
	MySqlColumnBuilderWithAutoIncrement,
	MySqlBigInt64,
	MySqlBigInt64BuilderInitial,
	MySqlBigInt64Builder,
	MySqlBigInt53,
} from "drizzle-orm/mysql-core";


export type SinglestoreBigInt53BuilderInitial<TName extends string> = SinglestoreBigInt53Builder<{
	name: TName;
	dataType: 'number';
	columnType: 'SinglestoreBigInt53';
	data: number;
	driverParam: number | string;
	enumValues: undefined;
	generated: undefined;
}>;

export class SinglestoreBigInt53Builder<T extends ColumnBuilderBaseConfig<'number', 'SinglestoreBigInt53'>>
	extends SinglestoreColumnBuilderWithAutoIncrement<T, { unsigned: boolean }>
{
	static readonly [entityKind]: string = 'SinglestoreBigInt53Builder';

	constructor(name: T['name'], unsigned: boolean = false) {
		super(name, 'number', 'SinglestoreBigInt53');
		this.config.unsigned = unsigned;
	}

	/** @internal */
	build<TTableName extends string>(
		table: AnyMySqlTable<{ name: TTableName }>,
	): SinglestoreBigInt53<MakeColumnConfig<T, TTableName>> {
		return new SinglestoreBigInt53<MakeColumnConfig<T, TTableName>>(
			table,
			this.config as ColumnBuilderRuntimeConfig<any, any>,
		);
	}
}

export class SinglestoreBigInt53<T extends ColumnBaseConfig<'number', 'SinglestoreBigInt53'>>
	extends SinglestoreColumnWithAutoIncrement<T, { unsigned: boolean }>
{
	static readonly [entityKind]: string = 'SinglestoreBigInt53';

	getSQLType(): string {
		return `bigint${this.config.unsigned ? ' unsigned' : ''}`;
	}

	mapFromDriverValue(value: number | string): number {
		if (typeof value === 'number') {
			return value;
		}
		return Number(value);
	}
}

export type SinglestoreBigInt64BuilderInitial<TName extends string> = SinglestoreBigInt64Builder<{
	name: TName;
	dataType: 'bigint';
	columnType: 'MySqlBigInt64';
	data: bigint;
	driverParam: string;
	enumValues: undefined;
	generated: undefined;
}>;

export class SinglestoreBigInt64Builder<T extends ColumnBuilderBaseConfig<'bigint', 'MySqlBigInt64'>>
	extends MySqlColumnBuilderWithAutoIncrement<T, { unsigned: boolean }>
{
	static readonly [entityKind]: string = 'MySqlBigInt64Builder';

	constructor(name: T['name'], unsigned: boolean = false) {
		super(name, 'bigint', 'MySqlBigInt64');
		this.config.unsigned = unsigned;
	}

	/** @internal */
	build<TTableName extends string>(
		table: AnyMySqlTable<{ name: TTableName }>,
	): MySqlBigInt64<MakeColumnConfig<T, TTableName>> {
		return new MySqlBigInt64<MakeColumnConfig<T, TTableName>>(
			table,
			this.config as ColumnBuilderRuntimeConfig<any, any>,
		);
	}
}

export class SinglestoreBigInt64<T extends ColumnBaseConfig<'bigint', 'SinglestoreBigInt64'>>
	extends SinglestoreColumnWithAutoIncrement<T, { unsigned: boolean }>
{
	static readonly [entityKind]: string = 'SinglestoreBigInt64';

	getSQLType(): string {
		return `bigint${this.config.unsigned ? ' unsigned' : ''}`;
	}

	// eslint-disable-next-line unicorn/prefer-native-coercion-functions
	mapFromDriverValue(value: string): bigint {
		return BigInt(value);
	}
}

interface MySqlBigIntConfig<T extends 'number' | 'bigint' = 'number' | 'bigint'> {
	mode: T;
	unsigned?: boolean;
}

// export function bigint<TName extends string, TMode extends MySqlBigIntConfig['mode']>(
// 	name: TName,
// 	config: MySqlBigIntConfig<TMode>,
// ): TMode extends 'number' ? SinglestoreBigInt53BuilderInitial<TName> : SinglestoreBigInt64BuilderInitial<TName>;
export function bigint(name: string, config: MySqlBigIntConfig) {
	if (config.mode === 'number') {
		return new SinglestoreBigInt53Builder(name, config.unsigned);
	}
	return new SinglestoreBigInt64Builder(name, config.unsigned);
}
