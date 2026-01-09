import { useKiosk } from '../../contexts/KioskContext';
import { Box } from './Box';

/**
 * Box component wrapped with kiosk context
 * Uses products from the kiosk catalog
 */
export const BoxWithKiosk = () => {
  const { products } = useKiosk();
  
  return <Box products={products} />;
};

