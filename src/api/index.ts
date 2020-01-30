import axios, { AxiosResponse } from 'axios';
import { JsonBody, makeRequest, RequestOptions } from './requestBuilder';

// import { nodelogicUrl } from './config';

export * from './types';
export * from './config';
export { RequestOptions } from './requestBuilder';

export type RequestBody = JsonBody | FormData;

export type RequestMethod = (config: RequestOptions) => (url: string, body?: RequestBody) => Promise<AxiosResponse['data']>;

export interface ApiWrapper {
    get: RequestMethod;
    post: RequestMethod;
    patch: RequestMethod;
    put: RequestMethod;
    delete: RequestMethod;
}

export const API: ApiWrapper = {
    get: (config: RequestOptions) => async (url: string) =>
        makeRequest(
            {
                method: 'get',
                url,
            },
            config,
        ),

    post: (config: RequestOptions) => async (url: string, body?: JsonBody) =>
        makeRequest(
            {
                method: 'post',
                body,
                url,
            },
            config,
        ),

    patch: (config: RequestOptions) => async (url: string, body?: JsonBody) =>
        makeRequest(
            {
                method: 'patch',
                body,
                url,
            },
            config,
        ),

    put: (config: RequestOptions) => async (url: string, body?: JsonBody) =>
        makeRequest(
            {
                method: 'put',
                body,
                url,
            },
            config,
        ),

    delete: (config: RequestOptions) => async (url: string) =>
        makeRequest(
            {
                method: 'delete',
                url,
            },
            config,
        ),
};

const conf: RequestOptions = {
    apiVersion: 'barong',
};
export const changePassword = async body => API.post(conf)('/identity/users/password/confirm_code', body);


const baseURL = window.document.location.origin.includes('localhost') ? 'http://localhost:9002' : window.document.location.origin;

const refUrl = `${baseURL}/api/v1/referral-code`;

export const checkReferralCode = async body => {
    const res = await axios.post(refUrl, body);
    return res;
};

const nodelogicUrl = `${baseURL}/api/v2/nodelogic`;
export const getReferralTickets = async body => {
    const res = await axios.get(`${nodelogicUrl }${body}`);
    return  res.data;
};

export const getOverall = async () => {
    const res = await axios.get(`${nodelogicUrl}/tickets/all`);
    return res.data;
};

export const getBonusTickets = async () => {
    const res = await axios.get(`${nodelogicUrl}/tickets/bonus`);
    return res.data;
};

export const getActiveTicketsList = async () => {
    const res = await axios.get(`${nodelogicUrl}/tickets/active`);
    return res.data;
};

const paytoolsAPI = `${baseURL}/api/v2/paytools_api/private/initPayin`;

export const initPayin = async body => {
    const res = await axios.post(paytoolsAPI, body);
    return res.data;
};
export const getBalance = async () => {
    const res = await axios.get(`${nodelogicUrl}/getBalance`);
    return res.data;
};
