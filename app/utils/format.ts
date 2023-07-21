export const formatAddress = (address: string) =>
  `${address.toLowerCase().slice(0, 6)}...${address
    .toLowerCase()
    .slice(address.length - 4, address.length)}`
