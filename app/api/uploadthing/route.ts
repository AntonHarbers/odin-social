import { createRouteHandler } from 'uploadthing/next';
import { ourFileRouter } from '../../../lib/uploadThing/core';

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
