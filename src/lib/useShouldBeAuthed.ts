import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useWoofinderStore } from './store';

export const useShouldBeAuthed = (shouldBeAuthed: boolean) => {
  const navigate = useNavigate();
  const user = useWoofinderStore((state) => state.user);

  useEffect(() => {
    if (user && !shouldBeAuthed) {
      navigate('/search', { replace: true });
    }

    if (!user && shouldBeAuthed) {
      navigate('/', { replace: true });
    }
  }, [user, navigate, shouldBeAuthed]);
};
