import 'mocha';
import { Ip } from '..';
import { assert } from 'chai';

describe('FileSystemByOctectAdapter', () => {
    it('valid ip should return formatted filename', async () => {
        const expected = "ip-001.csv";
        const ip = Ip.Parser.FromAddress("1.2.3.4");
        const result = Ip.FileSystemByOctectAdapter.GetFilenameForIp(ip);
        assert.deepEqual(expected, result);
    });
});
