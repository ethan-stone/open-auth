import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "open-auth",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: "nodejs18.x",
      nodejs: {
        minify: false,
      },
    });
    app.stack(API);
  },
} satisfies SSTConfig;
