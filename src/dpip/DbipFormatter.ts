import { IEnumerator } from 'meeteric-ts';
import { CsvParser, IFormatSerializer, Ip } from '..';
import { IpRangeRecord, IpLocation } from '../ip';

interface IpParseRecord extends IpLocation {
    readonly start: string;
    readonly end: string;
}

export class DbipFormatter implements IFormatSerializer {
    private readonly csv: CsvParser<IpParseRecord>;

    constructor() {
        this.csv = new CsvParser(
            "start",
            "end",
            "region",
            "country",
            "state",
            "city",
            "latitude",
            "longitude"
        );
    }

    public async Deserialize(contents: string): Promise<IEnumerator<IpRangeRecord>> {
        return new IpParseEnumerator(await this.csv.Parse(contents));
    }
}

class IpParseEnumerator implements IEnumerator<IpRangeRecord> {
    private readonly items: IpParseRecord[];
    private index: number;

    constructor(items: IpParseRecord[]) {
        this.items = items;
        this.index = -1;
    }

    public MoveNext(): Promise<boolean> {
        const localIndex = this.index;

        if (this.index < (this.items.length - 1)) {
            this.index = this.index + 1;
        }

        return new Promise<boolean>((resolve) => {
            resolve(localIndex !== this.index);
        });
    }

    public Read(): Promise<IpRangeRecord> {
        const local = this.items[this.index];

        return new Promise<IpRangeRecord>((resolve) => {
            const result: IpRangeRecord = {
                start: Ip.Parser.FromAddress(local.start),
                end: Ip.Parser.FromAddress(local.end),
                location: {
                    region: local.region,
                    country: local.country,
                    state: local.state,
                    city: local.city,
                    latitude: local.latitude,
                    longitude: local.longitude
                }
            };

            resolve(result);
        });
    }
}