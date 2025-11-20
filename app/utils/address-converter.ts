import bchaddr from 'bchaddrjs';

export const convertAddress = (input: string) => {
  const trimmed = input.trim();
  
  try {
    // Detect format
    if (bchaddr.isLegacyAddress(trimmed)) {
      const cashAddr = bchaddr.toCashAddress(trimmed);
      const parts = cashAddr.split(':');
      
      return {
        original: trimmed,
        originalType: 'Legacy Format',
        legacy: trimmed,
        cashAddrWithPrefix: cashAddr,
        cashAddrNoPrefix: parts[1],
        addressType: bchaddr.isP2PKHAddress(trimmed) ? 'P2PKH' : 'P2SH'
      };
    } 
    else if (bchaddr.isCashAddress(trimmed) || bchaddr.isCashAddress('bitcoincash:' + trimmed)) {
      const fullAddr = trimmed.includes(':') ? trimmed : 'bitcoincash:' + trimmed;
      const legacy = bchaddr.toLegacyAddress(fullAddr);
      const parts = fullAddr.split(':');
      
      return {
        original: trimmed,
        originalType: 'CashAddr Format',
        legacy,
        cashAddrWithPrefix: fullAddr,
        cashAddrNoPrefix: parts[1],
        addressType: bchaddr.isP2PKHAddress(legacy) ? 'P2PKH' : 'P2SH'
      };
    }
    
    console.error('Invalid BCH address format');
    throw new Error('Invalid BCH address format');
  } catch (err: any) {
    console.error(err.message || 'Conversion failed');  
    throw new Error(err.message || 'Conversion failed');
  }
};

export const validateAddress = (address: string) => {
  try {
    const trimmed = address.trim();
    return bchaddr.isValidAddress(trimmed) || 
           bchaddr.isValidAddress('bitcoincash:' + trimmed);
  } catch (err: any) {
    console.error(err.message || 'Validation failed');
    return false;
  }
};