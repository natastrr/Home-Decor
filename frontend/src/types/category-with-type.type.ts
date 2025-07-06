export type CategoryWithTypeType = {
  id: string,
  name: string,
  url: string,
  types: {
    id: string,
    name: string,
    url: string,
  }[],
  typesUrls?: string[],
}
