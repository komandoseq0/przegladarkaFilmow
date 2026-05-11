"use client";
import { useEffect } from "react";

export default function InitStorage() {
  useEffect(() => {
    if (!localStorage.getItem("toWatch")) {
      localStorage.setItem("toWatch", JSON.stringify([]));
    }
    if (!localStorage.getItem("watched")) {
      localStorage.setItem("watched", JSON.stringify([]));
    }
  }, []);
  
  return null;
}