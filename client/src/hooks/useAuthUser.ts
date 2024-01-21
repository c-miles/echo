import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { User } from "../types/userTypes";

const useAuthUser = () => {
  const { user: authUser, isLoading } = useAuth0();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const fetchedUserData = useRef(false);

  const createUser = useCallback(async () => {
    if (!authUser) return;

    try {
      const response = await fetch("http://localhost:3000/user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authUser.email,
          picture: authUser.picture,
          id: authUser.sub,
        }),
      });

      const data = await response.json();
      setUserInfo(data as User);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }, [authUser]);

  const getUserData = useCallback(async () => {
    if (!authUser || userInfo) return;

    try {
      const response = await fetch(
        `http://localhost:3000/user/${authUser.sub}`
      );
      if (response.status === 404) {
        await createUser();
      } else if (response.ok) {
        const data = await response.json();
        setUserInfo(data as User);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [authUser, userInfo, createUser]);

  useEffect(() => {
    if (!fetchedUserData.current && !isLoading) {
      getUserData();
      fetchedUserData.current = true;
    }
  }, [getUserData, isLoading]);

  const validateUsername = (username: string): string => {
    const regex = /^[a-zA-Z0-9_]+$/;
    if (!regex.test(username)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    if (username.length < 3 || username.length > 30) {
      return "Username must be between 3 and 30 characters long";
    }
    return "";
  };

  const checkUsernameAvailability = useCallback(async (username: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/check-username/${username}`
      );
      if (!response.ok) {
        throw new Error("Failed to check username availability");
      }
      const data = await response.json();
      return data.available;
    } catch (error) {
      console.error("Error checking username availability:", error);
      return false;
    }
  }, []);

  const handleUsernameUpdate = useCallback(
    async (username: string) => {
      if (!userInfo) return "User not found";

      const validationError = validateUsername(username);
      if (validationError) {
        return validationError;
      }

      const isAvailable = await checkUsernameAvailability(username);
      if (!isAvailable) {
        return "Username is already taken";
      }

      try {
        const response = await fetch(
          `http://localhost:3000/user/${userInfo.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
          }
        );
        if (!response.ok) {
          throw new Error("Username update failed");
        }
        const updatedUser = await response.json();
        setUserInfo(updatedUser);
        return "";
      } catch (error) {
        console.error("Error updating username:", error);
        return "Failed to update username";
      }
    },
    [checkUsernameAvailability, userInfo]
  );

  return { userInfo, handleUsernameUpdate };
};

export default useAuthUser;
