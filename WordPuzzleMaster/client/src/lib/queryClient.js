var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { QueryClient } from "@tanstack/react-query";
function throwIfResNotOk(res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!res.ok) {
            const text = (yield res.text()) || res.statusText;
            throw new Error(`${res.status}: ${text}`);
        }
    });
}
export function apiRequest(url_1) {
    return __awaiter(this, arguments, void 0, function* (url, method = "GET", data) {
        const options = {
            method: method,
            headers: data ? { "Content-Type": "application/json" } : {},
            credentials: "include",
        };
        if (data && method !== "GET") {
            options.body = JSON.stringify(data);
        }
        const res = yield fetch(url, options);
        yield throwIfResNotOk(res);
        return res;
    });
}
export const getQueryFn = (options) => (_a) => __awaiter(void 0, [_a], void 0, function* ({ queryKey }) {
    const res = yield fetch(queryKey[0], {
        credentials: "include",
    });
    if (options.on401 === "returnNull" && res.status === 401) {
        return null;
    }
    yield throwIfResNotOk(res);
    return (yield res.json());
});
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: getQueryFn({ on401: "throw" }),
            refetchInterval: false,
            refetchOnWindowFocus: false,
            staleTime: Infinity,
            retry: false,
        },
        mutations: {
            retry: false,
        },
    },
});
