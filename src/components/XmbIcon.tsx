type XmbIconProps = {
    icon: string;
    className?: string;
    active?: boolean;
};

export default function XmbIcon({
    icon,
    className,
    active = false,
}: XmbIconProps) {
    const url = `${import.meta.env.BASE_URL}icons/${icon}`;
    return (
        <span
            aria-hidden
            className={`block shrink-0 transition-[opacity,filter] duration-200 ease-out ${className ?? ""}`}
            style={{
                background: active
                    ? "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(235,240,250,0.9) 55%, rgba(255,255,255,1) 100%)"
                    : "linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, rgba(190,195,210,0.55) 55%, rgba(245,245,255,0.8) 100%)",
                opacity: active ? 1 : 0.55,
                WebkitMaskImage: `url("${url}")`,
                maskImage: `url("${url}")`,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                filter: active
                    ? "drop-shadow(0 0 6px rgba(255,255,255,0.55)) drop-shadow(0 2px 3px rgba(0,0,0,0.5))"
                    : "drop-shadow(0 2px 3px rgba(0,0,0,0.45))",
            }}
        />
    );
}
