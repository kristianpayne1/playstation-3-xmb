export type XmbItem = {
    id: string;
    label: string;
    icon: string;
    description?: string;
};

export type XmbCategory = {
    id: string;
    label: string;
    icon: string;
    items: XmbItem[];
};

export const XMB_MENU: XmbCategory[] = [
    {
        id: "users",
        label: "Users",
        icon: "users.svg",
        items: [
            { id: "turn-off", label: "Turn Off System", icon: "power.svg" },
            {
                id: "create-user",
                label: "Create New User",
                icon: "create-user.svg",
            },
            { id: "user-1", label: "User 1", icon: "user.svg" },
        ],
    },
    {
        id: "settings",
        label: "Settings",
        icon: "settings.svg",
        items: [
            {
                id: "system-update",
                label: "System Update",
                icon: "system-update.svg",
                description: "Updates the PS3™ system software.",
            },
            {
                id: "bd-dvd-settings",
                label: "BD/DVD Settings",
                icon: "dvd-settings.svg",
                description: "Adjusts BD/DVD playback settings.",
            },
            {
                id: "music-settings",
                label: "Music Settings",
                icon: "music-settings.svg",
                description: "Adjusts music playback settings.",
            },
            {
                id: "chat-settings",
                label: "Chat Settings",
                icon: "chat-settings.svg",
                description: "Adjusts chat settings.",
            },
            {
                id: "system-settings",
                label: "System Settings",
                icon: "system-settings.svg",
                description: "Adjusts settings for this PS3™ system.",
            },
            {
                id: "date-time",
                label: "Date and Time Settings",
                icon: "date-time-settings.svg",
                description: "Adjusts date and time settings.",
            },
            {
                id: "power-save",
                label: "Power Save Settings",
                icon: "power-save-settings.svg",
                description: "Adjusts power save settings.",
            },
            {
                id: "accessory",
                label: "Accessory Settings",
                icon: "accessory-settings.svg",
                description: "Adjusts settings for accessories.",
            },
            {
                id: "display",
                label: "Display Settings",
                icon: "display-settings.svg",
                description: "Adjusts display settings.",
            },
            {
                id: "sound",
                label: "Sound Settings",
                icon: "sound-settings.svg",
                description: "Adjusts sound output settings.",
            },
            {
                id: "security",
                label: "Security Settings",
                icon: "security-settings.svg",
                description: "Adjusts security settings.",
            },
            {
                id: "network",
                label: "Network Settings",
                icon: "network-settings.svg",
                description: "Adjusts network connection settings.",
            },
        ],
    },
    {
        id: "photo",
        label: "Photo",
        icon: "photo.svg",
        items: [
            {
                id: "search-media-photo",
                label: "Search for Media Servers",
                icon: "search-media-servers.svg",
            },
            {
                id: "playlists-photo",
                label: "Playlists",
                icon: "playlist.svg",
            },
        ],
    },
    {
        id: "music",
        label: "Music",
        icon: "music.svg",
        items: [
            {
                id: "search-media-music",
                label: "Search for Media Servers",
                icon: "search-media-servers.svg",
            },
            {
                id: "playlists-music",
                label: "Playlists",
                icon: "playlist.svg",
            },
        ],
    },
    {
        id: "video",
        label: "Video",
        icon: "video.svg",
        items: [
            {
                id: "search-media-video",
                label: "Search for Media Servers",
                icon: "search-media-servers.svg",
            },
            {
                id: "playlists-video",
                label: "Playlists",
                icon: "playlist.svg",
            },
        ],
    },
    {
        id: "game",
        label: "Game",
        icon: "controller.svg",
        items: [
            {
                id: "game-data",
                label: "Game Data Utility",
                icon: "game-data.svg",
            },
            {
                id: "memory-card",
                label: "Memory Card Utility",
                icon: "memory-card-utility.svg",
            },
            {
                id: "saved-data",
                label: "Saved Data Utility",
                icon: "saved-data-utility.svg",
            },
            {
                id: "trophy",
                label: "Trophy Collection",
                icon: "trophy.svg",
            },
        ],
    },
    {
        id: "network",
        label: "Network",
        icon: "network.svg",
        items: [
            {
                id: "online-manuals",
                label: "Online Instruction Manuals",
                icon: "online-instruction-manuals.svg",
            },
            {
                id: "remote-play",
                label: "Remote Play",
                icon: "remote-play.svg",
            },
            {
                id: "internet-browser",
                label: "Internet Browser",
                icon: "internet-browser.svg",
            },
            {
                id: "download",
                label: "Download Management",
                icon: "download-management.svg",
            },
        ],
    },
    {
        id: "friends",
        label: "Friends",
        icon: "friends.svg",
        items: [
            {
                id: "block-list",
                label: "Block List",
                icon: "block-list.svg",
            },
            {
                id: "add-friend",
                label: "Add a Friend",
                icon: "add-a-friend.svg",
            },
            {
                id: "players-met",
                label: "Players Met",
                icon: "players-met.svg",
            },
            {
                id: "video-chat",
                label: "Voice/Video Chat Room",
                icon: "video-chat-room.svg",
            },
            {
                id: "messages",
                label: "Message Box",
                icon: "message-box.svg",
            },
        ],
    },
];
