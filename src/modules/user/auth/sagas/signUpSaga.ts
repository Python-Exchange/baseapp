// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { signUpError, SignUpFetch, signUpRequireVerification } from '../actions';

const signUpConfig: RequestOptions = {
    apiVersion: 'barong',
};

export function* signUpSaga(action: SignUpFetch) {
    try {
        yield call(API.post(signUpConfig), '/identity/users', action.payload);
        yield put(signUpRequireVerification({ requireVerification: true }));
    } catch (error) {
        yield put(signUpError(error));
        yield put(sendError(error, 'alert'));
    }
}
