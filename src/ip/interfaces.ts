import { IQueryable } from "..";
import { IEnumerator } from "meeteric-ts";

export interface IpLocationRecord {
    address: string;
    location: IpLocation;
}
export interface IpAddress {
    readonly address: string;
    readonly numericValue: number;
    readonly octectA: number;
    readonly octectB: number;
    readonly octectC: number;
    readonly octectD: number;
}

export interface IpLocation {
    readonly region: string;
    readonly country: string;
    readonly state: string;
    readonly city: string;
    readonly latitude: string;
    readonly longitude: string;
}

export interface IpRangeRecord {
    readonly start: IpAddress;
    readonly end: IpAddress;
    readonly location: IpLocation;
}

export interface IQueryableIpRange extends IQueryable<IpAddress, IEnumerator<IpRangeRecord>> {
}
