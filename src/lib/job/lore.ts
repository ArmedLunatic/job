export type LoreEntry = {
  id: string
  tweetId: string   // tweet ID from the URL, e.g. "1234567890" from x.com/user/status/1234567890
  caption?: string  // Optional editorial note shown below the tweet
}

export const LORE: LoreEntry[] = [
  {
    id: "phantom-1",
    tweetId: "2027529234147906012",
  },
  {
    id: "alancarroll-1",
    tweetId: "2027415623127482616",
  },
  {
    id: "pumpfun-1",
    tweetId: "2027490510361735664",
  },
  {
    id: "soljakey-1",
    tweetId: "2027159450851901908",
  },
  {
    id: "skely-1",
    tweetId: "2027287992348598350",
  },
  {
    id: "toly-1",
    tweetId: "2027468978583478776",
  },
  {
    id: "jack-1",
    tweetId: "2027129697092731343",
  },
  {
    id: "deltaone-1",
    tweetId: "2027129402685849942",
  },
]
