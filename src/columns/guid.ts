import {
    ColumnBaseConfig,
    ColumnBuilderBaseConfig,
    ColumnBuilderRuntimeConfig,
    entityKind,
    Equal,
    MakeColumnConfig,
    sql
} from "drizzle-orm";
import { AnyMySqlTable, MySqlColumn, MySqlColumnBuilder } from "drizzle-orm/mysql-core";

export type SingleStoreGUIDBuilderInitial<TName extends string> = SingleStoreGUIDBuilder<{
    name: TName;
    dataType: "buffer";
    columnType: "SingleStoreGUID";
    data: Uint8Array;
    driverParam: string;
    enumValues: undefined;
    generated: undefined;
}>

export class SingleStoreGUIDBuilder<T extends ColumnBuilderBaseConfig<"buffer", "SingleStoreGUID">> extends MySqlColumnBuilder<T, SingleStoreGUIDConfig> {
    static readonly [entityKind]: string = "SingleStoreGUIDBuilder"

    constructor(name: T["name"], config?: SingleStoreGUIDConfig) {
        super(name, "buffer", "SingleStoreGUID")
    }

    /** @internal */
    build<TTableName extends string>(table: AnyMySqlTable<{name: TTableName}>): SingleStoreGUID<MakeColumnConfig<T, TTableName>> {
        return new SingleStoreGUID(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
    }
}

export class SingleStoreGUID<T extends ColumnBaseConfig<"buffer", "SingleStoreGUID">> extends MySqlColumn<T> {
    static readonly [entityKind]: string = "SingleStoreGUID"

    constructor(table: AnyMySqlTable<{name: T["tableName"]}>, config: SingleStoreGUIDBuilder<T>["config"]) {
        super(table, config)
    }

    getSQLType(): string {
        return "binary(16)"
    }

    override mapToDriverValue(value: string) {
        return sql`UNHEX(${value.replaceAll("-", "")})`
    }
}

export type SingleStoreGUIDStringBuilderInitial<TName extends string> = SingleStoreGUIDStringBuilder<{
    name: TName;
    dataType: "string";
    columnType: "SingleStoreGUIDString";
    data: string;
    driverParam: string;
    enumValues: undefined;
    generated: undefined;
}>

export class SingleStoreGUIDStringBuilder<T extends ColumnBuilderBaseConfig<"string", "SingleStoreGUIDString">> extends MySqlColumnBuilder<T, SingleStoreGUIDConfig> {
    static readonly [entityKind]: string = "SingleStoreGUIDStringBuilder"

    constructor(name: T["name"], config?: SingleStoreGUIDConfig) {
        super(name, "string", "SingleStoreGUIDString")
    }

    /** @internal */
    build<TTableName extends string>(table: AnyMySqlTable<{name: TTableName}>): SingleStoreGUIDString<MakeColumnConfig<T, TTableName>> {
        return new SingleStoreGUIDString(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
    }
}

export class SingleStoreGUIDString<T extends ColumnBaseConfig<"string", "SingleStoreGUIDString">> extends MySqlColumn<T> {
    static readonly [entityKind]: string = "SingleStoreGUIDString"

    constructor(table: AnyMySqlTable<{name: T["tableName"]}>, config: SingleStoreGUIDStringBuilder<T>["config"]) {
        super(table, config)
    }

    getSQLType(): string {
        return "binary(16)"
    }

    override mapToDriverValue(value: string) {
        return sql`UNHEX(${value.replaceAll("-", "")})`
    }

    override mapFromDriverValue(value: Uint8Array): string {
        const hex = Buffer.from(value).toString("hex");
        return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}`;
    }
}

export interface SingleStoreGUIDConfig<TMode extends "string" | "buffer" = "string" | "buffer"> {
    mode?: TMode;
}

/**
 * Creates a column with the data type `BINARY(16)`
 * 
 * Use config `{ mode: "string" }` for a string representation of the GUID
 */
export function guid<TName extends string, TMode extends SingleStoreGUIDConfig["mode"] & {}>(
    name: TName,
    config?: SingleStoreGUIDConfig<TMode> 
): Equal<TMode, "string"> extends true ? SingleStoreGUIDStringBuilderInitial<TName> : SingleStoreGUIDBuilderInitial<TName>;
export function guid(name: string, config?: SingleStoreGUIDConfig) {
    if (config?.mode === "string") {
        return new SingleStoreGUIDStringBuilder(name, config)
    }
    return new SingleStoreGUIDBuilder(name, config)
}