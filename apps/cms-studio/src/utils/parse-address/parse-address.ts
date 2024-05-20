export interface AddressArrayItem {
    long_name: string;
    short_name: string;
    types: string[];
}

export const parseAddress = (addressJsonString: string) => {
    const addressArray: AddressArrayItem[] = addressJsonString ? JSON.parse(addressJsonString).value : [];
    const addressObj: { [key: string]: string } = {};
    addressArray?.forEach(({ short_name, types }) => {
        types.forEach(type => {
            addressObj[type] = short_name;
        });
    })
    return addressObj;
};

export const getShortAddress = (addressJsonString: string) => {
    const addressObj = parseAddress(addressJsonString);
    return `${addressObj.route} ${addressObj.street_number}, ${addressObj.sublocality || addressObj.postal_town}`;
};