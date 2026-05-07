type XmbAnalogClockProps = {
    time: Date;
    className?: string;
};

export default function XmbAnalogClock({
    time,
    className,
}: XmbAnalogClockProps) {
    const minutes = time.getMinutes();
    const hours = time.getHours() % 12;
    const minuteAngle = minutes * 6;
    const hourAngle = hours * 30 + (minutes / 60) * 30;

    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            aria-hidden
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
        >
            <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
            <line
                x1="12"
                y1="12"
                x2="12"
                y2="7"
                strokeWidth="1.75"
                transform={`rotate(${hourAngle} 12 12)`}
            />
            <line
                x1="12"
                y1="12"
                x2="12"
                y2="5"
                strokeWidth="1.25"
                transform={`rotate(${minuteAngle} 12 12)`}
            />
        </svg>
    );
}
