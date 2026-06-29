"use client";
import React, { useState } from "react";
import Auth from "@/app/auth";
import Dashboard from "./dashboard/page";

export default function AppEntry() {
	const [authenticated, setAuthenticated] = useState(false);

	// Handler to simulate authentication
	const handleAuthSuccess = () => setAuthenticated(true);

	if (!authenticated) {
		return <Auth />;
	}

	return <Dashboard />;
}
