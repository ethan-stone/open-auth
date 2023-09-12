import { NotFoundError } from "src/errors";
import { type ClientRepo } from "src/repos/clients-repo";
import { log } from "src/utils/logger";

type Args = {
  grantType: "client_credentials";
  clientId: string;
  clientSecret: string;
};

type Ctx = {
  clientRepo: ClientRepo;
};

/**
 *
 * @param {Args} args
 * @param {Ctx} ctx
 * @throws {Error} if client with id does not exist
 */
export async function createToken(args: Args, ctx: Ctx) {
  const client = await ctx.clientRepo.getById(args.clientId);

  if (!client) {
    throw new NotFoundError(`Client with id ${args.clientId} not found`);
  }

  log.info("generating token for client", { clientId: args.clientId });

  return {
    accessToken: "dummy token",
  };
}
