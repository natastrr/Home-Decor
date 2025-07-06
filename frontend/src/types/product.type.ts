export type ProductType = {
  id: string,
  name: string,
  price: number,
  image: string,
  lightning: string,
  humidity: string,
  temperature: string,
  height: number,
  diameter: number,
  url: string,
  type: {
    id: string,
    name: string,
    url: string,
  },
  countInCart?: number,
  isInFave?: boolean,
}
