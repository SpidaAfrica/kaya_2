export const getStoredUserId = (): string | null => {
  if (typeof window === "undefined") return null;

  const storedUserId = sessionStorage.getItem("userId");
  if (storedUserId) return storedUserId;

  const storedUser = sessionStorage.getItem("user");
  if (!storedUser) return null;

  try {
    const parsedUser = JSON.parse(storedUser);
    return parsedUser?.user?.id || parsedUser?.id || null;
  } catch {
    return null;
  }
};

export const getStoredRiderId = (): string | null => {
  if (typeof window === "undefined") return null;

  const storedRiderId =
    sessionStorage.getItem("rider_id") || sessionStorage.getItem("riderId");
  if (storedRiderId) return storedRiderId;

  const storedUser = sessionStorage.getItem("user");
  if (!storedUser) return null;

  try {
    const parsedUser = JSON.parse(storedUser);
    return parsedUser?.user?.id || parsedUser?.id || null;
  } catch {
    return null;
  }
};
