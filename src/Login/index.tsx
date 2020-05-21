import * as React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useSession, useSetSession } from '../session';

export default function LoginScreen() {
  const location = useLocation<{ from?: Location }>();
  const from = location.state?.from?.pathname || '/menu';
  const { register, handleSubmit, errors } = useForm();
  const user = useSession();
  const setUser = useSetSession();
  const onSubmit = ({ name }: Record<string, any>) => {
    const displayName = name as string || null;
    user
      .updateProfile({ displayName })
      .then(() => {
        setUser({ ...user, displayName })
      });
  };
  if (user.displayName) return <Redirect to={from} />;
  return (
    <div>
      <div>Login Screen</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Display Name
            <input
              ref={register({
                required: true,
                minLength: 3,
                maxLength: 20
              })}
              type="text"
              name="name"
              defaultValue={user.displayName || ''}
            />
            {errors.name?.type === 'required' &&
              'A display name is required to play'}
            {(errors.name?.type === 'minLength' || errors.name?.type === 'maxLength') &&
              'Must be between 3 and 10 characters in length'}
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
