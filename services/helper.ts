export function sanitizeObject(obj: object) {
  const sanitizedObj: { [key: string]: unknown } = {};

  for (const key in obj) {
    if (obj[key] !== undefined && typeof obj[key] !== "function") {
      sanitizedObj[key] = obj[key];
    }
  }

  return sanitizedObj;
}
