import { EventEmitter } from "events";
import ws from "ws";
import chalk from "chalk";
import { RestHandler } from "./APIHandler";

interface ClientOptions {
    token: string,
    intents?: number,
    status?: "online" | "idle" | "dnd" | "invisible"
}

export default class Client extends EventEmitter {

    private socket: ws;

    /**
     * @param {ClientOptions} options passed into the client
     */

    public options: ClientOptions;

    /**
     * @param {string} the bots token
     */

    public token: string;

    public handler: RestHandler = new RestHandler(this);

    public constructor(options: ClientOptions) {
        super()
        this.options = options;
        this.token = options.token;
    }

    async login(): Promise<void> {

        this.socket = await new ws("wss://gateway.discord.gg/?v=8&encoding=json");

        this.socket.on("open", () => {
            this.identify();
        })

        this.socket.on("message", async (message) => {
            const payload = JSON.parse(message.toString());
            const { t, s, op, d } = payload; 
            if (payload.op === 10) {
                const { heartbeat_interval } = d;
                this.heartbeat(heartbeat_interval);
            } else if (payload.op === 11) {
                console.log(chalk.red("Recieved a heartbeat"))
            } else if (payload.op === 0) {
                this.emit(payload.t, payload.d);
            }
        })

        this.socket.on("error", (error: string) => {
            console.log(`${chalk.red("Error")}, ${chalk.red(error)}`)
        })

        this.socket.on("close", (error: any) => {
            if (error === 4004) throw new Error(`${chalk.red("Invalid token")}`)

            this.login()
        })
    }

    async createMessage(channelID: string, content: string) {

        const data = {
            "content": content,
            "tts": false
        };

        return await this.handler.fetch({
            endpoint: `channels/${channelID}/messages`,
            method: "POST",
            body: JSON.stringify(data)
        });
    }

    heartbeat(ms: number) {
        setInterval(() => {
            this.socket.send(JSON.stringify({op: 1, d: null}))
        }, ms)
    }

    destroy(reason?: string) {
        this.socket.close();
        console.log(`The socket was closed, ${reason || "No reason provided"}`)
        process.exit();
    }

    identify() {
        this.socket.send(JSON.stringify({
            op: 2,
            d:{
                token: this.options.token,
                intents: this.options.intents,
                properties: {
                    $os: 'linux',
                    $browser: 'gencord', 
                    $device: 'gencord'
                },
                presence: {
                    status: this.options.status
                }
            },
        }))
        console.log("Indentified")
    }
}