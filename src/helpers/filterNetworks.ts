import { XMLParser } from "fast-xml-parser";
import Plan from "../entities/Plan";

const filterNetworks = (data: any) => {
    const parser = new XMLParser({
        ignoreAttributes: false,
    });

    const jsonResponse = parser.parse(data);

    const realres: any[] =
        jsonResponse?.Response?.block[0]?.block[0]?.block[0]?.block?.block;

    type SupplierData = {
        "supplier-product-reference": string;
        "supplier-product-subtype": string;
        "throughput-percentage": number;
        "up-speed-estimate": string;
        "down-speed-estimate": string;
        "min-range": number;
        "max-range": number;
        "max-speed-up": number;
        "max-speed-down": number;
        "minimum-guaranteed-speed": number;
        "estimated-download-range": string;
        "estimated-upload-range": string;
        plan: Plan;
    };

    const suppliers: SupplierData[] = [];

    realres.forEach((block) => {
        const fullSupplierData: any = {};

        const supplierData = block.a;

        supplierData.forEach(
            (element: any) =>
                (fullSupplierData[element["@_name"]] = element["#text"])
        );

        suppliers.push(fullSupplierData);
    });

    type TargetData = { name: string; subtype: string };

    if (suppliers?.length > 0) {
        const fastFiberPlanTargetsData: TargetData[] = [
            { name: "VF_FTTP", subtype: "80/20" },
            { name: "BT_21CN_FTTP", subtype: "80/20" },
            { name: "VF_FTTP", subtype: "40/10" },
            { name: "BT_21CN_FTTP", subtype: "40/10" },
        ];

        const superFastPlanTargetsData: TargetData[] = [
            { name: "VF_FTTP", subtype: "115/20" },
            { name: "BT_21CN_FTTP", subtype: "160/30" },
        ];

        const ultraFastPlanTargets: TargetData[] = [
            { name: "VF_FTTP", subtype: "1000/115" },
            { name: "BT_21CN_FTTP", subtype: "1000/115" },
        ];

        const searchForTargetedSupplier = (
            plantargets: TargetData[],
            suppliers: SupplierData[]
        ): SupplierData => {
            let supplier: any;

            for (const target of plantargets) {
                const targetedSupplier = suppliers.find(
                    (supplier) =>
                        supplier["supplier-product-reference"] ===
                            target.name &&
                        supplier["supplier-product-subtype"] === target.subtype
                );

                if (targetedSupplier) {
                    supplier = targetedSupplier;
                    break;
                }
            }

            return supplier;
        };

        const fastPlan = searchForTargetedSupplier(
            fastFiberPlanTargetsData,
            suppliers
        );

        const superFastPlan = searchForTargetedSupplier(
            superFastPlanTargetsData,
            suppliers
        );

        const ultraFastPlan = searchForTargetedSupplier(
            ultraFastPlanTargets,
            suppliers
        );

        return { fastPlan, superFastPlan, ultraFastPlan };
    }
    return {};
};

export default filterNetworks;
