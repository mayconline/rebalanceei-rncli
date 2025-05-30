import { useContext } from 'react';
import { RoleUserContext } from '../contexts/RoleUserProvider';

const useRoleUser = () => {
  const context = useContext(RoleUserContext);
  return context;
};

export default useRoleUser;
