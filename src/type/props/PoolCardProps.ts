export interface PoolCardProps {
  name: string,
  expiration: string,
  premium: number,
  coverage: number,
  buyCover: (premium: number) => Promise<void>,
  sellCover: (coverage: number) => Promise<void>
}