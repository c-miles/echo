import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { User } from "../types/userTypes";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const useAuthUser = () => {
  const { user: authUser, isLoading } = useAuth0();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const fetchedUserData = useRef(false);

  const createUser = useCallback(async (username: string) => {
    if (!authUser) return "User not authenticated";

    try {
      const response = await fetch(`${API_BASE_URL}/user/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authUser.email || null, // null for GitHub users without public email
          picture: authUser.picture,
          id: authUser.sub,
          username,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return errorData.message || "Failed to create user";
      }

      const data = await response.json();
      setUserInfo(data as User);
      setUserExists(true);
      return "";
    } catch (error) {
      console.error("Error creating user:", error);
      return "Failed to create user";
    }
  }, [authUser]);

  const checkUserExists = useCallback(async () => {
    if (!authUser || userExists !== null) return;

    try {
      const response = await fetch(`${API_BASE_URL}/user/${authUser.sub}`);
      if (response.status === 404) {
        setUserExists(false);
      } else if (response.ok) {
        const data = await response.json();
        setUserInfo(data as User);
        setUserExists(true);
      } else {
        console.error("Failed to check user existence");
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
    }
  }, [authUser, userExists]);

  useEffect(() => {
    if (!fetchedUserData.current && !isLoading && authUser) {
      checkUserExists();
      fetchedUserData.current = true;
    }
  }, [checkUserExists, isLoading, authUser]);

  const validateUsername = (username: string): string => {
    const regex = /^[a-zA-Z0-9_]+$/;
    if (!regex.test(username)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    if (username.length < 3 || username.length > 20) {
      return "Username must be between 3 and 20 characters long";
    }
    return "";
  };

  const checkUsernameAvailability = useCallback(async (username: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/check-username/${username}`
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

  const handleUsernameSubmit = useCallback(
    async (username: string) => {
      const validationError = validateUsername(username);
      if (validationError) {
        return validationError;
      }

      const isAvailable = await checkUsernameAvailability(username);
      if (!isAvailable) {
        return "Username is already taken";
      }

      // For new users, create complete user record
      if (userExists === false) {
        return await createUser(username);
      }
      
      // For existing users, update username
      if (!userInfo) return "User not found";
      
      try {
        const response = await fetch(`${API_BASE_URL}/user/${userInfo.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
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
    [checkUsernameAvailability, userInfo, userExists, createUser]
  );

  return { userInfo, userExists, handleUsernameSubmit };
};

export default useAuthUser;
