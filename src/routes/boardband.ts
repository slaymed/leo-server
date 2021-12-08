import { FAST, SUPER, ULTRA } from "./../entities/Plan";
import { Request, Response, Router } from "express";
import filterAddresses from "../helpers/filterAddresses";
import axios from "axios";
import filterNetworks from "../helpers/filterNetworks";
import mapAxiosErrors from "../helpers/mapAxiosErrors";
import Plan from "../entities/Plan";

const loadAddressList = async (req: Request, res: Response) => {
    const { postCode } = req.body;

    const xml = `<Request module="dwapi" call="address_search" id="46309a3e6119271cb28dce16ebb9bc3e" version="1.0">
    <block name="auth">
      <a name="username" format="text">${process.env.DIGITAL_WHOLESALE_SOLUTION_USERNAME}</a>
      <a name="password" format="password">${process.env.DIGITAL_WHOLESALE_SOLUTION_PASSWORD}</a>
    </block>
   <a name="postcode" format="text">${postCode}</a>
  </Request>
  `;
    try {
        const response = await axios.post(
            process.env.DIGITAL_WHOLESALE_SOLUTION_URL as string,
            xml
        );

        const xmlResponse = response.data;

        const addresses = filterAddresses(xmlResponse);

        return res.send(addresses);
    } catch (error) {
        return res.status(500).json(mapAxiosErrors(error));
    }
};

export const checkAvailability = async (req: Request, res: Response) => {
    const { addressReference, cssDatabaseCode } = req.body;

    const xml = `<Request module="dwapi" call="availability" id="0aa6bbc9901b21b6a0d1b9aefee2fec2" version="1.0">
  <block name="auth">
    <a name="username" format="text">${process.env.DIGITAL_WHOLESALE_SOLUTION_USERNAME}</a>
    <a name="password" format="password">${process.env.DIGITAL_WHOLESALE_SOLUTION_PASSWORD}</a>
  </block>
  <a name="address-reference" format="text">${addressReference}</a>
  <a name="css-database-code" format="text">${cssDatabaseCode}</a>
</Request>
  `;

    try {
        const response = await axios.post(
            process.env.DIGITAL_WHOLESALE_SOLUTION_URL as string,
            xml
        );

        const xmlResponse = response.data;

        const { fastPlan, superFastPlan, ultraFastPlan } =
            filterNetworks(xmlResponse);

        let plans: any = {};

        if (fastPlan) {
            const plan = await Plan.findOne({ PlanType: FAST });

            if (plan) {
                fastPlan.plan = plan;
                plans.fastPlan = fastPlan;
            }
        }
        if (superFastPlan) {
            const plan = await Plan.findOne({ PlanType: SUPER });

            if (plan) {
                superFastPlan.plan = plan;
                plans.superFastPlan = superFastPlan;
            }
        }
        if (ultraFastPlan) {
            const plan = await Plan.findOne({ PlanType: ULTRA });

            if (plan) {
                ultraFastPlan.plan = plan;
                plans.ultraFastPlan = ultraFastPlan;
            }
        }

        return res.json(plans);
    } catch (error) {
        return res.status(500).json(mapAxiosErrors(error));
    }
};

const router = Router();

router.post("/addressList", loadAddressList);
router.post("/boardband/availability", checkAvailability);

export default router;
