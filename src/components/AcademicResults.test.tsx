import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AcademicResults from "./AcademicResults";

const routerReplace = vi.fn();
const router = { replace: routerReplace };
const logout = vi.fn();
const sponsorUser = { id: 42, email: "sponsor@example.com" };
let authenticated = true;

vi.mock("next/navigation", () => ({
  useRouter: () => router,
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: authenticated ? sponsorUser : null,
    isAuthenticated: authenticated,
    logout,
  }),
}));

const child = { id: 7, documentId: "child-doc-7", fullName: "Student Name" };

function jsonResponse(data: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

describe("AcademicResults", () => {
  beforeEach(() => {
    authenticated = true;
    localStorage.setItem("jwt", "sponsor-jwt");
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("displays successful results grouped by year with dynamic subjects", async () => {
    vi.mocked(fetch).mockImplementation(() =>
      jsonResponse({
        data: [
          {
            id: 101,
            documentId: "result-101",
            academicYear: "2018 E.C",
            grade: "1",
            semester: "semester_1",
            subjects: { DOONA: 60, ENGLISH: 90 },
            total: 150,
            average: 75,
            rank: 2,
          },
          {
            id: 102,
            documentId: "result-102",
            academicYear: "2018 E.C",
            grade: "1",
            semester: "average",
            subjects: { MATHS: 80 },
            total: 230,
            average: 76.7,
            rank: 1,
          },
        ],
      }),
    );

    render(<AcademicResults child={child} />);

    expect(await screen.findByText("Academic Year 2018 E.C")).toBeInTheDocument();
    expect(screen.getAllByText("Semester I").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Year Average").length).toBeGreaterThan(0);
    expect(screen.getByRole("rowheader", { name: "DOONA" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "ENGLISH" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "MATHS" })).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/academic-results/my-child/child-doc-7"),
      expect.objectContaining({
        headers: { Authorization: "Bearer sponsor-jwt" },
      }),
    );
  });

  it("shows the empty state", async () => {
    vi.mocked(fetch).mockImplementation(() => jsonResponse({ data: [] }));
    render(<AcademicResults child={{ ...child, documentId: "empty-child" }} />);
    expect(await screen.findByText("No academic results are available yet.")).toBeInTheDocument();
  });

  it("logs out and redirects when authentication has expired", async () => {
    vi.mocked(fetch).mockImplementation(() => jsonResponse({ error: "Unauthorized" }, 401));
    render(<AcademicResults child={{ ...child, documentId: "expired-child" }} />);

    await waitFor(() => expect(logout).toHaveBeenCalled());
    expect(routerReplace).toHaveBeenCalledWith("/login");
    expect(localStorage.getItem("returnUrl")).toBe("/");
  });

  it("cancels the old request and fetches results when the selected child changes", async () => {
    let firstSignal: AbortSignal | undefined;
    vi.mocked(fetch)
      .mockImplementationOnce((_url, init) => {
        firstSignal = init?.signal ?? undefined;
        return new Promise<Response>(() => undefined);
      })
      .mockImplementationOnce(() =>
        jsonResponse({
          data: [{
            id: 201,
            documentId: "result-201",
            academicYear: "2019 E.C",
            grade: "2",
            semester: "semester_2",
            subjects: { SCIENCE: 88 },
            total: 88,
            average: 88,
            rank: 1,
          }],
        }),
      );

    const { rerender } = render(
      <AcademicResults child={{ id: 1, documentId: "first-child", fullName: "First Child" }} />,
    );
    rerender(
      <AcademicResults child={{ id: 2, documentId: "second-child", fullName: "Second Child" }} />,
    );

    expect(await screen.findByText("Academic Year 2019 E.C")).toBeInTheDocument();
    expect(firstSignal?.aborted).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("shows a loading state while a request is pending", () => {
    vi.mocked(fetch).mockImplementation(() => new Promise<Response>(() => undefined));
    render(<AcademicResults child={{ ...child, documentId: "loading-child" }} />);
    expect(screen.getByText("Loading academic results...")).toBeInTheDocument();
  });

  it("shows a safe error state without backend details", async () => {
    vi.mocked(fetch).mockImplementation(() => jsonResponse({ error: "database stack trace" }, 500));
    render(<AcademicResults child={{ ...child, documentId: "error-child" }} />);

    expect(await screen.findByText("Unable to display results")).toBeInTheDocument();
    expect(screen.getByText("We could not load academic results. Please try again later.")).toBeInTheDocument();
    expect(screen.queryByText("database stack trace")).not.toBeInTheDocument();
  });
});
