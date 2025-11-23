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

  const notes = useMemo(() => {
    const list: Array<{ id: number; text: string; links?: string[] }> = [];
    rows.forEach((row) => {
      if (row.noteId && row.noteText) {
        list.push({ id: row.noteId, text: row.noteText, links: row.noteLinks });
      }
    });
    return list.sort((a, b) => a.id - b.id);
  }, [rows]);

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
                  <p className="font-medium text-white">
                    {row.name}
                    {row.noteId && (
                      <sup className="ml-1 text-[10px] font-semibold text-white/70">
                        {row.noteId}
                      </sup>
                    )}
                  </p>
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
      {notes.length > 0 && (
        <div className="space-y-3 rounded-2xl bg-white/5 p-4 text-xs text-white/70">
          {notes.map(({ id, text, links }) => (
            <div key={id} className="flex flex-wrap items-center gap-2">
              <p className="m-0">
                <span className="mr-2 font-semibold text-white">{id}.</span>
                {text}
              </p>
              {links &&
                links.length > 0 &&
                links.map((href, index) => (
                  <a
                    key={`${id}-${index}`}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full border border-white/10 px-2 py-[3px] text-[11px] text-white/75 hover:border-white/20 hover:text-white"
                  >
                    Proof{links.length > 1 ? ` ${index + 1}` : ""}
                  </a>
                ))}
            </div>
          ))}
        </div>
      )}
      <div ref={sentinelRef} className="h-1" aria-hidden="true" />
    </div>
  );
}
