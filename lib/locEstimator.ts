type Tstats = {
    total: number;
    code: number;
    singleCmts: number;
    multiCmts: number;
    empty: number;
};

export class LocEstimator {
    reader;
    commentChars;

    constructor(fileStream: ReadableStream<Uint8Array>, filename: string) {
        this.reader = fileStream.pipeThrough(new TextDecoderStream()).getReader();
        // this.reader = fileStream.getReader();
        if (!filename) throw new Error("filename is empty");
        let fileExtension = filename.split(".").pop() as string;
        let cc = this.getSingleCommentChars(fileExtension);
        if (!cc) throw new Error("language not supported");
        this.commentChars = cc;
    }

    async getEstimate() {
        var res: Tstats = {
            total: 0,
            code: 0,
            singleCmts: 0,
            multiCmts: 0,
            empty: 0,
        };
        var remaining: boolean | string = false;
        while (true) {
            const { done, value } = await this.reader.read();
            if (done) {
                break;
            }
            let lines = value.split("\n");
            if (remaining !== false) lines[0] = remaining + lines[0];
            remaining = lines[lines.length - 1].endsWith("\n") ? false : lines.pop() ?? "";

            for (let line of lines) {
                this.consumeLineAndUpdateStats(line, res);
            }

            res.total += lines.length;
        }
        if (remaining !== false) {
            this.consumeLineAndUpdateStats(remaining, res);
            res.total++;
        }
        return res;
    }

    getSingleCommentChars(fileExtension: string) {
        switch (fileExtension) {
            case "js":
            case "ts":
            case "tsx":
                return "//";
            case "py":
                return "#";
            default:
                return false;
        }
    }

    consumeLineAndUpdateStats(line: string, stats: Tstats) {
        line = line.trim();
        if (line.length == 0) {
            stats.empty++;
            return;
        }

        if (line.startsWith(this.commentChars)) {
            stats.singleCmts++;
            return;
        }
        stats.code++;
    }
}
