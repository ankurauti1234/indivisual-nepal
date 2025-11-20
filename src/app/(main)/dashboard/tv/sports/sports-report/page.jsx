"use client";

import React, { useState, useEffect, useRef } from "react";
import BrandAnalyticsCharts from "./brand_overview";
import AdBreakPerformancePage from "./ad-placement-and-quality";
import ShareOfVoicePage from "./match-movment-and-timings";
import BrandVisibilityPage from "./mentions-and-indsutry-view";
import PlayerBrandConnection from "./player-brand-connection";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const sections = [
  {
    id: "brand-overview",
    title: "Brand Overview",
    component: BrandAnalyticsCharts,
  },
  {
    id: "ad-placement-and-quality",
    title: "Ad Placement and Quality",
    component: AdBreakPerformancePage,
  },
  {
    id: "match-movement-and-timings",
    title: "Match Movement and Timings",
    component: ShareOfVoicePage,
  },
  {
    id: "mentions-and-industry-view",
    title: "Mentions and Industry View",
    component: BrandVisibilityPage,
  },
  {
    id: "player-brand-connection",
    title: "Player Brand Connection",
    component: PlayerBrandConnection,
  },
];

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");

  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState(undefined);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingStages, setLoadingStages] = useState(true);
  const [loadingManifest, setLoadingManifest] = useState(false);

  const [downloading, setDownloading] = useState(false);

  // ===========
  // DOWNLOAD: replaced to use selectedMatch and public/raw/<selectedMatch> files
  // ===========

  // helper to save blob as file
  const saveBlob = async (blob, suggestedName) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = suggestedName || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // quick head-like check using Range header to avoid downloading whole file where possible
  const tryHeadLike = async (path) => {
    try {
      const res = await fetch(path, {
        method: "GET",
        headers: {
          Range: "bytes=0-0",
        },
      });
      return res.ok || res.status === 206;
    } catch (err) {
      // network / CORS => treat as not found
      return false;
    }
  };

  const downloadViaFetch = async () => {
    if (!selectedMatch) {
      alert("Select a match first.");
      return;
    }

    setDownloading(true);

    try {
      // common extensions and patterns we try
      const exts = [".xlsx", ".csv", ".json", ".zip", ".pdf", ".txt"];
      const patterns = [];

      // 1) <selectedMatch>.<ext>
      for (const e of exts) {
        patterns.push(
          `/raw/${encodeURIComponent(selectedMatch)}/${encodeURIComponent(
            selectedMatch + e
          )}`
        );
      }

      // 2) raw.<ext>, data.<ext>, file.<ext>
      for (const e of exts) {
        patterns.push(`/raw/${encodeURIComponent(selectedMatch)}/raw${e}`);
        patterns.push(`/raw/${encodeURIComponent(selectedMatch)}/data${e}`);
        patterns.push(`/raw/${encodeURIComponent(selectedMatch)}/file${e}`);
      }

      // 3) sanitized no-space variants
      const sanitized = selectedMatch.replace(/\s+/g, "");
      for (const e of exts) {
        patterns.push(
          `/raw/${encodeURIComponent(selectedMatch)}/${encodeURIComponent(
            sanitized + e
          )}`
        );
      }

      // 4) if matches entry contains a rawFile/file path, try it first (non-strings)
      const maybeMatchObj = matches.find(
        (m) =>
          m === selectedMatch ||
          (typeof m !== "string" &&
            (m.name === selectedMatch || m.matchName === selectedMatch))
      );
      if (maybeMatchObj && typeof maybeMatchObj !== "string") {
        const candidatePath =
          maybeMatchObj.rawFile || maybeMatchObj.filePath || maybeMatchObj.file;
        if (candidatePath) {
          const normalized = candidatePath.startsWith("/")
            ? candidatePath
            : `/${candidatePath}`;
          // try this first
          patterns.unshift(normalized);
        }
      }

      // attempt each pattern
      let found = false;
      for (const p of patterns) {
        // quick check
        const exists = await tryHeadLike(p);
        if (!exists) continue;

        // full fetch to get content
        const full = await fetch(p);
        if (!full.ok) continue;
        const blob = await full.blob();
        const filename = decodeURIComponent(
          p.split("/").pop() || `${selectedMatch}.bin`
        );
        await saveBlob(blob, filename);
        found = true;
        break;
      }

      if (!found) {
        alert(
          `No file found in public/raw/${selectedMatch}.\n\n` +
            "I tried common names like:\n" +
            `${selectedMatch}.xlsx, raw.xlsx, data.xlsx, etc.\n\n` +
            'Either place a file with a predictable name in public/raw/<match-folder>/ or add the exact path to your matches data (e.g. add `rawFile: "raw/<match-folder>/myfile.xlsx"`).'
        );
      }
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed — check console.");
    } finally {
      setDownloading(false);
    }
  };

  // ===========
  // rest of original code unchanged
  // ===========

  const navRef = useRef(null);
  const sentinelRef = useRef(null);
  const [isNavStuck, setIsNavStuck] = useState(false);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoadingMatches(true);
        const res = await fetch("/api/matches");
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.matches || [];
        setMatches(list);
        setFilteredMatches(list);
        if (list.length > 0) setSelectedMatch(list[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMatches(false);
      }
    };
    fetchMatches();
  }, []);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        setLoadingStages(true);
        const res = await fetch("/api/stages");
        const body = await res.json();
        const list = Array.isArray(body.stages) ? body.stages : [];
        setStages(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStages(false);
      }
    };
    fetchStages();
  }, []);

  useEffect(() => {
    if (!selectedStage) {
      setFilteredMatches(matches);
      if (matches.length > 0) setSelectedMatch(matches[0]);
      return;
    }

    const fetchManifest = async () => {
      try {
        setLoadingManifest(true);
        const res = await fetch(`/api/stage-manifests?stage=${selectedStage}`);
        const body = await res.json();
        const manifestIds = Array.isArray(body.matchIds) ? body.matchIds : [];
        const matched = matches.filter((m) => manifestIds.includes(m));

        setFilteredMatches(matched.length ? matched : manifestIds);
        if ((matched.length ? matched : manifestIds).length > 0)
          setSelectedMatch((matched.length ? matched : manifestIds)[0]);
      } catch (err) {
        console.error(err);
        setFilteredMatches(matches);
      } finally {
        setLoadingManifest(false);
      }
    };
    fetchManifest();
  }, [selectedStage, matches]);

  const friendlyMatchLabel = (match) =>
    (match || "")
      .replace(/^match/i, "")
      .replace(/\(|\)/g, " ")
      .trim();

  useEffect(() => {
    if (!sentinelRef.current || !navRef.current) return;

    const updateNavHeight = () => {
      setNavHeight(navRef.current.getBoundingClientRect().height);
    };

    updateNavHeight();
    window.addEventListener("resize", updateNavHeight);

    const observer = new IntersectionObserver(
      (entries) => setIsNavStuck(!entries[0].isIntersecting),
      { root: null, threshold: [0, 1] }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateNavHeight);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-full mx-auto py-6 px-6 lg:px-12 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold">Brand Performance Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Comprehensive analytics for brand visibility and ad effectiveness
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-end gap-6">
            {/* Stage */}
            <div className="flex flex-col space-y-1">
              <Label className="text-sm text-muted-foreground">Stage</Label>
              <Select
                value={selectedStage ?? "all"}
                onValueChange={(v) =>
                  setSelectedStage(v === "all" ? undefined : v)
                }
              >
                <SelectTrigger className="w-[160px] h-[40px] bg-background border-input">
                  <SelectValue placeholder="All Stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Match */}
            <div className="flex flex-col space-y-1">
              <Label className="text-sm text-muted-foreground">Match</Label>
              <Select
                value={selectedMatch || undefined}
                onValueChange={(v) => setSelectedMatch(v)}
              >
                <SelectTrigger className="w-[220px] h-[40px] bg-background border-input">
                  <SelectValue placeholder="Select Match" />
                </SelectTrigger>
                <SelectContent>
                  {filteredMatches.map((match) => (
                    <SelectItem key={match} value={match}>
                      {friendlyMatchLabel(match)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Export */}
            <div className="flex items-end">
              <button
                onClick={downloadViaFetch}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-3 py-[10px] rounded-md bg-muted border border-input text-sm font-medium h-[40px] hover:opacity-95"
              >
                {/* download icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>

                {downloading ? "Downloading…" : "Export"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div ref={sentinelRef} />

      {isNavStuck && <div style={{ height: navHeight }} />}

      {/* Navigation Tabs */}
      <nav
        ref={navRef}
        className={`top-0 left-0 right-0 z-50 ${
          isNavStuck
            ? "fixed bg-card/90 backdrop-blur-sm shadow-lg"
            : "relative"
        }`}
      >
        <div className="max-w-full mx-auto px-6 lg:px-12">
          <div className="flex space-x-1 overflow-x-auto py-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-5 py-2.5 rounded-md text-sm ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="py-8 px-6 lg:px-12 max-w-full">
        {!selectedMatch ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Select a match
          </div>
        ) : (
          sections.map((section) => (
            <section
              key={section.id}
              className={`${activeSection === section.id ? "block" : "hidden"}`}
            >
              <section.component selectedMatch={selectedMatch} />
            </section>
          ))
        )}
      </main>
    </div>
  );
}
