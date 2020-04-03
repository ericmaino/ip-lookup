import "mocha";
import { Test as MochaTest } from "mocha";
import winston = require("winston");
import { Environment } from "meeteric-ts";

export namespace Test {
    export class TestRun {
        public static UseAdapters(): boolean {
            return Environment.UseAdapters(false);
        }

        public static AdapterTest(title: string, fn: Mocha.AsyncFunc): MochaTest {
            const noOp = async () => {
                winston.debug("skipping test");
            };

            let test: MochaTest;

            if (TestRun.UseAdapters()) {
                test = TestRun.SlowTest(title, fn);
            } else {
                test = it(`SKIPPED: ${title}`, noOp);
            }

            return test;
        }

        public static SlowAdapterTest(title: string, fn: Mocha.AsyncFunc): MochaTest {
            let test: MochaTest;

            if (TestRun.UseAdapters()) {
                test = TestRun.SlowTest(title, fn);
            } else {
                test = it(title, fn);
            }

            return test;
        }

        public static SlowTest(title: string, fn: Mocha.AsyncFunc): MochaTest {
            return it(title, fn)
                .timeout(25000);
        }
    }
}