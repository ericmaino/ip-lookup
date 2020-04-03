import 'mocha';
import { CsvParser } from '..';
import { assert } from 'chai';

describe('CSVParserTests', () => {

    it('should parse simple line', async () => {
        const expected = {
            Start : "1",
            End : "2"
        };
        const parser = new CsvParser("Start", "End");
        const line = "1,2";
        const result = await parser.ParseLine(line);

        assert.deepEqual(result, expected);
    });

    it('should parse line with quoted string', async () => {
        const expected = {
            Start : "1",
            Middle : "2 3 4",
            End : "5"
        };
        const parser = new CsvParser("Start", "Middle", "End");
        const line = "1,\"2 3 4\",5";
        const result = await parser.ParseLine(line);

        assert.deepEqual(result, expected);
    });

    it('should parse line with quoted comma', async () => {
        const expected = {
            Start : "1",
            Middle : "2,",
            End : "5"
        };
        const parser = new CsvParser("Start", "Middle", "End");
        const line = "1,\"2,\",5";
        const result = await parser.ParseLine(line);

        assert.deepEqual(result, expected);
    });

    it('should trim from begining of line', async () => {
        const expected = {
            Start : "1",
            Middle : "2",
            End : "5"
        };
        const parser = new CsvParser("Start", "Middle", "End");
        const line = "  1,2,5";
        const result = await parser.ParseLine(line);

        assert.deepEqual(result, expected);
    });

    it('should trim from end of line', async () => {
        const expected = {
            Start : "1",
            Middle : "2",
            End : "5"
        };
        const parser = new CsvParser("Start", "Middle", "End");
        const line = "1,2,5   ";
        const result = await parser.ParseLine(line);

        assert.deepEqual(result, expected);
    });

    it('should trim from beginning and end of line', async () => {
        const expected = {
            Start : "1",
            Middle : "2",
            End : "5"
        };
        const parser = new CsvParser("Start", "Middle", "End");
        const line = " 1,2,5   ";
        const result = await parser.ParseLine(line);

        assert.deepEqual(result, expected);
    });

    it('should trim from when value in middle', async () => {
        const expected = {
            Start : "1",
            Middle : "2",
            End : "5"
        };
        const parser = new CsvParser("Start", "Middle", "End");
        const line = " 1, 2 ,5   ";
        const result = await parser.ParseLine(line);

        assert.deepEqual(result, expected);
    });

    it('should not trim leading space when quoted', async () => {
        const expected = {
            Start : "1",
            Middle : " 2 ",
            End : "5"
        };
        const parser = new CsvParser("Start", "Middle", "End");
        const line = " 1, \" 2 \",5   ";
        const result = await parser.ParseLine(line);

        assert.deepEqual(result, expected);
    });
});
