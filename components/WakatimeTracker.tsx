"use client"

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaClock } from "react-icons/fa";

interface WakaSummary {
  grand_total: {
    total_seconds: number;
    text: string;
    hours: number;
    minutes: number;
  };
}

const WakatimeTracker: React.FC = () => {
  const [, setHours] = useState<number>(0);
  const [, setMinutes] = useState<number>(0);
  const [text, setText] = useState<string>("0 hrs");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWakatime();
  }, []);

  const fetchWakatime = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/wakatime");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch Wakatime data");
      }

      // Get the grand_total from the last summary (most recent day)
      const summaries = data.data.data;
      let totalSeconds = 0;

      // Sum all days in the last 30 days
      summaries.forEach((day: WakaSummary) => {
        totalSeconds += day.grand_total.total_seconds;
      });

      const totalHours = Math.floor(totalSeconds / 3600);
      const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
      setHours(totalHours);
      setMinutes(totalMinutes);
      setText(`${totalHours} hrs ${totalMinutes} mins`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Wakatime data");
      setText("0 hrs");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(80,80,120,0.15)" }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/5 rounded-xl border border-white/10 p-8 shadow-lg backdrop-blur-md w-full mt-8"
    >
      <div className="flex flex-col items-center">
        <FaClock className="text-4xl text-violet-300 mb-4" />
        <h3 className="text-3xl font-bold mb-2 text-center text-white">
          {isLoading ? "Loading..." : text}
        </h3>
        <p className="text-lg font-semibold mb-2 text-center text-white">
          Coding Hours (Last 30 Days)
        </p>
        {error && (
          <p className="text-sm text-yellow-500 text-center">
            {error}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default WakatimeTracker;