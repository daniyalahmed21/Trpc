"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.publicProcedure = void 0;
exports.createContext = createContext;
const standalone_1 = require("@trpc/server/adapters/standalone");
const server_1 = require("@trpc/server");
const zod_1 = __importDefault(require("zod"));
// 🧠 1️⃣ Create Context (runs per request)
function createContext() {
    return __awaiter(this, void 0, void 0, function* () {
        // Dummy user (pretend this came from a JWT or session)
        const user = {
            id: "123",
            name: "John Doe",
            role: "admin",
        };
        return { user }; // available as ctx.user
    });
}
// 🛠️ 2️⃣ Initialize tRPC with context
const t = server_1.initTRPC.context().create();
exports.publicProcedure = t.procedure;
exports.router = t.router;
// 🧱 3️⃣ Define your input schema
const todoInputType = zod_1.default.object({
    title: zod_1.default.string(),
    description: zod_1.default.string(),
});
// 📦 4️⃣ Create router
const appRouter = (0, exports.router)({
    createTodo: exports.publicProcedure
        .input(todoInputType)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input, ctx }) {
        // You can now access ctx.user here
        console.log("User from context:", ctx.user);
        return {
            id: "1",
            title: input.title,
            description: input.description,
            createdBy: ctx.user.name,
        };
    })),
});
// 🚀 5️⃣ Create HTTP Server
const server = (0, standalone_1.createHTTPServer)({
    router: appRouter,
    createContext, // attach context
});
server.listen(3000);
