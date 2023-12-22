// Updates the list of currently live games
import JSONbig from 'json-bigint';
import axios from 'axios';
import redis from '../store/redis';
import db from '../store/db';
import config from '../config';
import { invokeIntervalAsync } from '../util/utility';

async function doLiveGames() {
  // Get the list of pro players
  const proPlayers: ProPlayer[] = await db.select().from('notable_players');
  // Get the list of live games
  const apiKeys = config.STEAM_API_KEY.split(',');
  const liveGamesUrl = `https://api.steampowered.com/IDOTA2Match_570/GetTopLiveGame/v1/?key=${apiKeys[0]}&partner=0`;
  const resp = await axios.get<string>(liveGamesUrl, { responseType: 'text' });
  const body = resp.data;
  const json = JSONbig.parse(body);
  // If a match contains a pro player
  // add their name to the match object, save it to redis zset, keyed by server_steam_id
  for (let i = 0; i < json.game_list.length; i++) {
    const match: LiveMatch = json.game_list[i];
    // let addToRedis = false;
    if (match && match.players) {
      match.players.forEach((player, i) => {
        const proPlayer = proPlayers.find(
          (proPlayer) =>
            proPlayer.account_id.toString() === player.account_id?.toString(),
        );
        if (proPlayer) {
          match.players[i] = { ...player, ...proPlayer };
          // addToRedis = true;
        }
      });
      // convert the BigInt to a string
      match.lobby_id = match.lobby_id.toString();
      await redis.zadd('liveGames', match.lobby_id, match.lobby_id);
      await redis.setex(
        `liveGame:${match.lobby_id}`,
        28800,
        JSON.stringify(match),
      );
      // Keep only the 100 highest values
      await redis.zremrangebyrank('liveGames', '0', '-101');
    }
    // Get detailed stats for each live game
    // const { url } = utility.generateJob('api_realtime_stats', {
    //   server_steam_id: match.server_steam_id
    // }).url;
  }
}
invokeIntervalAsync(doLiveGames, 60 * 1000);
