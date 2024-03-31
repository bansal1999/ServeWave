import { commandOptions, createClient } from "redis";

const subscriber = createClient();
subscriber.connect();

async function main() {
  while (1) {
    const res = await subscriber.brPop(
      commandOptions({ isolated: true }),
      "build-queue",
      0
    );
    //console.log(response);
  }
}
