"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LicenseRow } from "../../lib/modData";

const PAGE_SIZE = 30;

interface Props {
  rows: LicenseRow[];
}

export default function LicenseTable({ rows }: Props) {
  const [visibleCount, setVisibleCount] = useState(
    Math.min(PAGE_SIZE, rows.length)
  );
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(Math.min(PAGE_SIZE, rows.length));
  }, [rows]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || visibleCount >= rows.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCount((count) =>
              Math.min(count + PAGE_SIZE, rows.length)
            );
          }
        });
      },
      { rootMargin: "250px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [rows.length, visibleCount]);

  const visibleRows = useMemo(
    () => rows.slice(0, visibleCount),
    [rows, visibleCount]
  );
  const hasMore = visibleCount < rows.length;

  const loadMore = () =>
    setVisibleCount((count) => Math.min(count + PAGE_SIZE, rows.length));

  return (
    <div className="space-y-3">
      <p className="text-sm text-white/60">
        Showing {visibleRows.length} of {rows.length} licenses
      </p>
      <div className="overflow-hidden rounded-3xl border border-white/10">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-white/10 text-white/70">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Mod</th>
              <th className="px-4 py-3 text-left font-semibold">License</th>
              <th className="px-4 py-3 text-left font-semibold">Source</th>
              <th className="px-4 py-3 text-left font-semibold">
                Modrinth Terms
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.name} className="odd:bg-white/5 even:bg-white/0">
                <td className="px-4 py-4">
                  <p className="font-medium text-white">{row.name}</p>
                  {row.sourceUrl && (
                    <a
                      href={row.sourceUrl}
                      className="text-xs text-white/60"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source →
                    </a>
                  )}
                </td>
                <td className="px-4 py-4 text-white/80">{row.license}</td>
                <td className="px-4 py-4">
                  {row.sourceUrl ? (
                    <a
                      href={row.sourceUrl}
                      className="text-white/70 hover:text-white"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Project page
                    </a>
                  ) : (
                    <span className="text-white/60">N/A</span>
                  )}
                </td>
                <td className="px-4 py-4 text-white">
                  {row.allowByModrinth ? (
                    <span className="text-emerald-300">Covered</span>
                  ) : (
                    <span className="text-red-300">Excluded</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10 focus-ring"
        >
          Load more licenses
        </button>
      )}
      <div ref={sentinelRef} className="h-1" aria-hidden="true" />
    </div>
  );
}
