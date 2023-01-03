"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var {
  API_CRYPTO_MODE = '',
  API_CRYPTO_KMS_TYPE = '',
  API_CRYPTO_KMS_MASTER_KEY_HEX = '',
  API_CRYPTO_KMS_MASTER_IV_HEX = '',
  API_CRYPTO_KMS_AWS_KEY_ID = '',
  API_CRYPTO_KMS_AWS_REGION = 'ap-south-1',
  API_CRYPTO_DEDICATED_REDIS = 'false',
  API_CRYPTO_REDIS_AUTH_ENABLED = 'false',
  API_CRYPTO_REDIS_CHECK_SERVER_IDENTITY = 'false',
  API_CRYPTO_REDIS_HOST = '',
  API_CRYPTO_REDIS_PORT = '',
  API_CRYPTO_REDIS_KEY_PREFIX = '',
  API_CRYPTO_REDIS_AUTH = '',
  API_CRYPTO_KEY_ROTATION_IN_DAYS = '1',
  API_CRYPTO_CLIENT_IDS = 'BROWSER',
  API_CRYPTO_STATIC_PUBLIC_KEY = '',
  API_CRYPTO_STATIC_PRIVATE_KEY = ''
} = process.env;
var REQUIRED_CONFIG = [];
var DEDICATED_REDIS = API_CRYPTO_DEDICATED_REDIS === 'true';
var REDIS_CONNECTION_CONFIG;
if (API_CRYPTO_MODE === 'STATIC') {
  REQUIRED_CONFIG.push('API_CRYPTO_STATIC_PUBLIC_KEY');
  REQUIRED_CONFIG.push('API_CRYPTO_STATIC_PRIVATE_KEY');
}
if (API_CRYPTO_MODE === 'DYNAMIC') {
  REQUIRED_CONFIG.push('API_CRYPTO_KMS_TYPE');
  if (API_CRYPTO_KMS_TYPE === 'NODE ') {
    REQUIRED_CONFIG.push('API_CRYPTO_KMS_NODE_MASTER_KEY');
  }
  if (API_CRYPTO_KMS_TYPE === 'KMS ') {
    REQUIRED_CONFIG.push('API_CRYPTO_KMS_AWS_KEY_ID');
  }
  if (DEDICATED_REDIS) {
    var REDIS_AUTH_ENABLED = API_CRYPTO_REDIS_AUTH_ENABLED === 'true';
    var REDIS_CHECK_SERVER_IDENTITY = API_CRYPTO_REDIS_CHECK_SERVER_IDENTITY === 'true';
    REQUIRED_CONFIG.push('API_CRYPTO_REDIS_HOST');
    REQUIRED_CONFIG.push('API_CRYPTO_REDIS_PORT');
    if (REDIS_AUTH_ENABLED) {
      REQUIRED_CONFIG.push('API_CRYPTO_REDIS_AUTH');
    }
    REDIS_CONNECTION_CONFIG = {
      host: API_CRYPTO_REDIS_HOST,
      port: API_CRYPTO_REDIS_PORT
    };
    if (REDIS_AUTH_ENABLED) {
      REDIS_CONNECTION_CONFIG.password = API_CRYPTO_REDIS_AUTH;
    }
    if (REDIS_CHECK_SERVER_IDENTITY) {
      REDIS_CONNECTION_CONFIG.tls = {
        checkServerIdentity: () => undefined
      };
    }
  }
}
var MISSING_CONFIG = [];
REQUIRED_CONFIG.forEach(function (key) {
  if (!process.env[key]) {
    MISSING_CONFIG.push(key);
  }
});
if (MISSING_CONFIG.length) {
  console.error("[Error] Api Crypto Config Missing: ".concat(MISSING_CONFIG.join(', ')));
  process.exit(1);
}
var KEY_ROTATION_IN_DAYS = parseInt(API_CRYPTO_KEY_ROTATION_IN_DAYS, 10);
if (isNaN(KEY_ROTATION_IN_DAYS)) {
  console.error('[Error] Api Crypto Config invalid value for key:', API_CRYPTO_KEY_ROTATION_IN_DAYS);
  process.exit(1);
}
var CONFIG = {
  MODE: API_CRYPTO_MODE,
  CLIENT_IDS: API_CRYPTO_CLIENT_IDS,
  STATIC_PUBLIC_KEY: API_CRYPTO_STATIC_PUBLIC_KEY,
  STATIC_PRIVATE_KEY: API_CRYPTO_STATIC_PRIVATE_KEY,
  KEY_ROTATION_IN_DAYS: API_CRYPTO_KEY_ROTATION_IN_DAYS,
  KMS_CONFIG: {
    TYPE: API_CRYPTO_KMS_TYPE,
    MASTER_KEY_HEX: API_CRYPTO_KMS_MASTER_KEY_HEX,
    MASTER_IV_HEX: API_CRYPTO_KMS_MASTER_IV_HEX,
    AWS_KEY_ID: API_CRYPTO_KMS_AWS_KEY_ID,
    AWS_CONNECTION_CONFIG: {
      region: API_CRYPTO_KMS_AWS_REGION
    }
  },
  DEDICATED_REDIS,
  REDIS_CONFIG: {
    CONNECTION_CONFIG: REDIS_CONNECTION_CONFIG,
    KEY_PREFIX: API_CRYPTO_REDIS_KEY_PREFIX
  }
};
var _default = CONFIG;
exports.default = _default;