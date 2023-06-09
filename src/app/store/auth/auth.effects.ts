import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFormPayload } from '@auth/models/auth-form-payload.model';
import { AuthService } from '@auth/services/auth.service';
import { ToastStatus } from '@common/enums/toast-status.enum';
import { User } from '@common/models/user.model';
import { DbService } from '@common/services/db.service';
import { ToastService } from '@common/services/toast.service';
import { setUser } from '@common/utils/set-user';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from '@store/auth';
import { ActionTypes } from '@store/auth/action-types';
import { CashFlowActions } from '@store/cash-flow';
import firebase from 'firebase/compat';
import { catchError, exhaustMap, from, map, of, switchMap, take, tap } from 'rxjs';

@Injectable()
export class AuthEffects {
  private readonly actions$: Actions = inject(Actions);
  private readonly toastService: ToastService = inject(ToastService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);
  private readonly dbService: DbService = inject(DbService);

  public signInWithGoogle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.signInWithGoogle),
      exhaustMap(() => {
        return from(this.authService.signinWithGoogle()).pipe(
          map(({ user }: firebase.auth.UserCredential) => {
            if (user !== null) {
              this.dbService.addUserToDatabase$(setUser(user)).subscribe();
              return AuthActions.userAuthenticated({ user: setUser(user) });
            }

            return AuthActions.userNotAuthenticated();
          }),
          tap((): void => {
            this.router.navigateByUrl('/dashboard');
          }),

          catchError((e) => {
            this.toastService.showMessage(
              ToastStatus.ERROR,
              'Error!',
              'Something went wrong during google authorisation'
            );

            console.error(e);
            return of(AuthActions.userNotAuthenticated());
          })
        );
      })
    );
  });

  public signOut$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.signOut),
      exhaustMap((): Promise<void> => this.authService.signOut()),
      map(() => AuthActions.userNotAuthenticated()),
      tap((): void => {
        this.router.navigateByUrl('/authentication');
        this.toastService.showMessage(ToastStatus.INFO, 'Success!', 'You were successfully logged out');
      })
    );
  });

  public signInWithEmailAndPassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.signInWithEmailAndPassword),
      exhaustMap(({ payload }) => {
        return from(this.authService.signInWithEmailAndPassword(payload as AuthFormPayload)).pipe(
          map(() => {
            return AuthActions.signInWithEmailAndPasswordSuccess();
          }),
          tap((): void => {
            this.router.navigateByUrl('/dashboard');
          }),

          catchError(() => {
            this.toastService.showMessage(
              ToastStatus.ERROR,
              'Error!',
              'Something went wrong during google authorization'
            );

            return of(AuthActions.signInWithEmailAndPasswordFailure());
          })
        );
      })
    );
  });

  public signUpWithEmailAndPassword$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ActionTypes.SIGN_UP_WITH_EMAIL_AND_PASSWORD),
        exhaustMap(({ payload }) => {
          return from(this.authService.signUpWithEmailAndPassword(payload)).pipe(
            map(({ user }) => {
              this.dbService.addUserToDatabase$(setUser(user!)).subscribe();
              return AuthActions.signUpWithEmailAndPasswordSuccess();
            }),
            tap((): void => {
              this.router.navigateByUrl('/dashboard');
            }),

            catchError((err) => {
              this.toastService.showMessage(ToastStatus.ERROR, 'Error!', 'Something went wrong during authorization');

              console.error(err);
              return of(AuthActions.signUpWithEmailAndPasswordFailure());
            })
          );
        })
      );
    },
    { dispatch: false }
  );

  public loadUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loadUserData),
      exhaustMap(() => this.authService.authState$),
      switchMap((user: firebase.User | null) => {
        return this.authService.loadUserData$(user).pipe(
          map((user: User | undefined) => {
            if (user) return AuthActions.userAuthenticated({ user });

            return AuthActions.userNotAuthenticated();
          })
        );
      })
    );
  });

  public loadUserData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.userAuthenticated),
      switchMap(({ user }) => {
        if (!user) return of(AuthActions.userNotAuthenticated());

        return of(CashFlowActions.getCashFlowUserData({ uid: user.uid })).pipe(take(1));
      })
    );
  });

  public updateAccount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.updateAccount),
      exhaustMap(({ updatedUserData }) => {
        return from(this.dbService.updateUser$(updatedUserData)).pipe(
          map(() => {
            this.toastService.showMessage(ToastStatus.SUCCESS, 'Success!', 'Account data successfully updated');

            return AuthActions.updateAccountSuccess();
          }),

          catchError((err) => {
            this.toastService.showMessage(
              ToastStatus.ERROR,
              'Error!',
              'Something went wrong during updated account data'
            );

            console.error(err);
            return of(AuthActions.updateAccountFailure());
          })
        );
      })
    );
  });
}
