export const XMB_LAYOUTS = {
    desktop: {
        categorySpacing: 160,
        itemSpacing: 56,
        itemOffsetY: 100,
    },
    mobile: {
        categorySpacing: 86,
        itemSpacing: 46,
        itemOffsetY: 70,
    },
} as const;

export type XmbLayout = (typeof XMB_LAYOUTS)[keyof typeof XMB_LAYOUTS];
