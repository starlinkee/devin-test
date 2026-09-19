"use client";

import { useState } from "react";

const GREETINGS = ["Hello", "Hola", "Bonjour", "Hallo", "Ciao", "Olá", "こんにちは", "안녕하세요", "Привет"];

export default function Greeter() {
  const [message, setMessage] = useState("A tiny app living on the web.");

  return (
    <>
      <p className="message" data-testid="message">
        {message}
      </p>
      <button
        onClick={() => setMessage(`${GREETINGS[Math.floor(Math.random() * GREETINGS.length)]} from Devin!`)}
      >
        Say hello
      </button>
    </>
  );
}
