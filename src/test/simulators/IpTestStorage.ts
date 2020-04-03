import { Ip } from "../..";
import { IEnumerator } from "meeteric-ts";

export class IpTestStorage implements Ip.IQueryableIpRange {
    private readonly data: Map<string, Ip.IpRangeRecord[]>;

    constructor() {
        this.data = new Map<string, Ip.IpRangeRecord[]>();
    // tslint:disable:no-backbone-get-set-outside-model
        this.data.set("1.2.3.4", [
            {
                start: Ip.Parser.FromAddress("1.0.0.0"),
                end: Ip.Parser.FromAddress("1.3.0.255"),
                location: {
                    region: "OC",
                    country: "AU",
                    state: "Queensland",
                    city: "South Brisbane",
                    latitude: "-27.4748",
                    longitude: "153.017"
                }
            }
        ]);
    // tslint:enable:no-backbone-get-set-outside-model
    }

    public async Query(input: Ip.IpAddress): Promise<IEnumerator<Ip.IpRangeRecord>> {
        return new ArrayEnumerator(this.data.get(input.address));
    }
}

class ArrayEnumerator<T> implements IEnumerator<T> {
    private readonly items: T[];
    private index: number;

    constructor(items: T[]) {
        this.items = items;
        this.index = -1;
    }

    public async MoveNext(): Promise<boolean> {
        this.index += 1;
        return this.items && this.index < this.items.length;
    }

    public async Read(): Promise<T> {
        return this.items[this.index];
    }
}