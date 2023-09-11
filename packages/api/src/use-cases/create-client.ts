import { hash } from "src/utils/hash";
import { uid } from "src/utils/uid";
import { type ClientRepo } from "src/repos/clients-repo";

type Args = {
  name: string;
};

type Ctx = {
  clientRepo: ClientRepo;
};

export async function createClient(args: Args, ctx: Ctx) {
  const id = uid(36);
  const secret = uid(72);
  const hashedSecret = hash(secret);

  const client = await ctx.clientRepo.create({
    id,
    name: args.name,
    secret: hashedSecret,
  });

  return client;
}
