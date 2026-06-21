"use client";

import React from "react";
import { Phone, AlertTriangle } from "lucide-react";
import { CRISIS_HELPLINES } from "@/lib/safety";

interface CrisisHelplineBannerProps {
  onDismiss?: () => void;
}

export default function CrisisHelplineBanner({ onDismiss }: CrisisHelplineBannerProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-rose-600 text-white rounded-2xl p-5 shadow-lg border border-rose-700"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1">
          <h3 className="font-bold text-sm">You matter — please reach out now</h3>
          <p className="text-xs mt-1 opacity-90 leading-relaxed">
            If you are in crisis or having thoughts of self-harm, trained counselors are
            available 24/7. You are not alone.
          </p>
          <ul className="mt-3 space-y-2" aria-label="Crisis helpline numbers">
            {CRISIS_HELPLINES.map((line) => (
              <li key={line.name} className="flex items-center gap-2 text-xs">
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="font-semibold">{line.name}:</span>
                <a
                  href={`tel:${line.number.replace(/[^+\d]/g, "")}`}
                  className="underline font-bold hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white rounded"
                >
                  {line.number}
                </a>
                <span className="opacity-75">({line.hours})</span>
              </li>
            ))}
          </ul>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="mt-3 text-[11px] underline opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white rounded px-1"
            >
              I have saved these numbers — dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
