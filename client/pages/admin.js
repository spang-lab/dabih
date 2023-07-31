import React from "react";
import { AdminApiWrapper, AdminInterface } from "../components";

export default function Admin() {
  return (
    <AdminApiWrapper>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        <span className="text-blue"> Admin </span>
        Console
      </h1>
      <AdminInterface />
    </AdminApiWrapper>
  );
}
