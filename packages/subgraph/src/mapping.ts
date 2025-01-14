import { BigInt, Bytes, crypto, ipfs, json, JSONValue, log } from "@graphprotocol/graph-ts"
import { Poster, NewPost } from "../generated/Poster/Poster"
import { Article } from "../generated/schema"
import { ACTION__ARTICLE, ACTION__PUBLICATION, getActionType, hasPermission } from "./utils"
import { handleArticleAction } from "./article.mapping"
import { handlePublicationAction } from "./publication.mapping"

// keccak256 hash of "PUBLICATION"
const PUBLICATION_TAG = "0x1d2f2ddf66fd037a52a179e4e4fca655871584011016b01fc2dfc39cc1e2bb62"

export function handleNewPost(event: NewPost): void {
  if (event.params.tag.toHex() != PUBLICATION_TAG) {
    // event is not related to publications
    log.info("This event is not related to publications (the tag does not match).", [
      event.params.tag.toHex(),
      PUBLICATION_TAG,
    ])
    return
  }
  const contentData = json.try_fromString(event.params.content)
  if (contentData.isError) {
    // decode json content, fail gracefully.
    log.warning("Failed to decode the JSON content", [contentData.value.toString()])
    return
  }
  const actionType = getActionType(contentData.value)
  const contentDataObject = contentData.value.toObject()

  // authentication
  if (!hasPermission(actionType, contentDataObject, event)) {
    // return if the action is not allowed
    log.warning("The user does not have permission for this action.", [
      actionType[0].toString(),
      actionType[1].toString(),
    ])
    return
  }

  if (actionType[0] == ACTION__ARTICLE) {
    handleArticleAction(actionType[1], contentDataObject, event)
  } else if (actionType[0] == ACTION__PUBLICATION) {
    handlePublicationAction(actionType[1], contentDataObject, event)
  }
}
