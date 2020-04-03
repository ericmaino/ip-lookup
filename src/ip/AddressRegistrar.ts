import { Collections } from "meeteric-ts";
import SearchTree = Collections.BalancedBinarySearchTree;
import { IQueryable } from "..";
import { IpAddress, IpRangeRecord, IpLocationRecord, Parser, IQueryableIpRange } from ".";
import { IFormatSerializer } from "../interfaces";

export class AddressRegistrar implements IQueryable<IpAddress, IpLocationRecord> {
    private readonly storage: IQueryableIpRange;
    private readonly treeMap: Map<number, SearchTree<IpRangeRecord>>;
    private readonly loadTree: SearchTree<Date>;

    constructor(storage: IQueryableIpRange) {
        this.storage = storage;
        this.treeMap = new Map<number, SearchTree<IpRangeRecord>>();
        this.loadTree = new SearchTree<Date>();
    }

    public async QueryAsString(address: string): Promise<IpLocationRecord> {
        const ip = Parser.FromAddress(address);
        return await this.Query(ip);
    }

    public async Query(ip: IpAddress): Promise<IpLocationRecord> {
        await this.LoadDataForIp(ip);

        let result: IpLocationRecord = null;
        const range = this.FindNearest(ip);

        if (range) {
            result = {
                address: ip.address,
                location: Object.assign({}, range.location)
            };
        }

        return result;
    }

    private FindNearest(ip: IpAddress): IpRangeRecord {
        const range = this.treeMap.get(ip.octectA).FindNearestLower(ip.numericValue);
        return range && this.WithinRange(ip, range.content) ? range.content : null;
    }

    private WithinRange(ip: IpAddress, range: IpRangeRecord): boolean {
        return ip.numericValue >= range.start.numericValue && ip.numericValue <= range.end.numericValue;
    }

    private async LoadDataForIp(ip: IpAddress) {
        const key = ip.octectA;
        const load = this.loadTree.Find(key);

        if (!this.treeMap.has(key)) {
            this.treeMap.set(key, new SearchTree<IpRangeRecord>());
        }

        if (!load) {
            const records = await this.storage.Query(ip);
            const tree = this.treeMap.get(key);

            while (await records.MoveNext()) {
                const r = await records.Read();
                tree.Insert(r.start.numericValue, r);
            }

            this.loadTree.Insert(key, new Date());
        }
    }
}
