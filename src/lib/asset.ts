// next/image no antepone basePath a rutas de /public en export estático.
export const asset = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
