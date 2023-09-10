import { StackContext, ApiGatewayV1Api } from "sst/constructs";

export function API({ stack }: StackContext) {
  const api = new ApiGatewayV1Api(stack, "api", {
    routes: {
      "ANY /{proxy+}": "packages/api/src/root.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
