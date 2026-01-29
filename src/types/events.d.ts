import type { GameScoreManager } from '@/scripts/classes/DialogManager/GameScoreManager';
import type { Game } from '@/scripts/classes/Game/Game.js';
import type { GameRound } from '@/scripts/classes/GameRound/GameRound.js';
import type { GeoMap } from '@/scripts/classes/GeoMap/GeoMap';
import type { GuessManager } from '@/scripts/classes/GuessManager/GuessManager.js';
import type { LayerManager } from '@/scripts/classes/LayerManager/LayerManager';

export interface EventRegistry {
  'dialog:next-round': GameScoreManager;
  'round:started': GameRound;
  'round:ended': GameRound;
  'guess:submitted': GuessManager;
  'game:ended': Game;
  'ui:game-restart': undefined;
  'map:loaded': GeoMap;
  'map:moved-pointer': GeoMap;
  'layer:update': LayerManager;
}
