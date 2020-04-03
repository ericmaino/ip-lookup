import { IpAddress } from ".";
import { Logger } from "meeteric-ts/telemetry";

export class Parser {
    public static FromNumber(numeric: number): IpAddress {
        const octects = this.numberToOctets(numeric);
        return this.FromOctects(octects);
    }

    public static FromAddress(address: string): IpAddress {
        const octects = address.split(".").map(x => parseInt(x));
        return this.FromOctects(octects);
    }

    private static FromOctects(octects: number[]): IpAddress {
        if (octects.length !== 4 || !this.ValidateOctets(octects)) {
            throw new Error("Invalid Ip Address");
        }

        const result = {
            address: "",
            numericValue: this.octectsToNumber(octects),
            octectA: octects[0],
            octectB: octects[1],
            octectC: octects[2],
            octectD: octects[3]
        };

        result.address = this.numberToIp(result.numericValue);

        return result;
    }

    private static ValidateOctets(octets: number[]): boolean {
        return octets
            .map((value) => value >= 0 && value <= 255)
            .reduce(((prev, curr) => prev && curr), true);
    }

    // tslint:disable:no-bitwise
    private static octectsToNumber(octects: number[]): number {
        return octects.reduce((prev, curr) => { return (prev << 8) + curr; }) >>> 0;
    }

    private static numberToIp(ip: number): string {
        return this.numberToOctets(ip).join(".");
    }

    private static numberToOctets(ip: number): number[] {
        const bitMask = 0xFFFFFFFF;
        ip = ip & bitMask;
        return [
            (ip >>> 24),
            (ip >> 16 & 255),
            (ip >> 8 & 255),
            (ip & 255)
        ];
    }
    // tslint:enable:no-bitwise
}