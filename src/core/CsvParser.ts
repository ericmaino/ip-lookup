import * as csv from 'csv-parse';

export class CsvParser<T> {
    private readonly options;

    constructor(...columns: string[]) {
        this.options = {
            columns: columns,
            trim: true,
            skip_empty_lines: true
        };
    }

    public Parse(input: any): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            csv(input, this.options, (err, output) => {
                if (err) {
                    reject(err);
                }

                resolve(output);
            });
        });
    }

    public async ParseLine(input: any): Promise<T> {
        const result = await this.Parse(input);
        return result[0];
    }

}

