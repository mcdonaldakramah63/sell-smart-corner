
import { AuthState } from '@/types/auth';
import { useLogin } from './useLogin';
import { useRegister } from './useRegister';
import { useLogout } from './useLogout';
import { useSocialAuth } from './useSocialAuth';
import { useProfileUpdate } from './useProfileUpdate';

export const useAuthOperations = (
  authState: AuthState,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const { login } = useLogin(authState, setAuthState);
  const { register } = useRegister(authState, setAuthState);
  const { logout } = useLogout(setAuthState);
  const { loginWithGoogle, loginWithGithub } = useSocialAuth(setAuthState);
  const { updateProfile } = useProfileUpdate(authState, setAuthState);

  return {
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithGithub,
    updateProfile
  };
};
