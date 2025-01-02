import { PassThrough } from 'stream';
import { createHash } from 'crypto';

interface ModelType {
    model: string;
}

export class EventStream {
    private static instance: EventStream;
    protected readonly pt: PassThrough = new PassThrough();
    protected model: ModelType;

    private constructor() {
        this.pt.setEncoding('utf-8');
    }

    public static getInstance(): EventStream {
        if (!EventStream.instance) {
            EventStream.instance = new EventStream();
        }
        return EventStream.instance;
    }

    setModel(model: ModelType) {
        this.model = model;
    }

    public write<T extends string>(event: T, data: any) {
        if (this.pt.writableEnded) {
            return;
        }
        this.pt.write(`event: ${event}\n`, 'utf-8');
        this.pt.write(`data: ${JSON.stringify(data)}\n\n`, 'utf-8');
    }

    stream() {
        return this.pt;
    }

    end(cb?: () => void) {
        this.pt.end(cb);
    }
}

export const eventStream = EventStream.getInstance();

class Utils {
    public hash(json_data: { t: number; m: string }): string {
        const secretKey: number[] = [
            79, 86, 98, 105, 91, 84, 80, 78, 123, 83, 35, 41, 99, 123, 51, 54, 37, 57,
            63, 103, 59, 117, 115, 108, 41, 67, 76,
        ];

        const base_string: string = `${json_data['t']}:${json_data['m']}:'WI,2rU#_r:r~aF4aJ36[.Z(/8Rv93Rf':${json_data['m'].length}`;

        return createHash('sha256').update(base_string).digest('hex');
    }

    public format_timestamp(timestamp: number): string {
        const e = timestamp;
        const n = e % 10;
        const r = n % 2 === 0 ? n + 1 : n;
        return String(e - n + r);
    }
}

export const UtilsInstance = new Utils();