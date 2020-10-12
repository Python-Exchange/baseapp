import {
    DEFAULT_KYC_STEPS,
    ORDER_BOOK_DEFAULT_SIDE_LIMIT,
    STORAGE_DEFAULT_LIMIT,
} from '../constants';
import { Config } from './types';

export const defaultConfig: Config = {
    api: {
        authUrl: '',
        tradeUrl: '',
        applogicUrl: '',
        rangerUrl: '',
        arkeUrl: '',
        finexUrl: '',
    },
    minutesUntilAutoLogout: '5',
    rangerReconnectPeriod: '1',
    withCredentials: true,
    storage: {},
    gaTrackerKey: '',
    msAlertDisplayTime: '5000',
    incrementalOrderBook: false,
    finex: false,
    isResizable: false,
    isDraggable: false,
    languages: ['en'],
    sessionCheckInterval: '15000',
    balancesFetchInterval: '3000',
    passwordEntropyStep: 0,
    kycSteps: [
        'email',
        'phone',
        'profile',
        'document',
        'address',
    ],
};

export const PyhtonEx = {
    config: defaultConfig,
};

declare global {
    interface Window {
        env: Config;
    }
}

window.env = window.env || defaultConfig;
PyhtonEx.config = { ...window.env };
PyhtonEx.config.storage = PyhtonEx.config.storage || {};

export const tradeUrl = () => PyhtonEx.config.api.tradeUrl;
export const arkeUrl = () => PyhtonEx.config.api.arkeUrl || tradeUrl();
export const authUrl = () => PyhtonEx.config.api.authUrl;
export const applogicUrl = () => PyhtonEx.config.api.applogicUrl;
export const rangerUrl = () => PyhtonEx.config.api.rangerUrl;
export const finexUrl = () => PyhtonEx.config.api.finexUrl || tradeUrl();
export const minutesUntilAutoLogout = (): string => PyhtonEx.config.minutesUntilAutoLogout || '5';
export const withCredentials = () => PyhtonEx.config.withCredentials;
export const defaultStorageLimit = () => PyhtonEx.config.storage.defaultStorageLimit || STORAGE_DEFAULT_LIMIT;
export const orderBookSideLimit = () => PyhtonEx.config.storage.orderBookSideLimit || ORDER_BOOK_DEFAULT_SIDE_LIMIT;
export const gaTrackerKey = (): string => PyhtonEx.config.gaTrackerKey || '';
export const msAlertDisplayTime = (): string => PyhtonEx.config.msAlertDisplayTime || '5000';
export const rangerReconnectPeriod = (): number => PyhtonEx.config.rangerReconnectPeriod ? Number(PyhtonEx.config.rangerReconnectPeriod) : 1;
export const incrementalOrderBook = (): boolean => PyhtonEx.config.incrementalOrderBook || false;
export const isResizableGrid = ():boolean => PyhtonEx.config.isResizable || false;
export const isDraggableGrid = ():boolean => PyhtonEx.config.isDraggable || false;
export const languages = PyhtonEx.config.languages && PyhtonEx.config.languages.length > 0 ? PyhtonEx.config.languages : ['en'];
export const sessionCheckInterval = (): string => PyhtonEx.config.sessionCheckInterval || '15000';
export const balancesFetchInterval = (): string => PyhtonEx.config.balancesFetchInterval || '3000';
export const isFinexEnabled = (): boolean => PyhtonEx.config.finex || false;
export const passwordEntropyStep = ():number => PyhtonEx.config.passwordEntropyStep;
export const kycSteps = (): string[] => PyhtonEx.config.kycSteps || DEFAULT_KYC_STEPS;
