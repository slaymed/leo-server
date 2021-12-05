import { Request, Response, Router } from "express";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export { dayjs };

export const generateStepsDate = (engineerDate: string) => {
    const dayTime = 1000 * 60 * 60 * 24;
    const weekTime = dayTime * 7;

    const setUpTime = new Date().getTime();

    const engineerTime = dayjs(engineerDate).toDate().getTime();

    const setupDate = new Date().toISOString();
    const routerDeliveryDateFrom = new Date(setUpTime + weekTime).toISOString();
    const routerDeliveryDateTo = new Date(engineerTime - dayTime).toISOString();
    const firstBillDate = new Date(engineerTime + weekTime).toISOString();

    const dates = {
        setupDate,
        routerDeliveryDateFrom,
        routerDeliveryDateTo,
        engineerVisiteDate: engineerDate,
        goingLiveDate: engineerDate,
        firstBillDate,
    };

    return dates;
};

const engineerDate = (_: Request, res: Response) => {
    let numberOfDaysToStart = 14;
    let numberOfDaysToFinish = 14;

    const date = new Date();

    const generatedDates: string[] = [];

    const dayTime = 1000 * 60 * 60 * 24;

    let time = date.getTime();

    const excludedDays = ["Saturday", "Sunday"];

    let startTime = time + dayTime * numberOfDaysToStart;

    while (numberOfDaysToFinish > 0) {
        const dayName = dayjs(startTime).format("dddd");
        const engineerDate = dayjs(startTime).toISOString();

        if (!excludedDays.includes(dayName)) {
            generatedDates.push(engineerDate);
            numberOfDaysToFinish--;
        }

        startTime += dayTime;
    }

    res.json(generatedDates);
};

const routerDeleveryDate = async (req: Request, res: Response) => {
    const { engineerDate } = req.body;

    console.log(engineerDate);

    if (!engineerDate?.trim())
        return res
            .status(500)
            .json({ error: "Engineer Date must be provided" });

    const { routerDeliveryDateFrom, routerDeliveryDateTo } =
        generateStepsDate(engineerDate);

    return res.json({ from: routerDeliveryDateFrom, to: routerDeliveryDateTo });
};

const router = Router();

router.get("/engineerDate", engineerDate);

router.post("/routerDeleveryDate", routerDeleveryDate);

export default router;
