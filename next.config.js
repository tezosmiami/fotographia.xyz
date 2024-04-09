module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
        'cloudflare-ipfs.com',
        'infura-ipfs.io',
        'dweb.link',
        'gateway.pinata.cloud',
        'ipfs.io',
        'services.tzkt.io',
        'ipfs.io'
    ],
},
webpack: (config, { isServer }) => {
  if (!isServer) {
    config.resolve = {
      ...config.resolve,
      fallback: {
        net: false,
        dns: false,
        tls: false,
        fs: false,
        request: false,
      },
    };
  }
  return config;
}
}
