import { Client } from "../client/Client";
import { MessageEmbed } from "../structures/MessageEmbed";

export class ChannelManager {
  private client: Client;
  public id: string;
  public name: string;
  public type: number;
  public position: number;
  public topic: string;
  public nsfw: boolean;
  public rate_limit_per_user: number;
  public bitrate: number;
  public user_limit: number;

  public constructor(data, client: Client) {
    this.client = client;
    this._set(data);
  }

  private _set(data) {
    this.id = data;
  }

  public async get() {
    return await this.client.handler.fetch({
      endpoint: `channels/${this.id}`,
      method: "GET",
    });
  }

  public async update() {
    return await this.client.handler.fetch({
      endpoint: `channels/${this.id}`,
      method: "PATCH",
    });
  }

  public async delete(channelID: string) {
    return await this.client.handler.fetch({
      endpoint: `channels/${channelID}`,
      method: "DELETE",
    });
  }

  public async send(content: string | MessageEmbed): Promise<void> {
    if (typeof content === "string") {
      return await this.client.handler.fetch({
        endpoint: `channels/${this.id}/messages`,
        method: "POST",
        body: JSON.stringify({
          content: `${content}`,
          tts: false,
        }),
      });
    }

    if (content instanceof MessageEmbed) {
      return await this.client.handler.fetch({
        endpoint: `channels/${this.id}/messages`,
        method: "POST",
        body: JSON.stringify({
          tts: false,
          embed: content,
        }),
      });
    }
  }
}