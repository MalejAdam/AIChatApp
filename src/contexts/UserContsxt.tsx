import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  phoneNumber?: string;
}

interface UserContextType {
  user: User;
  updateUser: (data: Partial<User>) => Promise<void>;
  setAvatar: (uri: string) => Promise<void>;
}

const defaultUser: User = {
  name: "Test User",
  email: "test@example.com",
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error updating user data:", error);
      throw new Error("Failed to update user data");
    }
  };

  const setAvatar = async (uri: string) => {
    try {
      const updatedUser = { ...user, avatar: uri };
      setUser(updatedUser);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error updating avatar:", error);
      throw new Error("Failed to update avatar");
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, setAvatar }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
