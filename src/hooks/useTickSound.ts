import { useCallback, useEffect, useRef } from "react";

export default function useTickSound(url: string) {
    const ctxRef = useRef<AudioContext | null>(null);
    const bufferRef = useRef<AudioBuffer | null>(null);

    useEffect(() => {
        const ctx = new AudioContext({ latencyHint: "interactive" });
        ctxRef.current = ctx;
        ctx.resume().catch(() => {});
        const warm = ctx.createBufferSource();
        warm.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
        warm.connect(ctx.destination);
        warm.start(0);
        fetch(url)
            .then((r) => r.arrayBuffer())
            .then((buf) => ctx.decodeAudioData(buf))
            .then((audioBuffer) => {
                bufferRef.current = audioBuffer;
            })
            .catch((err) => console.error("tick load failed:", err));
        return () => {
            ctx.close().catch(() => {});
        };
    }, [url]);

    return useCallback(() => {
        const ctx = ctxRef.current;
        const buffer = bufferRef.current;
        if (!ctx || !buffer) return;
        if (ctx.state === "suspended") ctx.resume().catch(() => {});
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
    }, []);
}
