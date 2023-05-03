import Urbit from '@urbit/http-api';
declare global {
  interface Window {
    ship: string;
    desk: string;
    urbit: Urbit;
  }
}

export {};
