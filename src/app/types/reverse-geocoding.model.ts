export type ReverseGeocodingResponse = ReverseGeocodingSuccessful | ReverseGeocodingFailed

export interface ReverseGeocodingSuccessful {
    place_id:     number;
    licence:      string;
    osm_type:     string;
    osm_id:       number;
    lat:          string;
    lon:          string;
    display_name: string;
    address:      Address;
    namedetails:  Namedetails;
    boundingbox:  string[];
}

export interface ReverseGeocodingFailed {
    error: string
}

export interface Address {
    amenity:      string;
    house_number: string;
    road:         string;
    suburb:       string;
    borough:      string;
    city:         string;
    state:        string;
    postcode:     string;
    country:      string;
    country_code: string;
}

export interface Namedetails {
    name: string;
    "name:ar": string;
    "name:fr": string;
}

export function responseFailed(response: ReverseGeocodingResponse): response is ReverseGeocodingFailed {
    return (response as ReverseGeocodingFailed).error !== undefined
}