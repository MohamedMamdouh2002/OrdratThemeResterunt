type AllCategories = Array<{
  id: string
  imageUrl: string
  priority: number
  isActive: boolean
  numberOfProducts: number
  bannerUrl?:string
  numberOfColumns: '1' | '2' | 'full'
  products: Array<Product>
  name: string
}>

type Product = {
    id: string
    isTopSelling: boolean
    isTopRated: boolean
    name: string
    price: number
    oldPrice: number
    description: string
    imageUrl: string
    isActive: boolean
    createdAt: string
    lastUpdatedAt: string
    isOffer: boolean
}

type Paginated<T> = {
    entities:T[]
    nextPage: number
}

type FullProduct = {
  id: string
  vat: number
  vatType: number
  discount: number
  discountType: number
  isTopSelling: boolean
  isTopRated: boolean
  seoDescription: string
  categoryId: string
  numberOfSales: number
  variations: Array<{
    id: string
    name: string
    buttonType: number
    isActive: boolean
    productId: string
    choices: Array<{
      id: string
      name: string
      price: number
      isDefault: boolean
      isActive: boolean
      variationId: string
    }>
  }>
  frequentlyOrderedWith: Array<{
    productId: string
    relatedProductId: string
    relatedProduct: {
      id: string
      price: number
      oldPrice: number
      imageUrl: string
    }
  }>
  reviews: Array<{
    reviewText: string
    rate: number
    createdAt: string
    lastUpdatedAt: string
    endUserId: string
  }>
  name: string
  price: number
  oldPrice: number
  description: string
  imageUrl: string
  isActive: boolean
  createdAt: string
  lastUpdatedAt: string
  isOffer: boolean
}

type FaqType = {
  name: string
  imageUrl?: string
  shopId: string
  faQs: Array<{
    id: string
    question: string
    answer: string
  }>
}

type Session = {
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  emailConfirmed: boolean
  roles: string[]
  accessToken: string
  accessTokenExpirationDate: string
  refreshToken: string
  refreshTokenExpirationDate: string
}

type Address = {
  id: string,
  lat: number,
	lng: number,
	type: number,
	aptNo: string,
	floor?: number,
	street: string,
	additionalDirections?: string,
	phoneNumber: string
}