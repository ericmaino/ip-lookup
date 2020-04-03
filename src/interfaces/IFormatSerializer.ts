import { IEnumerator } from 'meeteric-ts';
import { IpRangeRecord } from '../ip';

export interface IFormatSerializer {
    Deserialize(contents: string): Promise<IEnumerator<IpRangeRecord>>;
}