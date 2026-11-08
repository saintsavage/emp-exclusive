import { timingSafeEqual } from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import { sendEmailDeliveryTest } from "@/lib/auth/email.server";

export const Route = createFileRoute("/api/email-test")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env.EMP_EMAIL_TEST_TOKEN?.trim();
        const authorization = request.headers.get("authorization") ?? "";
        const supplied = authorization.startsWith("Bearer ")
          ? authorization.slice("Bearer ".length).trim()
          : "";

        if (!expected || !supplied) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const expectedBytes = Buffer.from(expected);
        const suppliedBytes = Buffer.from(supplied);
        if (
          expectedBytes.length !== suppliedBytes.length ||
          !timingSafeEqual(expectedBytes, suppliedBytes)
        ) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
          await sendEmailDeliveryTest();
          return Response.json({ ok: true, message: "Test email accepted by the email provider." });
        } catch (error) {
          console.error("[email-test] Delivery failed:", error);
          return Response.json({ error: "Email delivery test failed." }, { status: 502 });
        }
      },
    },
  },
});
