Meteor.startup(() => {
  Winston = require('winston');
  require('winston-zulip');
  const fs = require('fs');

  //remove default logger
  Winston.remove(Winston.transports.Console);


  const loggerEnable = process.env.LOGGER_ENABLE || false;
  console.log('here1');
  console.log(loggerEnable);
  if (loggerEnable) {
    console.log('here2');
    const loggers = process.env.LOGGERS.split(',') || 'console';

    if (loggers.includes('console')) {
      Winston.add(Winston.transports.Console, {
        json: true,
        timestamp: true,
      });
    }

    if (loggers.includes('file')) {
      //create logs directory
      fs.mkdir('logs', (err) => {
        if (err) throw err;
      });

      const fileName = `logs/${process.env.LOGGER_FILE_NAME}` || 'logs/server.log';

      Winston.add(Winston.transports.File, {
        filename: fileName,
        json: true,
        options: {
          flags: 'a+',
        },
      });
    }

    if (loggers.includes('zulip')) {
      const loggerZulipUsername = process.env.LOGGER_ZULIP_USERNAME;
      const loggerZulipApikey = process.env.LOGGER_ZULIP_APIKEY;
      const loggerZulipRealm = process.env.LOGGER_ZULIP_REALM;
      const loggerZulipTo = process.env.LOGGER_ZULIP_TO || 'logs';
      const loggerZulipSubject = process.env.LOGGER_ZULIP_SUBJECT || 'wekan';

      Winston.add(Winston.transports.Zulip, {
        zulipUsername: loggerZulipUsername,
        zulipApikey: loggerZulipApikey,
        zulipRealm: loggerZulipRealm,
        zulipTo: loggerZulipTo,
        zulipSubject: loggerZulipSubject,
      });
    }

  }
});

