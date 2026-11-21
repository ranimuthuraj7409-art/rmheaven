export async function fetchApiJson<T>(url: string, init: RequestInit): Promise<T> {
  const resp = await fetch(url, init);
  const contentType = (resp.headers.get('content-type') || '').toLowerCase();
  const rawText = await resp.text();
  const trimmed = rawText.trim();

  const headerIsJson =
    contentType.includes('application/json') || contentType.includes('+json');
  const bodyLooksLikeJson = trimmed.startsWith('{') || trimmed.startsWith('[');

  let parsed: (T & { error?: string; message?: string }) | null = null;
  if (trimmed && (headerIsJson || bodyLooksLikeJson)) {
    try {
      parsed = JSON.parse(trimmed) as T & { error?: string; message?: string };
    } catch {
      const snippet = trimmed.slice(0, 120);
      throw new Error(
        `Server returned an unreadable response (HTTP ${resp.status}): ${snippet}`,
      );
    }
  }

  if (!resp.ok) {
    if (parsed && (parsed.error || parsed.message)) {
      throw new Error(parsed.error || parsed.message);
    }
    const plainSnippet = trimmed
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160);
    throw new Error(
      plainSnippet
        ? `Server error (HTTP ${resp.status}): ${plainSnippet}`
        : `Server request failed with HTTP ${resp.status}. Please try again shortly.`,
    );
  }

  if (!headerIsJson && parsed === null) {
    const plainSnippet = trimmed
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160);
    throw new Error(
      plainSnippet
        ? `Unexpected server response instead of JSON: ${plainSnippet}`
        : 'Server returned an unexpected non-JSON response format.',
    );
  }

  if (parsed === null) {
    throw new Error('Server returned an empty JSON response.');
  }

  return parsed;
}
