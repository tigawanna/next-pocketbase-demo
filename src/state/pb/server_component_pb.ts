import { cookies, headers } from 'next/headers';
import PocketBase from 'pocketbase'
import { pb_url, pb_user_collection } from '../consts';

export async function server_component_pb() {
    // const cookie = req.cookies.get('pb_auth')?.value;
    const cookie = await cookies().get('pb_auth')?.value
    // const response = NextResponse.next();
    const pb = new PocketBase(pb_url)
    // load the auth store data from the request cookie string
    pb.authStore.loadFromCookie(cookie || '');
    // send back the default 'pb_auth' cookie to the client with the latest store state
    pb.authStore.onChange(() => {
        headers().set('set-cookie', pb.authStore.exportToCookie());
    });
    try {
        // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
        console.log("pb.authStore.isValid", pb.authStore.isValid);
        pb.authStore.isValid && await pb.collection(pb_user_collection).authRefresh();
    } catch (_) {
        // clear the auth store on failed refresh
        pb.authStore.clear();
    }

    return {pb,cookies,headers}
}
