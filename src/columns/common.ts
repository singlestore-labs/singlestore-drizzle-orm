import {
	ColumnBuilderBaseConfig,
	ColumnDataType,
	ColumnBuilderExtraConfig,
	entityKind,
	IsAutoincrement,
	HasDefault,
	ColumnBaseConfig,
	ColumnBuilder,
	MakeColumnConfig,
	SQL,
	HasGenerated,
} from 'drizzle-orm';

import {
	MySqlColumnBuilder,
	MySqlColumnBuilderWithAutoIncrement,
	MySqlColumnWithAutoIncrementConfig,
	MySqlColumn,
	MySqlColumnBuilderBase,
	AnyMySqlTable,
	MySqlGeneratedColumnConfig,
} from 'drizzle-orm/mysql-core';

export abstract class SinglestoreColumnBuilder<
	T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string> & {
		data: any;
	},
	TRuntimeConfig extends object = object,
	TTypeConfig extends object = object,
	TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig,
> extends ColumnBuilder<T, TRuntimeConfig, TTypeConfig & { dialect: 'mysql' }, TExtraConfig>
	implements MySqlColumnBuilderBase<T, TTypeConfig>
{
	static readonly [entityKind]: string = 'MySqlColumnBuilder';

	unique(name?: string): this {
		this.config.isUnique = true;
		this.config.uniqueName = name;
		return this;
	}

	generatedAlwaysAs(as: SQL | T['data'] | (() => SQL), config?: MySqlGeneratedColumnConfig): HasGenerated<this> {
		this.config.generated = {
			as,
			type: 'always',
			mode: config?.mode ?? 'virtual',
		};
		return this as any;
	}

	/** @internal */
	abstract build<TTableName extends string>(
		table: AnyMySqlTable<{ name: TTableName }>,
	): MySqlColumn<MakeColumnConfig<T, TTableName>>;
}

export abstract class SinglestoreColumnWithAutoIncrement<
	T extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>,
	TRuntimeConfig extends object = object,
> extends MySqlColumn<T, MySqlColumnWithAutoIncrementConfig & TRuntimeConfig> {
	static readonly [entityKind]: string = 'MySqlColumnWithAutoIncrement';

	readonly autoIncrement: boolean = this.config.autoIncrement;
}


export abstract class SinglestoreColumnBuilderWithAutoIncrement<
	T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>,
	TRuntimeConfig extends object = object,
	TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig,
> extends SinglestoreColumnBuilder<T, TRuntimeConfig & MySqlColumnWithAutoIncrementConfig, TExtraConfig> {
	static readonly [entityKind]: string = 'MySqlColumnBuilderWithAutoIncrement';

	constructor(name: NonNullable<T['name']>, dataType: T['dataType'], columnType: T['columnType']) {
		super(name, dataType, columnType);
		this.config.autoIncrement = false;
	}

	autoincrement(): IsAutoincrement<HasDefault<this>> {
		this.config.autoIncrement = true;
		this.config.hasDefault = true;
		return this as IsAutoincrement<HasDefault<this>>;
	}
}
