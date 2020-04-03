import 'mocha';
import { IEnumerator } from 'meeteric-ts';
import { Ip } from '..';
import { assert } from 'chai';
import { DbipFormatter } from '../dpip';

async function Next(x: IEnumerator<Ip.IpRangeRecord>) : Promise<Ip.IpRangeRecord> {
    await x.MoveNext();
    return await x.Read();
}

describe('IpTableParserTests', () => {

    it('should parse simple line', async () => {
        const expected: Ip.IpRangeRecord = {
            start: Ip.Parser.FromAddress("1.0.0.0"),
            end: Ip.Parser.FromAddress("1.0.0.255"),
            location: {
                region: "OC",
                country: "AU",
                state: "Queensland",
                city: "South Brisbane",
                latitude: "-27.4748",
                longitude: "153.017"
            }
        };
        const parser = new DbipFormatter();
        const line = "1.0.0.0,1.0.0.255,OC,AU,Queensland,\"South Brisbane\",-27.4748,153.017";
        const result = await Next(await parser.Deserialize(line));

        assert.deepEqual(result, expected);
    });
});
