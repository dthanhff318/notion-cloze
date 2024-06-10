export const replacePathParams = (
  path: string,
  params: Record<string, string>
): string =>
  path.replace(/:([^/]+)/g, (_, p1) =>
    encodeURIComponent(params[p1] ? params[p1] : "")
  );
