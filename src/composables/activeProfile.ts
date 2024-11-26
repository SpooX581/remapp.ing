import { GAME_MODE, type GameMode } from '@/lib/modes';
import { ref } from 'vue';

// todo: change this to user specified fav/default
const activeProfile = ref<GameMode>(GAME_MODE.MELEE);

export default function useActiveProfile() {
  return activeProfile;
}
