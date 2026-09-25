"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, BookOpenCheck, Loader2, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { STRAPI_URL } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AcademicResult {
  id: number;
  documentId: string;
  academicYear: string;
  grade: string;
  semester: "semester_1" | "semester_2" | "average";
  subjects: Record<string, number>;
  total: number;
  average: number;
  rank: number;
}

interface AcademicResultsResponse {
  data: AcademicResult[];
  meta?: {
    child?: {
      documentId?: string;
      fullName?: string;
    };
    count?: number;
  };
}

interface AcademicResultsProps {
  child: {
    id: number | string;
    documentId?: string;
    fullName: string;
  };
}

type ResultsByYear = Array<{
  academicYear: string;
  grade: string;
  periods: Partial<Record<AcademicResult["semester"], AcademicResult>>;
  subjects: string[];
}>;

const PERIODS: Array<{ key: AcademicResult["semester"]; label: string }> = [
  { key: "semester_1", label: "Semester I" },
  { key: "semester_2", label: "Semester II" },
  { key: "average", label: "Year Average" },
];

const resultsCache = new Map<string, AcademicResult[]>();

export function groupAcademicResults(results: AcademicResult[]): ResultsByYear {
  const grouped = new Map<string, AcademicResult[]>();

  for (const result of results) {
    const existing = grouped.get(result.academicYear) ?? [];
    existing.push(result);
    grouped.set(result.academicYear, existing);
  }

  return Array.from(grouped, ([academicYear, yearResults]) => {
    const periods: Partial<Record<AcademicResult["semester"], AcademicResult>> = {};
    const subjects = new Set<string>();

    for (const result of yearResults) {
      periods[result.semester] = result;
      Object.keys(result.subjects ?? {}).forEach((subject) => subjects.add(subject));
    }

    return {
      academicYear,
      grade: yearResults.find((result) => result.grade)?.grade ?? "—",
      periods,
      subjects: Array.from(subjects).sort((a, b) => a.localeCompare(b)),
    };
  });
}

function formatNumber(value: number | undefined): string {
  if (value === undefined || value === null || !Number.isFinite(Number(value))) return "—";
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
}

function formatSubject(subject: string): string {
  return subject.replaceAll("_", " ");
}

function SummaryCard({
  label,
  result,
}: {
  label: string;
  result?: AcademicResult;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <h4 className="font-semibold text-gray-900">{label}</h4>
      {result ? (
        <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
          <div>
            <dt className="text-gray-500">Total</dt>
            <dd className="mt-1 font-semibold text-gray-900">{formatNumber(result.total)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Average</dt>
            <dd className="mt-1 font-semibold text-gray-900">{formatNumber(result.average)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Rank</dt>
            <dd className="mt-1 font-semibold text-gray-900">{result.rank ? `#${result.rank}` : "—"}</dd>
          </div>
        </dl>
      ) : (
        <p className="mt-3 text-sm text-gray-500">Not available</p>
      )}
    </div>
  );
}

export default function AcademicResults({ child }: AcademicResultsProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [results, setResults] = useState<AcademicResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const childRef = child.documentId || String(child.id);
  const userId = user?.id;
  const cacheKey = `${userId ?? "anonymous"}:${childRef}`;

  useEffect(() => {
    if (!isAuthenticated || !userId || !childRef) return;

    const token = localStorage.getItem("jwt");
    if (!token) return;

    const controller = new AbortController();
    const cachedResults = resultsCache.get(cacheKey);

    if (cachedResults) {
      setResults(cachedResults);
      setError(null);
      setIsLoading(false);
      return () => controller.abort();
    }

    setResults([]);
    setError(null);
    setIsLoading(true);

    async function loadResults() {
      try {
        const response = await fetch(
          `${STRAPI_URL}/api/academic-results/my-child/${encodeURIComponent(childRef)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (response.status === 401) {
          localStorage.setItem("returnUrl", window.location.pathname);
          logout();
          router.replace("/login");
          return;
        }

        if (response.status === 403) {
          throw new Error("These academic results are currently unavailable.");
        }

        if (response.status === 404) {
          throw new Error("Academic results were not found for this child.");
        }

        if (!response.ok) {
          throw new Error("We could not load academic results. Please try again later.");
        }

        const payload = (await response.json()) as AcademicResultsResponse;
        const nextResults = Array.isArray(payload.data) ? payload.data : [];
        resultsCache.set(cacheKey, nextResults);
        setResults(nextResults);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "We could not load academic results. Please try again later.",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadResults();
    return () => controller.abort();
  }, [cacheKey, childRef, isAuthenticated, logout, router, userId]);

  const groupedResults = useMemo(() => groupAcademicResults(results), [results]);

  return (
    <section className="mb-6" aria-labelledby="academic-results-heading">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary" aria-hidden="true">
          <BookOpenCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 id="academic-results-heading" className="text-xl font-bold text-gray-900">
            Academic Results
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            School performance and progress for {child.fullName}
          </p>
        </div>
      </div>

      {isLoading ? (
        <Card aria-live="polite" aria-busy="true">
          <CardContent className="flex min-h-40 flex-col items-center justify-center py-10 text-center">
            <Loader2 className="h-7 w-7 animate-spin text-primary" aria-hidden="true" />
            <p className="mt-3 text-sm text-gray-600">Loading academic results...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Alert variant="destructive" className="bg-white">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Unable to display results</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : groupedResults.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-40 flex-col items-center justify-center py-10 text-center">
            <BookOpenCheck className="h-8 w-8 text-gray-400" aria-hidden="true" />
            <p className="mt-3 text-gray-600">No academic results are available yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {groupedResults.map(({ academicYear, grade, periods, subjects }) => (
            <Card key={academicYear} className="overflow-hidden shadow-sm">
              <CardHeader className="border-b bg-primary/[0.03] sm:flex sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg text-gray-900">Academic Year {academicYear}</CardTitle>
                  <p className="mt-1 text-sm text-gray-600">Grade {grade}</p>
                </div>
                <div className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-secondary/15 px-3 py-1.5 text-sm font-semibold text-gray-800 sm:mt-0">
                  <Trophy className="h-4 w-4 text-accent" aria-hidden="true" />
                  Year rank {periods.average?.rank ? `#${periods.average.rank}` : "—"}
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-3 md:grid-cols-3">
                  {PERIODS.map(({ key, label }) => (
                    <SummaryCard key={key} label={label} result={periods[key]} />
                  ))}
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-gray-900">Subject comparison</h3>
                  {subjects.length === 0 ? (
                    <p className="rounded-lg bg-gray-50 px-4 py-5 text-sm text-gray-600">
                      Subject scores have not been added for this academic year.
                    </p>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                        <caption className="sr-only">
                          Subject results for {academicYear}, grade {grade}
                        </caption>
                        <thead className="bg-gray-50 text-gray-700">
                          <tr>
                            <th scope="col" className="px-4 py-3 font-semibold">Subject</th>
                            {PERIODS.map(({ key, label }) => (
                              <th key={key} scope="col" className="px-4 py-3 text-right font-semibold">
                                {label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {subjects.map((subject) => (
                            <tr key={subject} className="hover:bg-gray-50/70">
                              <th scope="row" className="px-4 py-3 font-medium text-gray-900">
                                {formatSubject(subject)}
                              </th>
                              {PERIODS.map(({ key }) => (
                                <td key={key} className="px-4 py-3 text-right tabular-nums text-gray-700">
                                  {formatNumber(periods[key]?.subjects?.[subject])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
