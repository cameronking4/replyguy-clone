import * as z from "zod";

export const connectXSchema = z.object({
  clientId: z.string().min(2, {
    message: "Client ID can't be empty.",
  }),
  clientSecret: z.string().min(2, {
    message: "Client Secret can't be empty.",
  }),
});

export type ConnectX = z.infer<typeof connectXSchema>;
