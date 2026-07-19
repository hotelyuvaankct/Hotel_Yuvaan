import test from "node:test";
import assert from "node:assert/strict";
import { shouldPrefetchBookingData } from "./bookingPrefetch.ts";

test("skips blocking booking prefetch during local development", () => {
  assert.equal(shouldPrefetchBookingData("development"), false);
});

test("keeps booking prefetch enabled in production", () => {
  assert.equal(shouldPrefetchBookingData("production"), true);
});
