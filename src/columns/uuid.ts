import {
    ColumnBaseConfig,
    ColumnBuilderBaseConfig,
    ColumnBuilderRuntimeConfig,
    entityKind,
    MakeColumnConfig
} from "drizzle-orm";
import { AnyMySqlTable, MySqlColumn, MySqlColumnBuilder } from "drizzle-orm/mysql-core";

export type SingleStoreUUIDBuilderInitial<TName extends string> = SingleStoreUUIDBuilder<{
    name: TName;
    dataType: "string";
    columnType: "SingleStoreUUID";
    data: string;
    driverParam: string;
    enumValues: undefined;
    generated: undefined;
}>

export class SingleStoreUUIDBuilder<T extends ColumnBuilderBaseConfig<"string", "SingleStoreUUID">> extends MySqlColumnBuilder<T> {
    static readonly [entityKind]: string = "SingleStoreUUIDBuilder"

    constructor(name: T["name"]) {
        super(name, "string", "SingleStoreUUID")
    }

    /** @internal */
    build<TTableName extends string>(table: AnyMySqlTable<{name: TTableName}>): SingleStoreUUID<MakeColumnConfig<T, TTableName>> {
        return new SingleStoreUUID(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
    }
}

export class SingleStoreUUID<T extends ColumnBaseConfig<"string", "SingleStoreUUID">> extends MySqlColumn<T> {
    static readonly [entityKind]: string = "SingleStoreUUID"

    constructor(table: AnyMySqlTable<{name: T["tableName"]}>, config: SingleStoreUUIDBuilder<T>["config"]) {
        super(table, config)
    }

    getSQLType(): string {
        return "varchar(36)"
    }
}

export function uuid<TName extends string>(name: TName): SingleStoreUUIDBuilderInitial<TName> {
    return new SingleStoreUUIDBuilder(name)
}