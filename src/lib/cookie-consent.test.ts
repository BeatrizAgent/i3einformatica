import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCookieConsent, saveCookieConsent, reopenCookieConsent, STORAGE_KEY } from "./cookie-consent";

describe("cookie-consent utility", () => {
  const mockLocalStorage: Record<string, string> = {};

  beforeEach(() => {
    // Clear mock storage
    for (const key in mockLocalStorage) {
      delete mockLocalStorage[key];
    }
    
    // Set up window and localStorage mocks
    vi.stubGlobal("window", {
      dispatchEvent: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    });

    vi.stubGlobal("localStorage", {
      getItem: vi.fn((key: string) => mockLocalStorage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        mockLocalStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockLocalStorage[key];
      })
    });
  });

  it("returns null on first visit (no consent stored)", () => {
    const consent = getCookieConsent();
    expect(consent).toBeNull();
    expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it("saves consent preferences and dispatches changes event", () => {
    const preferences = { necessary: true, analytics: true, personalization: false };
    
    saveCookieConsent(preferences);

    expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(preferences));
    expect(mockLocalStorage[STORAGE_KEY]).toBe(JSON.stringify(preferences));
    
    expect(window.dispatchEvent).toHaveBeenCalled();
    const eventCall = vi.mocked(window.dispatchEvent).mock.calls[0][0] as CustomEvent;
    expect(eventCall.type).toBe("i3e-cookie-consent-change");
    expect(eventCall.detail).toEqual(preferences);
  });

  it("re-reads saved consent correctly", () => {
    const preferences = { necessary: true, analytics: false, personalization: true };
    mockLocalStorage[STORAGE_KEY] = JSON.stringify(preferences);

    const consent = getCookieConsent();
    expect(consent).toEqual(preferences);
  });

  it("handles corrupted storage gracefully", () => {
    mockLocalStorage[STORAGE_KEY] = "{invalid-json}";
    const consent = getCookieConsent();
    expect(consent).toBeNull();
  });

  it("dispatches reopen event when triggered", () => {
    reopenCookieConsent();
    expect(window.dispatchEvent).toHaveBeenCalled();
    const eventCall = vi.mocked(window.dispatchEvent).mock.calls[0][0] as CustomEvent;
    expect(eventCall.type).toBe("i3e-cookie-consent-reopen");
  });
});
