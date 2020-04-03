import * as express from 'express';
import { FileSystemStorage, Telemetry } from 'meeteric-ts';
import { DbipFormatter, Ip } from '.';
import logger = Telemetry.Logger;
import { query } from 'winston';

class ExpressApp {
    private readonly app: any;
    private readonly ipStore: Ip.AddressRegistrar;

    constructor() {
        Telemetry.Configuration.Initialize();
        this.app = express();

        const fs = new FileSystemStorage(process.env.DATA_DIR || './data');
        const storage = new Ip.FileSystemByOctectAdapter(fs, new DbipFormatter());
        this.ipStore = new Ip.AddressRegistrar(storage);
    }

    public ConfigureAndRun() {
        this.app.get('/health', async (req, res) => {
            res.status(200).send({ health: "Ok" });
        });

        this.app.get('/', async (req, res) => {
            res.status(200).send();
        });

        this.app.get('/query/:ip', async (req, res) => {
            const result: any = {
                status: 404
            };

            result.content = "Not found";

            const ip = req.params.ip;

            try {
                const queryResult = await this.ipStore.QueryAsString(ip);

                if (queryResult) {
                    result.status = 200;
                    result.content = queryResult;
                }
            } catch (err) {
                logger.Error(err.stack, { ip: ip});
                result.status = 400;
                result.content = "Invalid Query Request";
            }

            res
                .set({
                    "Content-Type": "application/json"
                })
                .status(result.status)
                .send(result.content);
        });

        const port = process.env.PORT || 3000;
        this.app.listen(port, () => {
            logger.Trace("Express server listening on port " + port);
        });
    }
}

new ExpressApp().ConfigureAndRun();