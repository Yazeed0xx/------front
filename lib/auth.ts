import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { emailOTPClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: "http://localhost:8000", // Base URL of your Better Auth backend.
    plugins: [
        emailOTPClient(),
        expoClient({
            scheme: "rn-app",
            storagePrefix: "rn-app",
            storage: SecureStore,
        })
    ]
});