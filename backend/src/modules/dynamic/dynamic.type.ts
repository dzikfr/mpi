import { ValidType } from "./dynamic.schema"

export const validInputGet = ["bank", "location"] as const;

export const getListDataPrefference : Record<ValidType, { table_name: string; column_name: string }> = {
    "bank" : {
        table_name: "bank",
        column_name: "bank_name",
    },
    "location" : {
        table_name: "master_event",
        column_name: "location",
    },
}