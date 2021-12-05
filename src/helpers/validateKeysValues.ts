const cleanID = (id: string) => {
    return id.replace(/[^a-zA-Z0-9]/, " ");
};

const validateKeysValues = (object: any) => {
    const errors: any = {};
    if (typeof object === "object" && !Array.isArray(object)) {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                const value = object[key];
                if (typeof value === "string" && typeof key === "string") {
                    if (!value.trim()) {
                        const cleanedKey = cleanID(key);
                        const arrayOfWords = cleanedKey.split(" ");
                        let newKey = "";
                        for (let word of arrayOfWords) {
                            newKey +=
                                word.charAt(0).toUpperCase() +
                                word.substring(1);
                        }
                        errors[newKey] = `Must not be Empty`;
                    }
                }
            }
        }
        return errors;
    }
};

export default validateKeysValues;
