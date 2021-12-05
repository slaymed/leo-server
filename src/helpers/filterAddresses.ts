import { XMLParser } from "fast-xml-parser";

const filterAddresses = (data: any) => {
    console.log(typeof data);
    const parser = new XMLParser({
        ignoreAttributes: false,
    });

    const newData = parser.parse(data);

    type Element = {
        a: {
            "#text": string;
            "@_name": string;
            "@_format": string;
        }[];
    };

    const blockArray: Element[] = newData.Response.block.block;

    type Address = {
        building: string;
        "sub-premise": string;
        street: string;
        locality: string;
        city: string;
        county: string;
        postcode: string;
        formattedAddress: string;
        "address-reference": string;
        "css-database-code": string;
    };

    const addresses: Address[] = [];

    for (const element of blockArray) {
        const tag = element.a;
        const formattedObject: any = {};
        for (const object of tag) {
            const name = object["@_name"];
            const value = object["#text"];

            let formattedAddress = "";

            if (formattedObject["sub-premise"])
                formattedAddress += `${formattedObject["sub-premise"]} `;

            if (formattedObject["building"])
                formattedAddress += `${formattedObject["building"]}, `;

            if (formattedObject["street"])
                formattedAddress += `${formattedObject["street"]} `;

            if (formattedObject["city"])
                formattedAddress += `${formattedObject["city"]}`;

            formattedObject[name] = value;
            formattedObject["formattedAddress"] = formattedAddress;
        }
        addresses.push(formattedObject);
    }

    return addresses;
};

export default filterAddresses;
