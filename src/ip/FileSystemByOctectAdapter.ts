import { IStorage, IEnumerator } from "meeteric-ts";
import { IpAddress, IpRangeRecord, IQueryableIpRange } from ".";
import { IFormatSerializer } from "../interfaces";


export class FileSystemByOctectAdapter implements IQueryableIpRange {
    private readonly storage: IStorage;
    private readonly format: IFormatSerializer;

    constructor(storage: IStorage, format: IFormatSerializer) {
        this.storage = storage;
        this.format = format;
    }

    public async Query(ip: IpAddress): Promise<IEnumerator<IpRangeRecord>> {
        const fileName = FileSystemByOctectAdapter.GetFilenameForIp(ip);
        const contents = await this.storage.ReadItem(fileName);
        return await this.format.Deserialize(contents);
    }

    public static GetFilenameForIp(ip: IpAddress): string {
        return `ip-${ip.octectA.toString().padStart(3, "0")}.csv`;
    }
}
