import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { refreshSession } from "@/lib/auth/refresh";

/**
 * `refreshSession` keys its cache on the refresh-token string and holds a
 * success for a 10s grace window, so every test uses a fresh token to stay
 * independent of the ones before it.
 */
let tokenSeq = 0;
const nextToken = () => `refresh-token-${tokenSeq++}`;

const pair = (n: number) => ({
  access_token: `access-${n}`,
  refresh_token: `refresh-${n}`,
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("refreshSession", () => {
  it("returns the rotated pair on success", async () => {
    fetchMock.mockResolvedValue(jsonResponse(pair(1)));

    await expect(refreshSession(nextToken())).resolves.toEqual({
      status: "refreshed",
      tokens: pair(1),
    });
  });

  it("posts the presented token to /auth/refresh", async () => {
    fetchMock.mockResolvedValue(jsonResponse(pair(1)));
    const token = nextToken();

    await refreshSession(token);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/auth\/refresh$/);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ refresh_token: token });
  });

  describe("ending the session", () => {
    it.each([401, 403])("treats %i as rejected", async (status) => {
      fetchMock.mockResolvedValue(jsonResponse({ detail: "nope" }, status));

      await expect(refreshSession(nextToken())).resolves.toEqual({ status: "rejected" });
    });
  });

  describe("keeping the session", () => {
    /**
     * The distinction the whole type exists for: a backend that cannot answer
     * must never log everyone out.
     */
    it.each([500, 502, 503])("treats %i as unavailable, not rejected", async (status) => {
      fetchMock.mockResolvedValue(jsonResponse({}, status));

      await expect(refreshSession(nextToken())).resolves.toEqual({ status: "unavailable" });
    });

    it("treats a network error or timeout as unavailable", async () => {
      fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

      await expect(refreshSession(nextToken())).resolves.toEqual({ status: "unavailable" });
    });

    it("treats an unparseable body as unavailable", async () => {
      fetchMock.mockResolvedValue(
        new Response("not json", { status: 200, headers: { "Content-Type": "text/plain" } }),
      );

      await expect(refreshSession(nextToken())).resolves.toEqual({ status: "unavailable" });
    });

    /** A 200 of the wrong shape must not be stored as a live session. */
    it.each([
      ["a missing refresh token", { access_token: "a" }],
      ["a missing access token", { refresh_token: "r" }],
      ["empty strings", { access_token: "", refresh_token: "" }],
      ["a non-object", "surprise"],
      ["null", null],
    ])("treats %s as unavailable", async (_label, body) => {
      fetchMock.mockResolvedValue(jsonResponse(body));

      await expect(refreshSession(nextToken())).resolves.toEqual({ status: "unavailable" });
    });
  });

  describe("single flight", () => {
    /**
     * The race this exists for: one navigation puts several requests through
     * the proxy at once, each carrying the same cookie. The backend deletes the
     * presented token the moment it accepts it, so without collapsing these the
     * first would rotate and the rest would take a 401 for a token that was
     * valid when they read it.
     */
    it("collapses concurrent callers into one backend call", async () => {
      let release: (r: Response) => void = () => {};
      fetchMock.mockReturnValue(
        new Promise<Response>((resolve) => {
          release = resolve;
        }),
      );
      const token = nextToken();

      const inFlight = [
        refreshSession(token),
        refreshSession(token),
        refreshSession(token),
        refreshSession(token),
      ];
      release(jsonResponse(pair(2)));
      const outcomes = await Promise.all(inFlight);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      for (const outcome of outcomes) {
        expect(outcome).toEqual({ status: "refreshed", tokens: pair(2) });
      }
    });

    it("replays a completed rotation for a caller arriving inside the grace window", async () => {
      fetchMock.mockResolvedValue(jsonResponse(pair(3)));
      const token = nextToken();

      const first = await refreshSession(token);
      const second = await refreshSession(token);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(second).toEqual(first);
    });

    it("does not cache a failure, so the next request really retries", async () => {
      fetchMock
        .mockResolvedValueOnce(jsonResponse({}, 500))
        .mockResolvedValueOnce(jsonResponse(pair(4)));
      const token = nextToken();

      await expect(refreshSession(token)).resolves.toEqual({ status: "unavailable" });
      await expect(refreshSession(token)).resolves.toEqual({
        status: "refreshed",
        tokens: pair(4),
      });
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("does not cache a rejection either", async () => {
      fetchMock.mockResolvedValue(jsonResponse({}, 401));
      const token = nextToken();

      await refreshSession(token);
      await refreshSession(token);

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("keys the cache on the token, so a different one gets its own call", async () => {
      fetchMock.mockResolvedValue(jsonResponse(pair(5)));

      await refreshSession(nextToken());
      await refreshSession(nextToken());

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("stops replaying once the grace window has passed", async () => {
      fetchMock.mockResolvedValue(jsonResponse(pair(6)));
      const token = nextToken();

      await refreshSession(token);
      expect(fetchMock).toHaveBeenCalledTimes(1);

      // The window is 10s, and the sweep runs on the next call rather than on a
      // timer — so advancing the clock is enough, no fake timers needed.
      const realNow = Date.now;
      vi.spyOn(Date, "now").mockImplementation(() => realNow() + 11_000);

      await refreshSession(token);
      expect(fetchMock).toHaveBeenCalledTimes(2);

      vi.mocked(Date.now).mockRestore();
    });
  });
});
