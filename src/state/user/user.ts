import { pb_user_collection } from "../consts";
import { PB, pb } from "../pb/client_config";
import { PBUserRecord, TUserSignUpFormFields } from "./types";

export async function getUser(pb:PB) {
    try {
        pb.authStore.loadFromCookie(document?.cookie ?? "");
        return pb.authStore.model;
    } catch (error) {
        throw error;
    }
}


interface ILoginUser {
    pb:PB;
    user: string;
    password: string;
}

export async function loginUser({ pb,user, password }: ILoginUser) {
    try {
        const authData = await pb.collection(pb_user_collection)
            .authWithPassword<PBUserRecord>(user, password);
        // update the cookie with the pb_auth data
        // document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
        return authData;
    } catch (error) {
        throw error;
    }
}

export interface ISignupuser {
    pb:PB;
    user: TUserSignUpFormFields;
}

export async function createUser({ pb,user }: ISignupuser) {
    try {
        await pb.collection(pb_user_collection).create(user);
        const logged_in_user = await loginUser({
            pb,user: user.email, password: user.password,
        });
        return logged_in_user;
    } catch (error) {
        throw error;
    }
}

export function logoutUser() {
    try {
        pb.authStore.clear();
        document.cookie=pb.authStore.exportToCookie({ httpOnly: false });
        
    } catch (error) {
        throw error;
    }
}




