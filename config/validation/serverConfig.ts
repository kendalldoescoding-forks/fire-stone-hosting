import * as yup from "yup";

// The following validation shema is based from: https://minecraft.fandom.com/wiki/Server.properties

export const severConfigObject = yup.object().shape({
  "allow-flight": yup.boolean(),
  "allow-nether": yup.boolean(),
  "broadcast-console-to-ops": yup.boolean(),
  "broadcast-rcon-to-ops": yup.boolean(),
  difficulty: yup.string().oneOf(["peaceful", "easy", "normal", "hard"]),
  "enable-command-block": yup.boolean(),
  "enable-jmx-monitoring": yup.boolean(),
  "enable-rcon": yup.boolean(),
  "sync-chunk-writes": yup.boolean(),
  "enable-status": yup.boolean(),
  "enable-query": yup.boolean(),
  "entity-broadcast-range-percentage": yup.number().integer().min(1).max(1000),
  "force-gamemode": yup.boolean(),
  "function-permission-level": yup.number().integer().min(1).max(4),
  gamemode: yup
    .string()
    .oneOf(["survival", "creative", "adventure", "spectator"]),
  "generate-structures": yup.boolean(),
  "generator-settings": yup.string(),
  hardcore: yup.boolean(),
  "level-name": yup.string(),
  "level-seed": yup.string(),
  "level-type": yup.string().oneOf(["DEFAULT", "FLAT", "LEGACY"]),
  // The max player amount is 2^31
  "max-players": yup.number().integer().min(0).max(50),
  // The max tick time is 2^63
  "max-tick-time": yup.number().integer().positive(),
  "max-world-size": yup.number().integer().min(1).max(29999984),
  motd: yup.string(),
  "network-compression-threshold": yup.number().integer(),
  "online-mode": yup.boolean(),
  "op-permission-level": yup.number().integer().min(0).max(4),
  "player-idle-timeout": yup.number().integer(),
  "prevent-proxy-connections": yup.boolean(),
  pvp: yup.boolean(),
  "query.port": yup.number().integer(),
  "rate-limit": yup.number().integer(),
  "rcon.password": yup.string(),
  "rcon.port": yup.number().integer(),
  "resource-pack": yup.string(),
  "resource-pack-prompt": yup.string(),
  "resource-pack-sha1": yup.string(),
  "require-resource-pack": yup.boolean(),
  "snooper-enabled": yup.boolean(),
  "spawn-animals": yup.boolean(),
  "spawn-monsters": yup.boolean(),
  "spawn-npcs": yup.boolean(),
  "spawn-protection": yup.number().integer(),
  "use-native-transport	": yup.boolean(),
  "view-distance": yup.number().integer().min(3).max(32),
  "white-list": yup.boolean(),
  "enforce-whitelist": yup.boolean(),
});