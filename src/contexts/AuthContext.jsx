/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, useRef, useCallback } from 'react';
import { useToast } from '../hooks/useToast';

const SESSION_KEY = "ticketapp_session";
const USERS_KEY = "ticketapp_users";
const SESSION_DURATION = 60 * 60 * 1000; // 1 hour
export const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const expiryTimerRef = useRef(null)


  // --- Helper: Save session, scheduleExpiry, clearExpiry ---
  const clearExpiryTimer = useCallback(() => {
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current)
      expiryTimerRef.current = null
    }
  }, [])

  // --- Logout ---
  const logout = useCallback((expired = false) => {
    localStorage.removeItem(SESSION_KEY);
    clearExpiryTimer()
    setUser(null);
    setSessionToken(null);
    if (expired) {
      toast?.show?.("Your session has expired — please log in again.", "info");
    } else {
      toast?.show?.("Logged out successfully.", "success");
    }
  }, [clearExpiryTimer, toast]);

  const scheduleExpiry = useCallback((expiresAt) => {
    clearExpiryTimer()
    if (!expiresAt) return
    const ms = expiresAt - Date.now()
    if (ms <= 0) { logout(true); return }
    expiryTimerRef.current = setTimeout(() => logout(true), ms)
  }, [clearExpiryTimer, logout])

  const saveSession = useCallback((user, token) => {
    const expiresAt = Date.now() + SESSION_DURATION;
    const sessionData = { user, token, expiresAt };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    setUser(user);
    setSessionToken(token);
    scheduleExpiry(expiresAt)
  }, [scheduleExpiry]);

  // --- Signup ---
  const signup = useCallback((username, email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

    // check if user already exists
    const userExists = users.some((u) => u.username === username);
    if (userExists) {
      toast?.show?.("User already exists. Please log in.", "failure");
      return {ok: false};
    }

    // add new user
    const newUser = { username, email,password };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    toast?.show?.("Account created successfully! You can now log in.", "success");
    return {ok: true};
  }, [toast]);

  // --- Login ---
  const login = useCallback((email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const foundUser = users.find((u) => u.email === email && u.password === password);

    if (!foundUser) {
      toast?.show?.("Invalid email or password", "error");
      console.log(foundUser);      
      return {ok: false};
    }

    // simulate token
    const token = btoa(`${email}:${password}`);
    saveSession(foundUser, token);
    toast?.show?.("Login successful", "success");
    return {ok: true};
  }, [toast, saveSession]);

  // --- Session Validation ---
  const validateSession = useCallback(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return false;

    try {
      const session = JSON.parse(stored);
      if (session.expiresAt > Date.now()) {
        setUser(session.user);
        setSessionToken(session.token);

        // reschedule logout
        const timeLeft = session.expiresAt - Date.now();
        setTimeout(() => logout(true), timeLeft);
        return true;
      } else {
        logout(true);
        return false;
      }
    } catch {
      logout(true);
      return false;
    }
  }, [logout]);

  // --- On Mount ---
  useEffect(() => {
    const isValid = validateSession();
    setLoading(false);
    if (!isValid) {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [validateSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionToken,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!sessionToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
