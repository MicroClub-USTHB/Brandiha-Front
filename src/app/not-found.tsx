import { SearchX } from "lucide-react";

import { Notice, NoticeLink } from "@/components/notice";

/**
 * 404 for every unmatched route. Without this the app fell back to Next's
 * default page, which arrives with none of the site's chrome.
 *
 * It renders inside the root layout, so the paint wall, theme, and fonts are
 * all still there — which is why it can use the same `Notice` as an access
 * denial.
 */
export default function NotFound() {
  return (
    <Notice
      icon={SearchX}
      status={404}
      title="Page not found"
      message="This page doesn't exist — it may have moved, or the link may be wrong."
    >
      <NoticeLink href="/">Back to home</NoticeLink>
    </Notice>
  );
}
