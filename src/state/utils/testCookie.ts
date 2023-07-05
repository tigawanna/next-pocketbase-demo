import PocketBase from 'pocketbase'
import { pb_url } from '../consts'
export function testPocketbaseCookie(cookie: string) {
    const pb = new PocketBase(pb_url)
    // load the auth store data from the request cookie string
    pb.authStore.loadFromCookie(cookie)
    // console.log("pb_auth model after cookie load === ", pb.authStore.model)
    // console.log("pb_auth is valid after cookie load === ", pb.authStore.isValid)
    if(pb.authStore.isValid){
     return pb.authStore.model?.email
    }
    return "pb_auth is invalid"
}
