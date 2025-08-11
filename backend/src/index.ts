import { Hono } from 'hono'
import { CustomEnv } from './types/types';
import allRoutes from './routes/allRoutes';

const app = new Hono<CustomEnv>({
  strict: true
}).basePath("/api/v1");

app.route("", allRoutes);

app.onError(async (error, c) => {

  return c.json({
    msg: "Internal server error",
  })
})

export default app
