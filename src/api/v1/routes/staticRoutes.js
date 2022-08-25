import { readUserIds } from "../services/userService";
import { readConversationIds } from "../services/conversationService";

const routes = [
  "/",
  "/home",
  "/home/about",
  "/home/media",
  "/home/posts",
  "/people",
  "/conversations",
  "/latest",
];

readUserIds().forEach((userId) => {
  routes.push(`/people/${userId}`);
  routes.push(`/people/${userId}/about`);
  routes.push(`/people/${userId}/media`);
  routes.push(`/people/${userId}/posts`);
});
readConversationIds().forEach((conversationId) => routes.push(`/conversations/${conversationId}`));

console.log(routes);

export default routes;
