import { useEffect, useState } from 'react';

const AppBridgeProvider = ({ children }) => {
  const [shop, setShop] = useState(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shopFromWindow = window?.shopify?.config?.shop;
      setShop(shopFromWindow);
    }
  }, []);

  if (!shop) {
    return <p>No Shop Provided</p>;
  }

  return <>{children}</>;
};

export default AppBridgeProvider;