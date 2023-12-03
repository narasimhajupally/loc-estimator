import { LocEstimator } from "@/lib/locEstimator";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const filename = request.headers.get("Content-Filename");
    if (!request.body || !filename) return NextResponse.json({});
    try {
        const locEstimator = new LocEstimator(request.body, filename);

        const res = await locEstimator.getEstimate();

        return NextResponse.json({
            blank: res.empty,
            comments: res.singleCmts + res.multiCmts,
            code: res.code,
            total: res.total,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
