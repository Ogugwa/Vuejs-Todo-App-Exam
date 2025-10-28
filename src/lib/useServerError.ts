import { ref } from "vue";
import { useRouter } from "vue-router";

export function useServerError() {
  const router = useRouter();
  const serverError = ref<string | null>(null);

  function handleServerError(error: unknown) {
    if (error instanceof Error) {
      console.error("Server Error:", error.message);
      serverError.value = error.message;

      // Check if this looks like a server error (5xx)
      if (
        error.message.includes("500") ||
        error.message.includes("network") ||
        error.message.includes("failed to fetch") ||
        error.message.includes("supabase")
      ) {
        router.push({ name: "ServerError" });
 // or a dedicated 500 route if you add one
      }
    }
  }

  return { serverError, handleServerError };
}
