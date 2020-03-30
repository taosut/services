import * as Midtrans from 'midtrans-client';

export const midtransConfig = {
  merchantID: process.env.MIDTRANS_MERCHANT_ID || 'G961651544',
  clientKey:
    process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-Rp260Ny4ZJexTOed',
  serverKey:
    process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-LYYk8zDVNkcUDIhtG6-fwJaw',
  expiry_duration: process.env.MIDTRANS_EXPIRY_DURATION || 24,
};

const midtrans = new Midtrans.CoreApi({
  isProduction: process.env.IS_PRODUCTION || false,
  serverKey: midtransConfig.serverKey,
  clientKey: midtransConfig.clientKey,
});

export const midtransSnap = new Midtrans.Snap({
  isProduction: process.env.IS_PRODUCTION || false,
  serverKey: midtransConfig.serverKey,
  clientKey: midtransConfig.clientKey,
});

export default midtrans;
