/** Static data files (ChatGPT-replaceable), validated once at startup. */
import economyJson from '../../design/economy.json';
import animationsJson from '../../design/animations.json';
import shopJson from '../../world/shop.json';
import districtsJson from '../../world/districts.json';
import spiritsJson from '../../world/spirits.json';
import bossesJson from '../../world/bosses.json';
import avatarJson from '../../world/avatar.json';
import starterJson from '../../content/packs/kotodama-starter.json';
import momentsJson from '../../design/moments.json';
import { MomentsSchema } from '../schema/moments';
import kotoJson from '../../world/koto.json';
import { KotoSchema } from '../schema/koto';
import { EconomySchema } from '../schema/economy';
import { AnimationsSchema } from '../schema/theme';
import {
  AvatarSchema,
  BossesSchema,
  DistrictsSchema,
  ShopSchema,
  SpiritsSchema,
} from '../schema/world';
import { LessonPackSchema } from '../schema/pack';

export const economy = EconomySchema.parse(economyJson);
export const animations = AnimationsSchema.parse(animationsJson);
export const shop = ShopSchema.parse(shopJson);
export const districts = DistrictsSchema.parse(districtsJson).districts;
export const spirits = SpiritsSchema.parse(spiritsJson).species;
export const bosses = BossesSchema.parse(bossesJson).bosses;
export const avatarParts = AvatarSchema.parse(avatarJson).parts;
export const starterPack = LessonPackSchema.parse(starterJson);
export const momentsConfig = MomentsSchema.parse(momentsJson);
export const koto = KotoSchema.parse(kotoJson);
