import PocketBase, { FileQueryParams, Record } from "pocketbase";
import { pb_url} from "../consts";

export const pb = new PocketBase(pb_url);
export type PB = typeof pb;


export function getPBImageUrl(
  record: Pick<Record, "id" | "collectionId" | "collectionName">,
  filename: string,
  queryParams?: FileQueryParams | undefined
) {
  return pb.files.getUrl(record, filename, queryParams);
}

export const makeImageUrl = (
  coll_name: string,
  record_id: string,
  media_name: string
) => {
  if (media_name) {
    return `${pb_url}/api/files/${coll_name}/${record_id}/${media_name}`;
  }
  return;
};
