import { Redirect } from 'expo-router';

import { useGame } from '@/state/store';

export default function Index() {
  const { state } = useGame();
  return <Redirect href={state.username ? '/map' : '/welcome'} />;
}
