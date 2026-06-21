"use client";

import React, { useState } from "react";
import { Play, Video, Filter, Award } from "lucide-react";
import {
  STRESS_VIDEOS,
  VIDEO_CATEGORIES,
  type ExamTag,
} from "@/lib/stressVideos";

interface StressReliefVideosProps {
  onAddXp: (amount: number) => void;
}

const EXAM_FILTERS: ExamTag[] = [
  "All",
  "JEE",
  "NEET",
  "UPSC",
  "CAT",
  "GATE",
  "CUET",
  "Boards",
];

export default function StressReliefVideos({ onAddXp }: StressReliefVideosProps) {
  const [selectedVideo, setSelectedVideo] = useState(STRESS_VIDEOS[0]);
  const [examFilter, setExamFilter] = useState<ExamTag>("All");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [watched, setWatched] = useState<Set<string>>(new Set());

  const filtered = STRESS_VIDEOS.filter((v) => {
    const examMatch =
      examFilter === "All" || v.exams.includes("All") || v.exams.includes(examFilter);
    const catMatch = categoryFilter === "all" || v.category === categoryFilter;
    return examMatch && catMatch;
  });

  const handleSelect = (video: (typeof STRESS_VIDEOS)[0]) => {
    setSelectedVideo(video);
    if (!watched.has(video.id)) {
      setWatched((prev) => new Set([...prev, video.id]));
      onAddXp(75);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Stress Relief Library
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Curated videos to lower exam anxiety, improve sleep, and build exam-day confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video player */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-black rounded-2xl overflow-hidden aspect-video shadow-lg border border-zinc-800">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?rel=0`}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-lg text-zinc-800 dark:text-zinc-100">
                  {selectedVideo.title}
                </h3>
                <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                  {selectedVideo.description}
                </p>
              </div>
              <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-full whitespace-nowrap">
                {selectedVideo.duration}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedVideo.exams.map((exam) => (
                <span
                  key={exam}
                  className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full"
                >
                  {exam}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Video list & filters */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Filter by Exam
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {EXAM_FILTERS.map((exam) => (
                <button
                  key={exam}
                  onClick={() => setExamFilter(exam)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition ${
                    examFilter === exam
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {exam}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
              Category
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {VIDEO_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition ${
                    categoryFilter === cat.id
                      ? "bg-violet-500/10 border-violet-500 text-violet-600 dark:text-violet-400"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filtered.map((video) => (
              <button
                key={video.id}
                onClick={() => handleSelect(video)}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  selectedVideo.id === video.id
                    ? "bg-indigo-500/5 border-indigo-500"
                    : "bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/60 hover:border-indigo-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0">
                    <Play className="w-3.5 h-3.5 fill-rose-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                      {video.title}
                    </p>
                    <p className="text-[10px] text-zinc-400">{video.duration}</p>
                  </div>
                  {watched.has(video.id) && (
                    <Award className="w-3.5 h-3.5 text-amber-500 ml-auto flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <p className="text-[10px] text-zinc-400 text-center flex items-center justify-center gap-1">
            <Video className="w-3 h-3" />
            {watched.size} videos watched · +75 XP each
          </p>
        </div>
      </div>
    </div>
  );
}
