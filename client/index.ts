import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../server";

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000",
    }),
  ],
});

async function main() {
 const response = await trpc.createTodo.mutate({
  title: "Todo 1",
  description: "This is the first todo",
});

  console.log(response)
}


main()