export function sanitizeObject(obj: object) {
  const sanitizedObj: { [key: string]: unknown } = {};

  for (const key in obj) {
    // @ts-expect-error['not an object']
    if (obj[key] !== undefined && typeof obj[key] !== "function") {
      // @ts-expect-error['not an object']
      sanitizedObj[key] = obj[key];
    }
  }

  return sanitizedObj;
}
