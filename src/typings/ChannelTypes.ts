import { UserTypes } from "./UserTypes";

export interface Overwrites {
  id: string;
  type: number;
  allow: string;
  deny: string;
}

export interface ChannelTypes {
  id: string;
  type: number;
  guild_id?: string;
  position?: number;
  permission_overwrites?: Overwrites[];
  name?: string;
  topic?: string;
  nsfw?: boolean;
  last_message_id?: string;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  recipients: UserTypes[];
  icon?: string;
  owner_id?: string;
  application_id?: string;
  parent_id?: string;
  last_pin_timestamp?: Date;
}
