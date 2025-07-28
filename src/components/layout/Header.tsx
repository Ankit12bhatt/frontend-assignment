"use client";

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "@/store/reducer/userReducer";
import type { RootState } from "@/store/store";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  let notificationCount = 5;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Missing token");
      navigate("/auth");
      return;
    }
    dispatch(logOut());
    navigate("/auth");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const initials = getInitials(user?.user_name || "User");

  return (
    <header className="w-full border-b bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="font-semibold text-xl text-gray-900 dark:text-white flex items-baseline gap-5 lg:pl-0 pl-18"
          >
            <img
              src="/images/pureflow.png"
              alt="Loan Management Logo"
              className="h-8 w-auto"
            />
            <p className="text-black opacity-75 md:block hidden">
              Loan Management
            </p>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <>
              <button
                className="relative p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 cursor-pointer" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center h-3 w-3 text-xs font-medium text-white bg-red-500 rounded-full cursor-pointer"></span>
                )}
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-center rounded-full h-8 w-8 bg-gray-200 dark:bg-gray-700 text-sm font-medium text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out"
                >
                  {initials}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-medium text-gray-900 dark:text-white break-words">
                        {user?.role?.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 break-words">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <div className=" border-gray-200 dark:border-gray-700"></div>

                      <button
                        onClick={() => {
                          setIsLoggedIn(false);
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                          ⌘ Q
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
