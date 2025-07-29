export type userType = {
    _id: string;
    email: string;
    fullName: string;
    profilePic: string;
    bio: string;
}

export type assetsType = {
    avatar_icon: string;
    gallery_icon: string;
    help_icon: string;
    logo_big: string;
    logo_icon: string;
    logo: string;
    search_icon: string;
    send_button: string;
    menu_icon: string;
    arrow_icon: string;
    code: string;
    bgImage: string;
    profile_martin: string;
}


export type messageType = ({
    _id: string;
    senderId: string;
    receiverId: string;
    text: string;
    seen: boolean;
    createdAt: string;
    image?: undefined;
} | {
    _id: string;
    senderId: string;
    receiverId: string;
    image: string;
    seen: boolean;
    createdAt: string;
    text?: undefined;
})
