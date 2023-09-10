import { StackContext, ApiGatewayV1Api, Config } from "sst/constructs";

export function API({ stack }: StackContext) {
  const DATABASE_HOST = new Config.Secret(stack, "DATABASE_HOST");
  const DATABASE_USERNAME = new Config.Secret(stack, "DATABASE_USERNAME");
  const DATABASE_PASSWORD = new Config.Secret(stack, "DATABASE_PASSWORD");

  const api = new ApiGatewayV1Api(stack, "api", {
    routes: {
      "ANY /{proxy+}": {
        function: {
          handler: "packages/api/src/root.handler",
          bind: [DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD],
        },
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
