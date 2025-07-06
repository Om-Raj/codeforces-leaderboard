import { useToast } from "./use-toast";

interface FetchOptions extends RequestInit {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export const useFetchWithToast = () => {
  const { success, error } = useToast();

  const fetchWithToast = async <T>(
    url: string,
    options: FetchOptions = {},
  ): Promise<T | null> => {
    const {
      showSuccessToast = false,
      showErrorToast = true,
      successMessage = "Operation completed successfully",
      errorMessage = "An error occurred",
      ...fetchOptions
    } = options;

    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMsg =
          errorData?.error ||
          errorData?.message ||
          `${errorMessage} (${response.status})`;

        if (showErrorToast) {
          error(errorMsg);
        }

        throw new Error(errorMsg);
      }

      const data = await response.json();

      if (showSuccessToast) {
        success(successMessage);
      }

      return data as T;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);

      if (showErrorToast && !errorMsg.includes(errorMessage)) {
        error(errorMsg || errorMessage);
      }

      console.error("Fetch error:", err);
      return null;
    }
  };

  return { fetchWithToast };
};
