import 'mocha';
import { Ip } from '..';
import { assert } from 'chai';
import { IpTestStorage } from './simulators/IpTestStorage';

describe('AddressRegistrarTests', () => {
    const storage  = new IpTestStorage();
    const store = new Ip.AddressRegistrar(storage);

    it('should return IpLocationRecord', async () => {
        const expected: Ip.IpLocationRecord = {
            address: "1.2.3.4",
            location: {
                region: "OC",
                country: "AU",
                state: "Queensland",
                city: "South Brisbane",
                latitude: "-27.4748",
                longitude: "153.017"
            }
        };

        const result = await store.QueryAsString("1.2.3.4");
        assert.deepEqual(expected, result);
    });

    it('should return null', async () => {
        const expected: Ip.IpLocationRecord = null;
        const result = await store.QueryAsString("2.3.4.5");
        assert.deepEqual(result, expected);
    });
});
