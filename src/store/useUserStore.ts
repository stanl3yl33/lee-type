import { create } from "zustand";
// used for tracking if user is logged in as guest or not, user profile, data like highest score wpm

/**
 * States to consider:
 * isLoggedIn
 * userId - from db we are using
 * email
 * username
 *
 */

type UserState = {
  isLoggedIn: boolean;
  userId: string;
  email: string | null;
  username: string;

  // setters
  setLoggedState: (isLoggedIn: boolean) => void;
  setUserId: (userId: string) => void;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;

  // clear user - to be used to return back to guest state
  clearUser: () => void;
};

const useUserStore = create<UserState>()((set) => ({
  isLoggedIn: false,
  userId: "",
  email: null,
  username: "",

  // setters:
  // need to be arrow functions else, they would run immediately when store is created
  setLoggedState: (loggedState) => set({ isLoggedIn: loggedState }),
  setUserId: (userId) => set({ userId: userId }),
  setUsername: (username) => set({ username: username }),
  setEmail: (email) => set({ email: email }),
  clearUser: () =>
    set({
      isLoggedIn: false,
      userId: "",
      email: null,
      username: "",
    }),
}));

export default useUserStore;
