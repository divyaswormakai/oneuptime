import React, { ReactElement } from "react";
import BaseModelTable, { BaseTableProps } from "./BaseModelTable";
import BaseModel from "Common/Models/BaseModel";
import ModelAPI from "../../Utils/ModelAPI/ModelAPI";
import ObjectID from "Common/Types/ObjectID";
import { JSONObject } from "Common/Types/JSON";
import Dictionary from "Common/Types/Dictionary";
import Select from "../../Utils/BaseDatabase/Select";

export interface ComponentProps<TBaseModel extends BaseModel> extends BaseTableProps<TBaseModel> {
    modelAPI?: typeof ModelAPI | undefined;
}

const ModelTable: <TBaseModel extends BaseModel>(
    props: ComponentProps<TBaseModel>
) => ReactElement = <TBaseModel extends BaseModel>(
    props: ComponentProps<TBaseModel>
): ReactElement => {

        const modelAPI: typeof ModelAPI = props.modelAPI || ModelAPI;
        const model: TBaseModel = new props.modelType();

        return (
            <BaseModelTable
                {...props}
                callbacks={{

                    getSelect: (select: Select<TBaseModel>): Select<TBaseModel> => {
                        const slugifyColumn: string | null = (model as  BaseModel).getSlugifyColumn();

                        if (slugifyColumn) {
                            (select as Dictionary<boolean>)[slugifyColumn] = true;
                        }

                        return select;
                    },

                    getModelFromJSON: (item: JSONObject): TBaseModel => {
                        return BaseModel.fromJSON(item, props.modelType) as TBaseModel;
                    },

                    deleteItem: async (item: TBaseModel) => {
                        await modelAPI.deleteItem({
                            modelType: props.modelType,
                            id: item.id as ObjectID,
                            requestOptions: props.deleteRequestOptions,
                        });
                    }
                }}
            />
        );
    }

export default ModelTable;
