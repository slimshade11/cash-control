import { User } from '@common/models/user.model';
import { createReducer, on } from '@ngrx/store';
import { AuthActions } from '@store/auth';

export const FeatureKey = 'auth';

export interface State {
  user: User;
}

const initialState: State = {
  user: {
    displayName: '',
    email: '',
    emailVerified: false,
    phoneNumber: null,
    photoURL: '',
    refreshToken: '',
    uid: '',
  },
};

export const Reducer = createReducer(
  initialState,

  // user authenticated
  on(AuthActions.userAuthenticated, (state, { user }): State => {
    return { ...state, user };
  }),
  on(AuthActions.userNotAuthenticated, (): State => {
    return {
      user: {
        displayName: '',
        email: '',
        emailVerified: false,
        phoneNumber: null,
        photoURL: '',
        refreshToken: '',
        uid: '',
      },
    };
  })
);
