import { StructuredAddress } from 'queries';

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

export const getShortAddress = (address?: string | StructuredAddress): string => {
    if (!address) return '';

    // Handle new StructuredAddress format
    if (typeof address === 'object') {
        const parts: string[] = [];
        if (address.street) {
            parts.push(address.streetNumber ? `${address.street} ${address.streetNumber}` : address.street);
        }
        if (address.city) {
            parts.push(address.city);
        }
        return parts.join(', ') || address.formattedAddress || '';
    }

    // Handle legacy JSON string format from Google Maps
    try {
        const addressObj = parseAddress(address);
        return `${addressObj.route || ''} ${addressObj.street_number || ''}, ${addressObj.sublocality || addressObj.postal_town || ''}`.trim();
    } catch {
        // If not valid JSON, return the string as-is (plain text address)
        return address;
    }
};