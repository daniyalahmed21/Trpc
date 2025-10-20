import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { initTRPC } from "@trpc/server";
import z from "zod";

// 🧠 1️⃣ Create Context (runs per request)
export async function createContext() {
  // Dummy user (pretend this came from a JWT or session)
  const user = {
    id: "123",
    name: "John Doe",
    role: "admin",
  };

  return { user }; // available as ctx.user
}

type Context = Awaited<ReturnType<typeof createContext>>;

// 🛠️ 2️⃣ Initialize tRPC with context
const t = initTRPC.context<Context>().create();

export const publicProcedure = t.procedure;
export const router = t.router;

// 🧱 3️⃣ Define your input schema
const todoInputType = z.object({
  title: z.string(),
  description: z.string(),
});

// 📦 4️⃣ Create router
const appRouter = router({
  createTodo: publicProcedure
    .input(todoInputType)
    .mutation(async ({ input, ctx }) => {
      // You can now access ctx.user here
      console.log("User from context:", ctx.user);

      return {
        id: "1",
        title: input.title,
        description: input.description,
        createdBy: ctx.user.name,
      };
    }),
});

// 🚀 5️⃣ Create HTTP Server
const server = createHTTPServer({
  router: appRouter,
  createContext, // attach context
});

server.listen(3000);

export type AppRouter = typeof appRouter;
